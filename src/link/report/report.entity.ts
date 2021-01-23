import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Link} from "../link.entity";
import {User} from "../../user/user.entity";

@Entity()
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne(() => Link,
        link => link.calls,
        {
            eager: false
        })
    @JoinColumn()
    link: Link;

    @ManyToOne(() => User,
        user => user.reports,
        {
            eager: false
        })
    @JoinColumn()
    user: User;

    @Column('smallint', {default: false})
    isConfirmation: boolean;

    @CreateDateColumn()
    iat: Date;
}
