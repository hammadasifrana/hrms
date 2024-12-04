import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToMany,
	JoinTable, ManyToOne, JoinColumn
} from 'typeorm';
import {Permission} from './permission.entity';
import {Tenant} from "./tenant.entity";

@Entity('roles')
export class Role {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({unique: true})
	name!: string;

	@Column({nullable: true})
	description?: string;

	@ManyToOne(() => Tenant, tenant => tenant.roles)
	@JoinColumn({ name: 'tenantId' })
	tenant!: Tenant;

	@Column({ name: 'tenantId' })
	tenantId!: string;

	@ManyToMany(() => Permission, {eager: true, cascade: true})
	@JoinTable({
		name: 'roles_permissions',
		joinColumn: {name: 'roleId', referencedColumnName: 'id'},
		inverseJoinColumn: {name: 'permissionId', referencedColumnName: 'id'}
	})
	permissions!: Permission[];
}
