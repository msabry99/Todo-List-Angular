import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export interface Task {
  taskName: string;
  isCompleted: boolean;
  isReadonly: boolean;
}

@Component({
  selector: 'todolist',
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './todolist.html',
  styleUrl: './todolist.css',
})
export class Todolist implements OnInit, AfterViewChecked {
  @ViewChild('editInputEle', { static: false })
  editInput!: ElementRef<HTMLInputElement>;
  @ViewChild('mainInput', { static: false })
  mainInput!: ElementRef<HTMLInputElement>;
  completedTaskCount = 0;
  localStorageName = 'todo-list-v1';
  isFocusInput = false;
  currentTask: 'All' | 'Active' | 'Completed' = 'All';

  // Main Task Array
  taskList: Task[] = [];

  // Input to Focus
  onFocusInput() {
    setTimeout(() => {
      if (this.editInput.nativeElement) {
        this.editInput.nativeElement.focus();
      }
    });
  }

  // detect the dom changes
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Get Data From Localstorage
    this.getDataFromLocalStorage();
    // Get Task Completed Count
    this.onCountTaskCompleted();
  }

  // On Submit Form to get The Value of Task Name
  onAddTask(taskForm: NgForm) {
    const newValue = taskForm.controls['newTask'].value;
    this.taskList.push({
      taskName: newValue,
      isCompleted: false,
      isReadonly: true,
    });
    taskForm.reset();
    this.mainInput.nativeElement.focus();
    console.log(this.taskList);
    this.saveDataToLocalStorage();
  }

  // Save Data To Localstorage
  saveDataToLocalStorage() {
    const myTodoListData = JSON.stringify(this.taskList);
    localStorage.setItem(this.localStorageName, myTodoListData);
  }

  // Get Data From Localstorage
  getDataFromLocalStorage() {
    const dataFromLocalStorage = localStorage.getItem(this.localStorageName);
    if (dataFromLocalStorage != null) {
      this.taskList = JSON.parse(dataFromLocalStorage);
    }
  }

  // Edit And Update Task
  onEditUpdateTask(index: number) {
    this.taskList[index].isReadonly = !this.taskList[index].isReadonly;
    console.log(this.taskList);
    this.cdr.detectChanges();
    this.isFocusInput = true;
    this.saveDataToLocalStorage();
  }

  // Get Count of Completed Task
  onCountTaskCompleted() {
    this.completedTaskCount = this.taskList.filter(
      (task) => task.isCompleted
    ).length;
  }

  // To Toggle between inComplete and Complete Tasks
  onTaskComplete(index: number) {
    this.taskList[index].isCompleted = !this.taskList[index].isCompleted;
    this.onCountTaskCompleted();
    this.saveDataToLocalStorage();
  }

  // Delete Task
  onDeleteTask(index: number) {
    const deleteconfirm = confirm('Are you sure to delete this task?');
    if (deleteconfirm) {
      this.taskList.splice(index, 1);
    }
    console.log(this.taskList);
    this.saveDataToLocalStorage();
  }

  // Filter Tasks [All, Active and Completed]
  get filteredTasks() {
    if (this.currentTask === 'Active') {
      return this.taskList.filter((task) => !task.isCompleted);
    } else if (this.currentTask === 'Completed') {
      return this.taskList.filter((task) => task.isCompleted);
    } else {
      return this.taskList;
    }
  }

  ngAfterViewChecked(): void {
    if (this.isFocusInput && this.editInput) {
      this.onFocusInput();
      this.isFocusInput = false;
    }
  }
}
