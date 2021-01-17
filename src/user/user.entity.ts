import {Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Session} from './session.entity';
import {Link} from "../link/link.entity";
import {Exclude} from 'class-transformer';
import {Report} from "../link/report/report.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true
    })
    username: string;

    @Column({select: true})
    @Exclude({toPlainOnly: true})
    password: string;

    @Column({
        unique: true
    })
    mail: string;

    @Column('smallint', {default: false})
    activated: boolean;

    @OneToMany(() => Link,
        link => link.creator,
        {
            eager: false
        }
    )
    links: Link[];

    @OneToMany(() => Session, session => session.user,
        {
            onUpdate: 'NO ACTION'
        })
    sessions: Session[];

    @OneToMany(() => Report,
        report => report.user,
        {
            eager: false
        })
    @JoinColumn()
    reports: Report[];

    @CreateDateColumn()
    iat: Date;

    session: { refreshToken: string, token: string };
}
