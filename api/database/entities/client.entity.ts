// src/clients/client.entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn, JoinColumn, ManyToOne
} from 'typeorm';
import {User} from './user.entity';
import {Tenant} from "./tenant.entity";

@Entity('clients')
export class Client {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({unique: true})
	name!: string;

	@ManyToOne(() => Tenant, tenant => tenant.clients)
	@JoinColumn({ name: 'tenant_id' })
	tenant!: Tenant;

	@Column({ name: 'tenant_id' })
	tenantId!: string;

	@Column({default: true, name: 'is_active'})
	isActive!: boolean;

	@CreateDateColumn({name: 'created_at'})
	createdAt!: Date;

	@UpdateDateColumn({name: 'updated_at'})
	updatedAt!: Date;


}
