import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Link } from "../link.entity";

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

    @Column({ nullable: true, type: "uuid" })
    userId: string;

    @Column('smallint', { default: false })
    isConfirmation: boolean;

    @CreateDateColumn()
    iat: Date;
}
