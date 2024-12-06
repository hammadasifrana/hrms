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
	@JoinColumn({ name: 'tenantId' })
	tenant!: Tenant;

	@Column({ name: 'tenantId' })
	tenantId!: string;

	@Column({default: true})
	isActive!: boolean;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;


}
