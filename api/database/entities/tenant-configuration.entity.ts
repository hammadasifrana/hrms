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
	@JoinColumn({ name: 'tenant_id' })
	tenant!: Tenant;

	@Column({ name: 'tenant_id' })
	tenantId!: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt!: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt!: Date;
}
