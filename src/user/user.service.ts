import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from './user.entity';
import {Repository} from 'typeorm';
import {EntityNotFoundException} from '../exceptions/EntityNotFoundException';
import {GeneratorUtil} from '../util/generator.util';
import {Session} from './session.entity';
import {PasswordUtil} from "../util/password.util";
import {DuplicateValueException} from "../exceptions/DuplicateValueException";
import {MailerService} from "@nestjs-modules/mailer";
import {EntityGoneException} from "../exceptions/EntityGoneException";
import {AlreadyUsedException} from "../exceptions/AlreadyUsedException";
import {InvalidTokenException} from "../exceptions/InvalidTokenException";

const btoa = require('btoa');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const userMapper = require('./user.mapper');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
        private mailerService: MailerService,
    ) {
    }

    public async findById(id: string): Promise<User> {
        const user = await this.userRepository.findOne({where: {id: id}});

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
        const session = await this.sessionRepository.findOne({where: {refreshToken: refreshToken, user: {id}}});

        if (session === undefined) {
            throw new EntityNotFoundException();
        }

        session.last_used = new Date();
        session.times_used = session.times_used + 1;
        await this.sessionRepository.save(session);

        return session;
    }

    /**
     * Create a new account based on the passed parameters.<br/>
     * On success send activation email to specified email address
     *
     * @param user_raw User Object with data to be
     *
     * @throws See {@link _checkForDuplicateValues} for reference
     */
    public async register(user_raw: User) {
        const user = new User();

        await this._checkForDuplicateValues(user_raw);

        user.username = user_raw.username;
        user.mail = user_raw.mail;
        user.password = PasswordUtil.cryptPassword(user_raw.password);

        const savedUser = await this.userRepository.save(user);

        this._sendRegisterEmail(savedUser);

        return userMapper.basic(this, savedUser);
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

    private async _checkForDuplicateValues(user: User) {
        const duplicateValues = [];
        if (await this._existsByUsername(user.username)) {
            duplicateValues.push('username');
        }

        if (await this._existsByMail(user.mail)) {
            duplicateValues.push('email');
        }

        if (duplicateValues.length > 0) {
            throw new DuplicateValueException(null, null, duplicateValues);
        }
    }

    private _sendRegisterEmail(user: User) {
        const token = crypto.createHmac('sha256',
            user.mail + process.env.SALT_MAIL + user.username + (new Date(user.iat)).getTime())
            .digest('hex');

        this.mailerService
            .sendMail({
                to: user.mail,
                from: process.env.MAIL_DEINLI,
                subject: 'Neuer Account',
                template: 'register',
                context: {
                    name: user.username,
                    url: process.env.DOMAIN + `/activate?mail=${btoa(user.mail).replace(new RegExp(/\=/g), '')}&token=${token}`
                },
            })
            .then(() => {
                // 
            })
            .catch(() => {
                //
            });
    }

    /**
     * Activate created account (set activated attribute to 1).<br/>
     * Proper error messages on invalid token or already used
     *
     * @param mail String email address of account to activate
     * @param token String token send with mail on account creation
     */
    public async activateAccount(mail: string, token: string) {
        let user;

        try {
            user = await this.findByEmail(mail);
        } catch (e) {
            throw new EntityGoneException();
        }

        const verifyingToken = crypto
            .createHmac('sha256', user.mail + process.env.SALT_MAIL + user.username + user.iat.getTime())
            .digest('hex');

        const tokenIsValid = verifyingToken === token;

        if (tokenIsValid) {
            if (!!user.activated === false) {
                user.activated = true;
                await this.userRepository.save(user);

                return;
            }

            throw new AlreadyUsedException(null, 'User is already verified');
        }

        throw new InvalidTokenException();
    }
}
