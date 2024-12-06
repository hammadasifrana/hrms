import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToMany,
	JoinTable, JoinColumn, ManyToOne
} from "typeorm";
import {Role} from './role.entity';
import {Client} from "./client.entity";
import {Tenant} from "./tenant.entity";

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({unique: true})
	email!: string;

	@Column()
	password!: string;

	@ManyToMany(() => Role, {eager: true, cascade: true})
	@JoinTable({
		name: 'user_roles',
		joinColumn: {name: 'userId', referencedColumnName: 'id'},
		inverseJoinColumn: {name: 'roleId', referencedColumnName: 'id'}
	})
	roles!: Role[];

	@Column({nullable: true})
	name!: string;

	@ManyToOne(() => Tenant, tenant => tenant.users)
	@JoinColumn({ name: 'tenantId' })
	tenant!: Tenant;

	@Column({ name: 'tenantId' })
	tenantId!: string;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
