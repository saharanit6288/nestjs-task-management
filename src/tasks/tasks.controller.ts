import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTasksFilterDTO,
    @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all tasks, filters: ${JSON.stringify(filterDto)}`);
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id') taskId: string,
    @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(taskId, user);
  }

  @Post()
  createTask(
    @Body() createTask: CreateTaskDTO,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.createTask(createTask, user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id') taskId: string,
    @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTask(taskId, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') taskId: string, 
    @Body() updateTaskStatus: UpdateTaskStatusDTO,
    @GetUser() user: User): Promise<Task> {
    const {status} = updateTaskStatus;
    return this.tasksService.updateTaskStatus(taskId, status, user);
  }

}
