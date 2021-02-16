import {Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Call} from "./call/call.entity";
import {Report} from "./report/report.entity";

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

    @Column({nullable: true, type: "uuid"})
    creatorId: string;

    @OneToMany(() => Call,
        call => call.link,
        {
            eager: false
        })
    @JoinColumn()
    calls: Call[];

    @OneToMany(() => Report,
        report => report.link, {
            eager: false
        })
    @JoinColumn()
    reports: Report[];

    @CreateDateColumn()
    iat: Date;

    nrOfCalls: number;
}
