import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './user.entity';
import {Repository} from 'typeorm';
import {EntityNotFoundException} from '../exceptions/EntityNotFoundException';
import {GeneratorUtil} from '../util/generator.util';
import {Session} from './session.entity';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const userMapper = require('./user.mapper');

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
    ) {
    }

    public async findById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({where: {id: id}, relations: ['pinned']});

        if (user === undefined) {
            throw new EntityNotFoundException(null, null, 'user');
        }

        return user;
    }

    public async findByEmail(mail: string): Promise<User> {
        const user = await this.userRepository.findOne({where: [{mail: mail}]});

        if (user === undefined) {
            throw new EntityNotFoundException(null, null, 'user');
        }

        return user;
    }

    public async findByUsername(username: string): Promise<User> {
        const user = await this.userRepository.findOne({where: [{username: username}]});

        if (user === undefined) {
            throw new EntityNotFoundException(null, null, 'user');
        }

        return user;
    }

    public async findByEmailOrUsername(value: string): Promise<User> {
        const user = await this.userRepository.findOne({where: [{mail: value}, {username: value}]});

        if (user === undefined) {
            throw new EntityNotFoundException(null, null, 'user');
        }

        return user;
    }

    /**
     * Fetch user based on ID of passed user object.<br/>
     * Return mapped version.
     *
     * @param user_referenced
     *
     * @throws See {@link findById} for reference
     */
    public async get(user_referenced: User) {
        let user;

        try {
            user = await this.findById(user_referenced.id);
        } catch (e) {
            throw e;
        }

        return userMapper.basic(this, user);
    }

    public async createSession(user) { // todo own session service
        const refreshToken = GeneratorUtil.makeid(40);

        const session = new Session();
        session.refreshToken = refreshToken;
        session.user = user;
        session.last_used = new Date();

        await this.sessionRepository.save(session);

        return session;
    }

    public async sessionExists(refreshToken: string, id: string) {
        const session = await this.sessionRepository.findOne({where: {refreshToken: refreshToken, user: id}});

        if (session === undefined) {
            throw new EntityNotFoundException();
        }

        session.last_used = new Date();
        session.times_used = session.times_used + 1;
        await this.sessionRepository.save(session);

        return session;
    }

    private async _existsByUsername(username: string) {
        return this.findByUsername(username)
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }

    private async _existsByMail(mail: string) {
        return this.findByEmail(mail)
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }
}
