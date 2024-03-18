import { Injectable } from '@angular/core';
import { unescape } from 'querystring';
import { Observable, of, interval, BehaviorSubject, timer, switchMap, from, map, tap, Subject, takeUntil, shareReplay } from 'rxjs';
import { BaseService, UrlBuilder } from '../util/base.service';


export interface TaskResultValue {
  status: number,
  message: boolean,
  time: number,
}


export interface TaskStatus {
  ready: boolean,
  successful: boolean,
  date_done: string,
  value: TaskResultValue
}

export interface Task {
  id: string,
  title: string,
  description: string,
  timestamp: any,
  status?: TaskStatus,
  startTime?: string
}

@Injectable({
  providedIn: 'root'
})
export class TaskDisplayService extends BaseService {
  constructor() {
    super()
    /* load old tasks from local */
    try {
      const storedTasks = localStorage["tasks"] || []
      this.tasks = JSON.parse(storedTasks)
    } catch (e) { }
  }

  /* when all tasks are completed this subject gets pushed and completes the tasks$ observable polling status info from backend */
  private destroy$ = new Subject<void>()
  private cancelPolling() {
    this.destroy$.next()
  }

  /* subscribe to get notified when new tasks arrived  */
  public newTasksArrived$ = new Subject<void>()

  /* holds the current tasks from tasks$ for reference */
  private tasks: Task[] = []

  /* subscribe to get tasks with current status from backend  */
  public tasks$: Observable<Task[]> = timer(0, 3000)
    .pipe(
      takeUntil(this.destroy$),
      switchMap(() => from(this.buildRequestPromise())),
      map(
        (statusData) => this.tasks.map((task) => this.applyStatus(task, statusData))
      ),
      tap(((tasks: Task[]) => {
        const pending = this.pendingTasks(tasks)
        console.log("pendingTasks()", pending.length, "vs", this.pendingTasks(this.tasks).length)
        this.setTasks(tasks)
        if (pending.length === 0) {
          this.cancelPolling()
        }
      }))
    )

  private tasksHaveUpdates(tasks: Task[]) {
    return this.pendingTasks(tasks).length !== this.pendingTasks(this.tasks).length
  }

  private setTasks(tasks: Task[]) {
    const updated = this.tasksHaveUpdates(tasks)
    console.log("setTasks::updated=", updated);

    if (updated) {
      this.tasks = tasks
      console.log("TaskService;;newTasksArrived$.next()");

      this.newTasksArrived$.next()
      this.storeTasksLocal()
    }
  }

  private applyStatus(task: Task, statusData: any[]) {
    const stat = statusData.find((status) => status["task_id"] === task.id)
    console.log("applyStatus ::", task.id, task.title, "==stat==>", stat);
    const taskCopy = { ...task }
    taskCopy.status = stat

    return taskCopy
  }

  private pendingTasks(tasks: Task[]) {
    return tasks.filter(task => task.status === undefined || task.status.ready === false)
  }

  addTask(taskId: string, title: string, description: string) {
    if (this.tasks.find((task) => task.id === taskId)) {
      throw Error(`Task was already in task list: ${taskId}`)
    }
    this.tasks.unshift(
      {
        id: taskId,
        title: title,
        description: description,
        startTime: new Date().toLocaleTimeString("de-DE"),
        timestamp: Date.now()
      }
    )

    this.storeTasksLocal()
  }

  private storeTasksLocal() {
    localStorage["tasks"] = JSON.stringify(this.tasks)
  }

  removeTask(taskId: string) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId)
    this.storeTasksLocal()
  }

  private buildRequestPromise(): Promise<any[]> {
    const url = new UrlBuilder()
      .base(BaseService.BASE_URL)
      .resource("tasks")
      .build()
    const taskIds = this.tasks.map((task) => task.id)
    const options = this.buildPostRequestOptions(JSON.stringify(taskIds))
    console.log("FETCH TASKS NOW");

    return this.fetchAndParseFromUrl<any>(
      {
        url: url,
        requestOptions: options
      }
    )
  }

  removeAllTasks() {
    this.tasks = []
    this.storeTasksLocal()
  }


}
