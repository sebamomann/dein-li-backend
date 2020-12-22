import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {cors: true});

    app.use(function (req, res, next) {
        const allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://localhost:4200', 'https://manage.dein.li'];
        const origin = req.headers.origin;
        if (allowedOrigins.indexOf(origin) > -1) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }

        res.setHeader('Access-Control-Allow-Origin', '*');

        res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE, HEAD');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, If-None-Match');
        res.header('Access-Control-Allow-Credentials', true);
        res.header('access-control-expose-headers', 'etag');
        return next();
    });

    await app.listen(3000);
}

bootstrap();
