import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "../user/user.entity";
import {Call} from "./call/call.entity";

@Entity()
export class Link {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    short: string;

    @Column()
    original: string;

    @Column({default: true, comment: "1: active, -1: deprecated, -2: locked, -3: deleted"})
    isActive: number;

    @ManyToOne(() => User,
        user => user.links,
        {
            eager: true
        })
    @JoinColumn()
    creator: User;

    @OneToMany(() => Call,
        call => call.link,
        {
            eager: false
        })
    @JoinColumn()
    calls: Call[];

    @CreateDateColumn()
    iat: Date;

    nrOfCalls: number;
}
