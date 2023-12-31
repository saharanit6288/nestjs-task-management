import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    signUp(@Body() authCredentials: AuthCredentialsDTO): Promise<void> {
        return this.authService.signUp(authCredentials);
    }

    @Post('/signin')
    signIn(@Body() authCredentials: AuthCredentialsDTO): Promise<{accessToken: string}> {
        return this.authService.singIn(authCredentials);
    }
}
