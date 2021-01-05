import {Body, Controller, HttpStatus, Post, Res} from '@nestjs/common';
import {UserService} from "./user.service";
import {User} from "./user.entity";

import {Response} from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post()
    register(@Body() user: User,
             @Res() res: Response) {
        return this.userService
            .register(user)
            .then(result => {
                res.status(HttpStatus.CREATED).json(result);
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
    }
}
