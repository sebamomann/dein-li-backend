import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Link} from '../link.entity';

@Entity()
export class LinkPermission {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	token: string;

	@Column({default: null})
	comment: string;

	@Column('timestamp', {
		nullable: false,
		default: () => 'CURRENT_TIMESTAMP',
		name: 'expiration',
	})
	expiration: Date;

	@ManyToOne(() => Link,
		link => link.permissions,
		{
			eager: true,
		})
	@JoinColumn()
	link: Link;

	@CreateDateColumn()
	iat: Date;
}
