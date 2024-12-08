import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { Employee } from './employee.entity';

@Entity('departments')
export class Department {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @ManyToOne(() => Tenant, tenant => tenant.departments)
    @JoinColumn({ name: 'tenant_id' })
    tenant!: Tenant;

    @OneToMany(() => Employee, employee => employee.department)
    employees!: Employee[];
}
