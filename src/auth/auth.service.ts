import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository,
        private jwtService: JwtService
      ) {}

    signUp(authCredentials: AuthCredentialsDTO): Promise<void> {
        return this.usersRepository.createUser(authCredentials);
    }

    async singIn(authCredentials: AuthCredentialsDTO): Promise<{accessToken: string}> {
        const {username, password} = authCredentials;

        const user = this.usersRepository.findOne({where: {username}});

        if(user && (await bcrypt.compare(password, (await user).password))) {
            const payload: JwtPayload = {username};
            const accessToken = await this.jwtService.sign(payload);

            return {accessToken};
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }
}
