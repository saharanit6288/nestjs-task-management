import { DataSource, Repository } from "typeorm";
import { Task } from "./task.entity";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDTO } from "./dto/get-tasks-filter.dto";
import { User } from "src/auth/user.entity";

@Injectable()
export class TasksRepository extends Repository<Task> {
    private logger = new Logger('TasksRepository');
    constructor(private dataSource: DataSource)
    {
        super(Task, dataSource.createEntityManager());
    }

    async getTasks(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
        const {status, search} = filterDto;
        const query = this.createQueryBuilder('task');
        query.where({ user });

        if(status) {
            query.andWhere('task.status = :status', { status });
        }

        if(search) {
            query.andWhere(
                '(LOWER(task.title) Like LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                {search: `%${search}%`}
            )
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch(error) {
            this.logger.error(`Failed to get tasks for user "${user.username}", Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createTask(createTask: CreateTaskDTO, user: User): Promise<Task> {
        const {title, description} = createTask;

        const task = this.create({
            title,
            description,
            status: TaskStatus.Open,
            user
        });

        await this.save(task);
        return task;
    }
}