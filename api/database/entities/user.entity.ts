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
		joinColumn: {name: 'user_id', referencedColumnName: 'id'},
		inverseJoinColumn: {name: 'role_id', referencedColumnName: 'id'}
	})
	roles!: Role[];

	@Column({nullable: true})
	name!: string;

	@ManyToOne(() => Tenant, tenant => tenant.users)
	@JoinColumn({ name: 'tenant_id' })
	tenant!: Tenant;

	@Column({ name: 'tenant_id' })
	tenantId!: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt!: Date;
}
