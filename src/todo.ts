import { action, computed, observable, reaction, when } from "mobx";

let runningId = 0;

class Todo {
  id: number = runningId++;

  @observable
  name: string;

  @observable
  isCompleted: boolean = false;

  private disposer: () => void;

  constructor(name: string) {
    this.name = name;

    this.disposer = reaction(
      () => this.isCompleted,
      () =>
        console.log(
          `Todo ${this.name} is ${this.isCompleted ? "Done" : "Incomplete"}`
        )
    );
  }

  @action
  addNewTodo() {}

  @action
  toggleTodo() {
    this.isCompleted = !this.isCompleted;
  }

  @action
  updateName(name: string) {
    this.name = name;
  }

  dispose() {
    this.disposer();
  }
}

class TodoList {
  @observable
  todoList: Todo[] = [];

  constructor() {
    reaction(
      () => this.todoList.length,
      () =>
        console.log(
          `Current Todo count: ${this.todoList.length}, Done Todos: ${this.completedTodos}, Incomplete Todos: ${this.incompleteTodos}`
        )
    );

    when(
      () =>
        this.todoList.length > 0 &&
        this.todoList.every((todo) => todo.isCompleted),
      () => console.log("Congratulations all todos completed")
    );
  }

  @action
  addTodo(name: string) {
    this.todoList.push(new Todo(name));
  }

  getTodo(name: string) {
    return this.todoList.find((todo) => todo.name === name);
  }

  @action
  removeTodo(name: string) {
    const todoToRemove = this.getTodo(name);

    if (todoToRemove) {
      todoToRemove.dispose();
      const todoToRemoveIndex = this.todoList.indexOf(todoToRemove);
      this.todoList.splice(todoToRemoveIndex, 1);
    }
  }

  @computed
  get completedTodos() {
    return this.todoList.filter((todo) => todo.isCompleted).length;
  }

  @computed
  get incompleteTodos() {
    return this.todoList.filter((todo) => !todo.isCompleted).length;
  }
}

const todoList = new TodoList();
todoList.addTodo("Learn Mobx");
todoList.addTodo("Get a job");
todoList.addTodo("Work");

todoList.getTodo("Learn Mobx")?.toggleTodo();
todoList.getTodo("Get a job")?.toggleTodo();
todoList.getTodo("Work")?.toggleTodo();
