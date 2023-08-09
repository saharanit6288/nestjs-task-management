import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private taskRepository: TasksRepository,
  ) {}
    
  getTasks(filterDto: GetTasksFilterDTO): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id });

    if(!found){
      throw new NotFoundException();
    }

    return found;
  }

  createTask(createTask: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.createTask(createTask);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if(result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;

    await this.taskRepository.save(task);
    return task;
  }
  
}
