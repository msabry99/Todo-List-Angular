import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'todolist',
  imports: [CommonModule, FormsModule],
  templateUrl: './todolist.html',
  styleUrl: './todolist.css',
})
export class Todolist implements OnInit {
  @ViewChild('editInput', { static: false })
  editInput!: ElementRef<HTMLInputElement>;
  @ViewChild('mainInput', { static: false })
  mainInput!: ElementRef<HTMLInputElement>;
  completedTaskCount = 0;
  localStorageName = 'todo-list-v1';

  taskList: { taskName: string; isCompleted: boolean; isReadOnly: boolean }[] =
    [
      {
        taskName: 'Brush Teeth',
        isCompleted: false,
        isReadOnly: true,
      },
    ];

  ngOnInit(): void {
    this.getDataFromLocalStorage();
    this.onCountTaskCompleted();
  }

  onAddTask(taskForm: NgForm) {
    const newValue = taskForm.controls['newTask'].value;
    this.taskList.push({
      taskName: newValue,
      isCompleted: false,
      isReadOnly: true,
    });
    taskForm.reset();
    setTimeout(() => {
      this.mainInput.nativeElement.focus();
    }, 1);
    console.log(this.taskList);
    this.saveDataToLocalStorage();
  }

  saveDataToLocalStorage() {
    const myTodoListData = JSON.stringify(this.taskList);
    localStorage.setItem(this.localStorageName, myTodoListData);
  }

  getDataFromLocalStorage() {
    const dataFromLocalStorage = localStorage.getItem(this.localStorageName);
    if (dataFromLocalStorage != null) {
      this.taskList = JSON.parse(dataFromLocalStorage);
    }
  }

  onEditUpdateTask(index: number) {
    this.taskList[index].isReadOnly = !this.taskList[index].isReadOnly;
    if (!this.taskList[index].isReadOnly) {
      setTimeout(() => {
        this.editInput.nativeElement.focus();
      }, 1000);
    }
    console.log(this.taskList);
    this.saveDataToLocalStorage();
  }

  onCountTaskCompleted() {
    this.completedTaskCount = this.taskList.filter(
      (task) => task.isCompleted
    ).length;
  }

  onTaskComplete(index: number) {
    this.taskList[index].isCompleted = !this.taskList[index].isCompleted;
    console.log(this.taskList);
    this.onCountTaskCompleted();
    this.saveDataToLocalStorage();
  }

  onDeleteTask(index: number) {
    const deleteconfirm = confirm('Are you sure to delete this task?');
    if (deleteconfirm) {
      this.taskList.splice(index, 1);
    }
    console.log(this.taskList);
    this.saveDataToLocalStorage();
  }
}
