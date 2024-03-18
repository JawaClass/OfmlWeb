import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDisplayService } from '../task-display.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { HoldableDirective } from '../../util/directives/holdable.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { TaskDisplayComponent } from "../task-display/task-display.component";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-task-display-list',
    standalone: true,
    templateUrl: './task-display-list.component.html',
    styleUrl: './task-display-list.component.css',
    imports: [CommonModule, MatDividerModule, MatProgressSpinnerModule, MatIconModule, HoldableDirective, MatButtonModule, TaskDisplayComponent, MatTooltipModule]
})
export class TaskDisplayListComponent {
 
  service = inject(TaskDisplayService)
  tasks$ = this.service.tasks$

  dialogRef = inject(MatDialogRef<TaskDisplayListComponent>)

  minimize() {
    this.dialogRef.close()
  }

  removeAllTasks() {
    this.service.removeAllTasks()
  }
}
