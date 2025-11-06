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
  id: number;
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
  activeTaskCount = 0;
  completedTaskCount = 0;
  localStorageTodoList = 'todo-list-data';
  localStorageTodoListFilter = 'todo-list-filter';
  isFocusInput = false;
  currentTask: 'All' | 'Active' | 'Completed' | string = 'All';

  // Main Task Array
  taskList: Task[] = [];

  // Filter Buttons List
  taskListFilterBtn = ['All', 'Active', 'Completed'];

  // Input to Focus After Input Appear on DOM
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
    // Get Task Active Count
    this.onCountTaskActive();
  }

  // On Submit Form to get The Value of Task Name
  onAddTask(taskForm: NgForm) {
    const newValue = taskForm.controls['newTask'].value;
    this.taskList.push({
      id: Date.now(),
      taskName: newValue,
      isCompleted: false,
      isReadonly: true,
    });
    taskForm.reset();
    this.mainInput.nativeElement.focus();
    this.saveDataToLocalStorage();
    this.onCountTaskActive();
    this.currentTask = 'All';
    console.log(this.taskList);
  }

  // Save Data To Localstorage
  saveDataToLocalStorage() {
    // Save main todo list in localstorage
    const myTodoListData = JSON.stringify(this.taskList);
    localStorage.setItem(this.localStorageTodoList, myTodoListData);

    // Save main Filter in localstorage
    const filteredTodoListData = JSON.stringify(this.currentTask);
    localStorage.setItem(this.localStorageTodoListFilter, filteredTodoListData);
  }

  // Get Data From Localstorage
  getDataFromLocalStorage() {
    // Get main Todo List from Localstorage
    const dataFromLocalStorage = localStorage.getItem(
      this.localStorageTodoList
    );
    if (dataFromLocalStorage != null) {
      this.taskList = JSON.parse(dataFromLocalStorage);
    }

    // Get main Todo List Filter from Localstorage
    const filteredDataFromLocalStroage = localStorage.getItem(
      this.localStorageTodoListFilter
    );
    if (filteredDataFromLocalStroage != null) {
      this.currentTask = JSON.parse(filteredDataFromLocalStroage);
    }
  }

  // Edit And Update Task
  onEditUpdateTask(task: Task) {
    task.isReadonly = !task.isReadonly;
    console.log(this.taskList);
    this.cdr.detectChanges();
    this.isFocusInput = true;
    this.saveDataToLocalStorage();
  }

  // Get Count of Active Tasks
  onCountTaskActive() {
    this.activeTaskCount = this.taskList.filter(
      (task) => !task.isCompleted
    ).length;
  }

  // Get Count of Completed Tasks
  onCountTaskCompleted() {
    this.completedTaskCount = this.taskList.filter(
      (task) => task.isCompleted
    ).length;
  }

  // To Toggle between inComplete and Complete Tasks
  onTaskComplete(task: Task) {
    task.isCompleted = !task.isCompleted;
    this.onCountTaskActive();
    this.onCountTaskCompleted();
    this.saveDataToLocalStorage();
  }

  // Delete Task
  onDeleteTask(task: Task) {
    const deleteconfirm = confirm('Are you sure to delete this task?');
    if (!deleteconfirm) {
      return;
    }
    const selectedIndex = this.taskList.findIndex(
      (item) => item.id === task.id
    );
    if (selectedIndex > -1) {
      this.taskList.splice(selectedIndex, 1);
    }
    console.log(this.taskList);
    this.onCountTaskActive();
    this.onCountTaskCompleted();
    this.saveDataToLocalStorage();
    if (this.taskList.length <= 1 || this.completedTaskCount === 0) {
      this.currentTask = 'All';
    }
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

  // Delete All
  onDeleteAll() {
    const confirmMessage = confirm('Are you sure to delete all tasks?');
    if (!confirmMessage) {
      return;
    }
    this.taskList = [];
    this.onCountTaskActive();
    this.onCountTaskCompleted();
    this.saveDataToLocalStorage();
  }

  // Check Content After Checked to make focus on input after appear on Dom
  ngAfterViewChecked(): void {
    if (this.isFocusInput && this.editInput) {
      this.onFocusInput();
      this.isFocusInput = false;
    }
  }
}
