import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    ManyToOne,
    JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany
} from 'typeorm';
import { User } from './user.entity';
import { Tenant } from './tenant.entity';
import { Department } from './department.entity';
import { EmployeeType } from '../enums/employee-type.enum';

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({name: 'first_name'})
    firstName!: string;

    @Column({name: 'last_name'})
    lastName!: string;

    @Column({ nullable: false, unique: true })
    email?: string;

    @Column({ nullable: true, name: 'phone_number' })
    phoneNumber?: string;

    @Column({ nullable: true, name:'profile_picture_url' })
    profilePictureUrl?: string;

    @Column({ name: 'joining_date', nullable: true, type: 'date'})
    joiningDate?: Date;

    @Column({ default: true, name: 'is_active' })
    isActive!: boolean;

    @Column({
        type: 'enum',
        enum: EmployeeType,
        default: EmployeeType.FULL_TIME,
        name: 'employee_type'

    })
    employeeType!: EmployeeType;

    // Manager relationship (self-referencing)
    @ManyToOne(() => Employee, employee => employee.directReports, {
        nullable: true
    })
    @JoinColumn({ name: 'manager_id' })
    manager?: Employee;

    // Direct reports (employees managed by this employee)
    @OneToMany(() => Employee, employee => employee.manager)
    directReports!: Employee[];

    @OneToOne(() => User, user => user.employee)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Tenant, tenant => tenant.employees)
    @JoinColumn({ name: 'tenant_id' })
    tenant!: Tenant;

    @ManyToOne(() => Department, department => department.employees)
    @JoinColumn({ name: 'department_id' })
    department!: Department;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    // Computed full name
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
