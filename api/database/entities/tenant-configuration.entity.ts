import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn
} from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('tenant_configurations')
export class TenantConfiguration {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column()
	name!: string;

	@Column({ type: 'text' })
	value!: string;

	@Column({ type: 'jsonb', nullable: true })
	metadata?: Record<string, any>;

	@ManyToOne(() => Tenant, tenant => tenant.configurations)
	@JoinColumn({ name: 'tenantId' })
	tenant!: Tenant;

	@Column({ name: 'tenantId' })
	tenantId!: string;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
