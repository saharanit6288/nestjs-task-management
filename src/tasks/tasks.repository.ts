import { DataSource, Repository } from "typeorm";
import { Task } from "./task.entity";
import { Injectable } from "@nestjs/common";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDTO } from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksRepository extends Repository<Task> {
    constructor(private dataSource: DataSource)
    {
        super(Task, dataSource.createEntityManager());
    }

    async getTasks(filterDto: GetTasksFilterDTO): Promise<Task[]> {
        const {status, search} = filterDto;
        const query = this.createQueryBuilder('task');

        if(status) {
            query.andWhere('task.status = :status', { status });
        }

        if(search) {
            query.andWhere(
                'LOWER(task.title) Like LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
                {search: `%${search}%`}
            )
        }

        const tasks = await query.getMany();

        return tasks;
    }

    async createTask(createTask: CreateTaskDTO): Promise<Task> {
        const {title, description} = createTask;

        const task = this.create({
            title,
            description,
            status: TaskStatus.Open
        });

        await this.save(task);
        return task;
    }
}