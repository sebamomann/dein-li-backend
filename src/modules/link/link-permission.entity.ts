import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Link} from './link.entity';

@Entity()
export class LinkPermission {
	@PrimaryGeneratedColumn('uuid')
	id: number;

	@Column()
	token: string;

	@ManyToOne(() => Link,
		link => link.permissions,
		{
			eager: false,
		})
	@JoinColumn()
	link: Link;

	@CreateDateColumn()
	iat: Date;
}
