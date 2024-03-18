import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskDisplayService } from '../task-display.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { HoldableDirective } from '../../util/directives/holdable.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, map, takeWhile, timer } from 'rxjs';

@Component({
  selector: 'app-task-display',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, HoldableDirective, MatButtonModule, MatTooltipModule],
  templateUrl: './task-display.component.html',
  styleUrl: './task-display.component.css'
})
export class TaskDisplayComponent implements OnInit {
  @Input() task!: Task
  service = inject(TaskDisplayService)

  elapsedSeconds$ = new Observable()

  ngOnInit() {
    if (this.isWorking()) {
      this.elapsedSeconds$ = timer(0, 1000)
      .pipe(
        takeWhile(_ => this.isWorking()),
        map(_ => Math.round((Date.now() - this.task.timestamp) / 1000))
      )
    }
  }

  deleteTask(task: any) {
   this.service.removeTask(task.id)
  }

  isSuccessful() {
    return this.task.status?.successful
  }
  isFailure() {
    return (this.task.status) && !this.task.status.successful
  }
  isWorking() {
    return (!this.task.status) || !this.task.status.ready
  }

  getStatusText(status: number) {
    return status === 1 ? "Erfolgreich durchgeführt." : "Nicht durchführbar."
  }

  getElapsedSeconds(timestamp: number) {
    return (Date.now() - timestamp) / 1000
  }

}
