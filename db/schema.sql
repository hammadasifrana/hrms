-- auto-generated definition
create table roles
(
    id          int auto_increment
        primary key,
    created_at  datetime(6)                           null,
    description varchar(255)                          not null,
    name        enum ('ADMIN', 'SUPER_ADMIN', 'USER') not null,
    updated_at  datetime(6)                           null,
    constraint UK_ofx66keruapi6vyqpv6f2or37
        unique (name)
);

-- auto-generated definition
create table users
(
    id         int auto_increment
        primary key,
    client_id  int          not null,
    created_at datetime(6)  null,
    email      varchar(100) not null,
    full_name  varchar(255) not null,
    password   varchar(255) not null,
    updated_at datetime(6)  null,
    role_id    int          not null,
    constraint UK_6dotkott2kjsp8vw4d0m25fb7
        unique (email),
    constraint FKp56c1712k691lhsyewcssf40f
        foreign key (role_id) references roles (id)
);



CREATE TABLE clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    plan_id INT NOT NULL, -- Subscription plan
    subscription_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    subscription_start_date DATE,
    subscription_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id)
);

CREATE TABLE subscription_plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- e.g., Basic, Premium, Enterprise
    description TEXT,
    price_per_month DECIMAL(10, 2) NOT NULL,
    price_per_year DECIMAL(10, 2), -- Optional annual price
    max_users INT, -- Limit on the number of employees
    max_storage_gb INT, -- Storage limit in GB
    features JSON, -- List of features as JSON (e.g., {"payroll": true, "attendance": true})
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    plan_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method ENUM('credit_card', 'bank_transfer', 'paypal', 'stripe') NOT NULL,
    transaction_id VARCHAR(255), -- Unique transaction identifier
    payment_status ENUM('success', 'failed', 'pending') DEFAULT 'success',
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id)
);

CREATE TABLE invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE NOT NULL,
    status ENUM('paid', 'unpaid', 'overdue') DEFAULT 'unpaid',
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE subscription_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    old_plan_id INT,
    new_plan_id INT,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT, -- e.g., "Upgrade", "Downgrade", or "Cancellation"
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (old_plan_id) REFERENCES subscription_plans(plan_id),
    FOREIGN KEY (new_plan_id) REFERENCES subscription_plans(plan_id)
);



CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15),
    hire_date DATE,
    job_title VARCHAR(100),
    department VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);




CREATE TABLE payroll (
    payroll_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    client_id INT NOT NULL,
    salary DECIMAL(10, 2),
    bonuses DECIMAL(10, 2) DEFAULT 0.00,
    deductions DECIMAL(10, 2) DEFAULT 0.00,
    payment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);


CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    client_id INT NOT NULL,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status ENUM('present', 'absent', 'on_leave') DEFAULT 'present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE attendance_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    client_id INT NOT NULL,
    request_date DATE NOT NULL, -- The date for which attendance is being requested
    reason TEXT, -- Reason for missing or incorrect attendance
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reviewer_id INT, -- ID of the manager reviewing the request
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (reviewer_id) REFERENCES employees(employee_id)
);


CREATE TABLE leave_requests (
    leave_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    client_id INT NOT NULL,
    leave_type VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);


CREATE TABLE employee_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    client_id INT NOT NULL,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    field_changed VARCHAR(100), -- e.g., "department", "job_title", "salary"
    old_value TEXT, -- Previous value
    new_value TEXT, -- Updated value
    changed_by INT NOT NULL, -- Admin or manager who made the change
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (changed_by) REFERENCES employees(employee_id)
);

-- Employees Skills

CREATE TABLE employee_skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    client_id INT NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    proficiency ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
    years_of_experience INT,
    certified BOOLEAN DEFAULT FALSE, -- Whether the skill is certified
    certification_details TEXT, -- Certification details if applicable
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

-- Employee warnings

CREATE TABLE employee_warnings (
    warning_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    client_id INT NOT NULL,
    issued_by INT NOT NULL, -- Manager or admin issuing the warning
    warning_date DATE NOT NULL,
    reason TEXT NOT NULL, -- Reason for the warning
    severity ENUM('low', 'medium', 'high') DEFAULT 'low', -- Severity level of the warning
    action_taken TEXT, -- Actions taken (if any)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (issued_by) REFERENCES employees(employee_id)
);

-- Employee Performace Review

CREATE TABLE performance_reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    client_id INT NOT NULL,
    reviewer_id INT NOT NULL, -- Manager or supervisor conducting the review
    review_date DATE NOT NULL,
    rating DECIMAL(3, 2) CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (reviewer_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

ALTER TABLE employees
ADD COLUMN skills_count INT DEFAULT 0,
ADD COLUMN warnings_count INT DEFAULT 0;

-- Recruitement and Jobs management

CREATE TABLE job_postings (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    department VARCHAR(100),
    status ENUM('open', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    applicant_name VARCHAR(255),
    applicant_email VARCHAR(255),
    resume TEXT,
    status ENUM('pending', 'shortlisted', 'rejected') DEFAULT 'pending',
    application_date DATE,
    FOREIGN KEY (job_id) REFERENCES job_postings(job_id)
);


CREATE TABLE work_shifts (
    shift_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    shift_name VARCHAR(100),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

-- Holidays

CREATE TABLE holidays (
    holiday_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    holiday_name VARCHAR(255),
    holiday_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

-- Employee Trainings

CREATE TABLE training_programs (
    program_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE training_participants (
    participant_id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    employee_id INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (program_id) REFERENCES training_programs(program_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Policies management

CREATE TABLE policies (
    policy_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(255),
    content TEXT,
    effective_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

-- Compliance and Risk Management

CREATE TABLE compliance_checks (
    check_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    description TEXT,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE risk_reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    description TEXT,
    severity ENUM('low', 'medium', 'high'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE budgets (
    budget_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    category VARCHAR(100),
    allocated_amount DECIMAL(10, 2),
    spent_amount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(255),
    content TEXT,
    report_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

-- Asset management

CREATE TABLE assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    name VARCHAR(255),
    type VARCHAR(100),
    purchase_date DATE,
    value DECIMAL(10, 2),
    status ENUM('available', 'assigned', 'retired') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE asset_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT NOT NULL,
    employee_id INT NOT NULL,
    assignment_date DATE,
    return_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);


CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    name VARCHAR(255),
    parent_department_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (parent_department_id) REFERENCES departments(department_id)
);

CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    name VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

ALTER TABLE employees
ADD COLUMN manager_id INT DEFAULT NULL,
ADD FOREIGN KEY (manager_id) REFERENCES employees(employee_id);

-- Employee Timesheets

CREATE TABLE timesheets (
    timesheet_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    client_id INT NOT NULL,
    date DATE NOT NULL, -- Date of the timesheet entry
    project_id INT DEFAULT NULL, -- Project the time is associated with (optional)
    task_description TEXT, -- Description of the task
    hours_worked DECIMAL(4, 2) NOT NULL, -- Hours worked (e.g., 7.5)
    status ENUM('submitted', 'approved', 'rejected') DEFAULT 'submitted', -- Status of the entry
    reviewer_id INT DEFAULT NULL, -- Manager reviewing the entry
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id), -- Optional projects table
    FOREIGN KEY (reviewer_id) REFERENCES employees(employee_id)
);


CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    name VARCHAR(255) NOT NULL, -- Project name
    description TEXT, -- Project description
    start_date DATE NOT NULL,
    end_date DATE DEFAULT NULL, -- NULL if ongoing
    status ENUM('active', 'completed', 'on_hold') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);


CREATE TABLE timesheet_summary (
    summary_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    client_id INT NOT NULL,
    project_id INT DEFAULT NULL, -- NULL if not project-based
    total_hours DECIMAL(10, 2) NOT NULL, -- Total hours worked
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

-- Employee Load and PF requests

CREATE TABLE loan_requests (
    loan_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    client_id INT NOT NULL,
    loan_type ENUM('personal', 'housing', 'education', 'medical') NOT NULL,
    amount_requested DECIMAL(10, 2) NOT NULL, -- Loan amount requested
    amount_approved DECIMAL(10, 2) DEFAULT NULL, -- Approved amount
    interest_rate DECIMAL(5, 2) DEFAULT NULL, -- Interest rate (e.g., 5.5%)
    repayment_months INT DEFAULT NULL, -- Repayment duration in months
    status ENUM('pending', 'approved', 'rejected', 'disbursed') DEFAULT 'pending',
    request_date DATE NOT NULL,
    approval_date DATE DEFAULT NULL,
    reviewed_by INT DEFAULT NULL, -- Manager or HR who reviews the request
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (reviewed_by) REFERENCES employees(employee_id)
);


CREATE TABLE loan_repayments (
    repayment_id INT AUTO_INCREMENT PRIMARY KEY,
    loan_id INT NOT NULL,
    repayment_date DATE NOT NULL, -- Date of repayment
    amount_paid DECIMAL(10, 2) NOT NULL, -- Amount paid
    payment_method ENUM('salary_deduction', 'bank_transfer', 'cash') DEFAULT 'salary_deduction',
    payment_status ENUM('pending', 'completed') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES loan_requests(loan_id)
);


CREATE TABLE pf_release_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    client_id INT NOT NULL,
    amount_requested DECIMAL(10, 2) NOT NULL, -- Amount requested for release
    reason TEXT, -- Reason for release
    status ENUM('pending', 'approved', 'rejected', 'released') DEFAULT 'pending',
    request_date DATE NOT NULL,
    approval_date DATE DEFAULT NULL,
    reviewed_by INT DEFAULT NULL, -- Manager or HR reviewing the request
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (reviewed_by) REFERENCES employees(employee_id)
);


-- Employee Regisnation

CREATE TABLE resignation_requests (
    resignation_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL, -- Employee submitting the resignation
    client_id INT NOT NULL, -- Tenant isolation
    resignation_date DATE NOT NULL, -- Employee's proposed last working day
    notice_period INT NOT NULL, -- Notice period in days
    reason TEXT, -- Reason for resignation
    status ENUM('submitted', 'reviewed', 'approved', 'rejected', 'withdrawn') DEFAULT 'submitted', -- Status of resignation
    reviewed_by INT DEFAULT NULL, -- Manager or HR reviewing the request
    approval_date DATE DEFAULT NULL, -- Date when resignation was approved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (reviewed_by) REFERENCES employees(employee_id)
);


CREATE TABLE exit_interviews (
    interview_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL, -- Employee leaving the organization
    client_id INT NOT NULL, -- Tenant isolation
    interview_date DATE DEFAULT NULL, -- Date of the exit interview
    conducted_by INT DEFAULT NULL, -- HR or Manager conducting the interview
    feedback TEXT, -- General feedback
    reasons_for_leaving TEXT, -- Detailed reasons for leaving
    suggestions TEXT, -- Suggestions for the organization
    rehire_eligibility BOOLEAN DEFAULT TRUE, -- Whether the employee is eligible for rehire
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (conducted_by) REFERENCES employees(employee_id)
);

CREATE TABLE clearance_tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    client_id INT NOT NULL,
    task_description VARCHAR(255) NOT NULL, -- Description of the clearance task (e.g., return laptop)
    assigned_to INT DEFAULT NULL, -- Person responsible for verifying the task
    status ENUM('pending', 'completed') DEFAULT 'pending',
    due_date DATE DEFAULT NULL, -- Deadline for completing the task
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (assigned_to) REFERENCES employees(employee_id)
);


ALTER TABLE employees
ADD COLUMN resignation_status ENUM('active', 'resigned', 'exited') DEFAULT 'active',
ADD COLUMN last_working_day DATE DEFAULT NULL;

-- Employee Survery

CREATE TABLE surveys (
    survey_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL, -- Tenant isolation
    title VARCHAR(255) NOT NULL, -- Survey title
    description TEXT DEFAULT NULL, -- Description of the survey
    start_date DATE NOT NULL, -- Start date of the survey
    end_date DATE NOT NULL, -- End date of the survey
    is_anonymous BOOLEAN DEFAULT TRUE, -- Whether responses are anonymous
    created_by INT NOT NULL, -- HR or manager who created the survey
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (created_by) REFERENCES employees(employee_id)
);


CREATE TABLE survey_questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    survey_id INT NOT NULL, -- Link to the survey
    question_text TEXT NOT NULL, -- Text of the question
    question_type ENUM('text', 'multiple_choice', 'rating') NOT NULL, -- Type of question
    options JSON DEFAULT NULL, -- Options for multiple choice (JSON format)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(survey_id)
);


CREATE TABLE survey_responses (
    response_id INT AUTO_INCREMENT PRIMARY KEY,
    survey_id INT NOT NULL, -- Link to the survey
    question_id INT NOT NULL, -- Link to the question
    employee_id INT DEFAULT NULL, -- Employee responding (NULL if anonymous)
    client_id INT NOT NULL, -- Tenant isolation
    response_text TEXT DEFAULT NULL, -- Response text (for open-ended questions)
    selected_option VARCHAR(255) DEFAULT NULL, -- Selected option (for multiple choice)
    rating_value INT DEFAULT NULL, -- Rating value (for rating questions)
    response_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(survey_id),
    FOREIGN KEY (question_id) REFERENCES survey_questions(question_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
);


-- Employee Onboarding

CREATE TABLE onboarding_workflows (
    workflow_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL, -- New employee being onboarded
    client_id INT NOT NULL, -- Tenant isolation
    start_date DATE NOT NULL, -- Start date of onboarding
    end_date DATE DEFAULT NULL, -- End date of onboarding
    status ENUM('initiated', 'in_progress', 'completed', 'cancelled') DEFAULT 'initiated', -- Status of onboarding
    assigned_to INT DEFAULT NULL, -- HR or manager overseeing the onboarding
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (assigned_to) REFERENCES employees(employee_id)
);


CREATE TABLE onboarding_tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id INT NOT NULL, -- Link to onboarding workflow
    client_id INT NOT NULL, -- Tenant isolation
    task_name VARCHAR(255) NOT NULL, -- Name of the task
    description TEXT DEFAULT NULL, -- Detailed description of the task
    assigned_to INT DEFAULT NULL, -- Person responsible for completing the task
    due_date DATE NOT NULL, -- Deadline for the task
    status ENUM('pending', 'in_progress', 'completed', 'overdue') DEFAULT 'pending', -- Status of the task
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES onboarding_workflows(workflow_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (assigned_to) REFERENCES employees(employee_id)
);


CREATE TABLE onboarding_documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id INT NOT NULL, -- Link to onboarding workflow
    client_id INT NOT NULL, -- Tenant isolation
    document_name VARCHAR(255) NOT NULL, -- Name of the document
    is_submitted BOOLEAN DEFAULT FALSE, -- Whether the document is submitted
    submission_date DATE DEFAULT NULL, -- Date of submission
    verified_by INT DEFAULT NULL, -- HR verifying the document
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending', -- Status of verification
    remarks TEXT DEFAULT NULL, -- Remarks or reasons for rejection
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES onboarding_workflows(workflow_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (verified_by) REFERENCES employees(employee_id)
);


CREATE TABLE onboarding_trainings (
    training_id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id INT NOT NULL, -- Link to onboarding workflow
    client_id INT NOT NULL, -- Tenant isolation
    training_name VARCHAR(255) NOT NULL, -- Name of the training or orientation
    trainer_id INT DEFAULT NULL, -- Trainer or facilitator
    scheduled_date DATE NOT NULL, -- Scheduled date of training
    status ENUM('scheduled', 'completed', 'missed') DEFAULT 'scheduled', -- Training status
    feedback TEXT DEFAULT NULL, -- Feedback from the employee post-training
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES onboarding_workflows(workflow_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (trainer_id) REFERENCES employees(employee_id)
);


