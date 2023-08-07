import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import {v4 as uuid} from 'uuid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): any[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDTO) {
    let data = this.getAllTasks();
    const {status, search} = filterDto;

    if(status) {
      data = data.filter((task) => task.status === status);
    }

    if(search) {
      data = data.filter((task) => {
        if(task.title.includes(search) || task.description.includes(search)){
          return true;
        }
        return false;
      });
    }

    return data;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    if(!found){
      throw new NotFoundException();
    }

    return found;
  }

  createTask(createTask: CreateTaskDTO): Task {
    const {title, description} = createTask;

    const task: Task = {
      id:uuid(),
      title,
      description,
      status: TaskStatus.Open
    };

    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    const task = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== task.id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

}
