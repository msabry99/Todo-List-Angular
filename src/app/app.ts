import { Component, signal } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Todolist } from './todolist/todolist';

@Component({
  selector: 'app-root',
  imports: [NgbModule, Todolist],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('todo-list-v1');
}
