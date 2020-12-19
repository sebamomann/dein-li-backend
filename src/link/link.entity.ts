import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "../user/user.entity";

@Entity()
export class Link {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    short: string;

    @Column()
    original: webkitURL;

    @Column({default: true})
    isActive: boolean;

    @ManyToOne(() => User,
        user => user.links,
        {
            eager: true
        })
    @JoinColumn()
    creator: User;

    @CreateDateColumn()
    iat: Date;
}
