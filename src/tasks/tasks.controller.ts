import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDTO): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') taskId: string): Promise<Task> {
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  createTask(@Body() createTask: CreateTaskDTO): Promise<Task> {
    return this.tasksService.createTask(createTask);
  }

  @Delete('/:id')
  deleteTask(@Param('id') taskId: string): Promise<void> {
    return this.tasksService.deleteTask(taskId);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') taskId: string, 
    @Body() updateTaskStatus: UpdateTaskStatusDTO): Promise<Task> {
    const {status} = updateTaskStatus;
    return this.tasksService.updateTaskStatus(taskId, status);
  }

}
