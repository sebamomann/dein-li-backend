import {Body, Controller, Get, HttpStatus, Param, Post, Res} from '@nestjs/common';
import {UserService} from "./user.service";
import {User} from "./user.entity";

import {Response} from 'express';

const atob = require('atob');

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

    @Get('/verify/:mail/:token')
    activate(@Param('mail') mail: string,
             @Param('token') token: string,
             @Res() res: Response) {
        return this.userService
            .activateAccount(atob(mail), token)
            .then(() => {
                res.status(HttpStatus.NO_CONTENT).json();
            })
            .catch(err => {
                throw err;
            });
    }
}
