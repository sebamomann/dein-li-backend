import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Link} from "../link.entity";

@Entity()
export class Call {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne(() => Link,
        link => link.calls,
        {
            eager: false
        })
    @JoinColumn()
    link: Link;

    @Column({nullable: false, default: 1})
    status: number;

    @Column()
    agent: string;

    @CreateDateColumn()
    iat: Date;
}
