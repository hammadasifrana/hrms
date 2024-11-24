-- 1. Create table for departments
CREATE TABLE departments (
                             department_id INT PRIMARY KEY AUTO_INCREMENT,
                             department_name VARCHAR(100) NOT NULL UNIQUE,
                             manager_id INT, -- Reporting manager for the department
                             FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
                                 ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 2. Create table for employees (updated with reporting manager and department reference)
CREATE TABLE employees (
                           employee_id INT PRIMARY KEY AUTO_INCREMENT,
                           first_name VARCHAR(50) NOT NULL,
                           last_name VARCHAR(50) NOT NULL,
                           department_id INT,
                           reporting_manager_id INT, -- Self-referencing foreign key for reporting manager
                           email VARCHAR(100) UNIQUE NOT NULL,
                           phone_number VARCHAR(15),
                           hire_date DATE NOT NULL,
                           status ENUM('Active', 'Inactive') DEFAULT 'Active',
                           FOREIGN KEY (department_id) REFERENCES departments(department_id)
                               ON DELETE SET NULL ON UPDATE CASCADE,
                           FOREIGN KEY (reporting_manager_id) REFERENCES employees(employee_id)
                               ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 3. Create table for projects
CREATE TABLE projects (
                          project_id INT PRIMARY KEY AUTO_INCREMENT,
                          project_name VARCHAR(100) NOT NULL UNIQUE,
                          description TEXT,
                          start_date DATE NOT NULL,
                          end_date DATE,
                          status ENUM('Ongoing', 'Completed', 'On Hold') DEFAULT 'Ongoing'
) ENGINE=InnoDB;

-- 4. Create table for employee-project assignments
CREATE TABLE employee_projects (
                                   assignment_id INT PRIMARY KEY AUTO_INCREMENT,
                                   employee_id INT NOT NULL,
                                   project_id INT NOT NULL,
                                   role VARCHAR(100),
                                   assignment_date DATE DEFAULT CURRENT_DATE,
                                   FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
                                       ON DELETE CASCADE ON UPDATE CASCADE,
                                   FOREIGN KEY (project_id) REFERENCES projects(project_id)
                                       ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. Create table for user management
CREATE TABLE users (
                       user_id INT PRIMARY KEY AUTO_INCREMENT,
                       employee_id INT NOT NULL,
                       username VARCHAR(50) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       role ENUM('Employee', 'Manager', 'Admin') DEFAULT 'Employee',
                       last_login TIMESTAMP,
                       FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
                           ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 6. Create table for attendance (no changes)
CREATE TABLE attendance (
                            attendance_id INT PRIMARY KEY AUTO_INCREMENT,
                            employee_id INT NOT NULL,
                            log_date DATE NOT NULL,
                            log_in_time TIME,
                            log_out_time TIME,
                            total_hours DECIMAL(5, 2),
                            status ENUM('Present', 'Absent', 'Leave', 'Holiday') DEFAULT 'Present',
                            FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
                                ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 7. Create table for leave requests (no changes)
CREATE TABLE leave_requests (
                                leave_id INT PRIMARY KEY AUTO_INCREMENT,
                                employee_id INT NOT NULL,
                                leave_type ENUM('Sick Leave', 'Casual Leave', 'Paid Leave', 'Unpaid Leave') NOT NULL,
                                start_date DATE NOT NULL,
                                end_date DATE NOT NULL,
                                status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
                                reason TEXT,
                                request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
                                    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 8. Create table for holiday calendar (no changes)
CREATE TABLE holiday_calendar (
                                  holiday_id INT PRIMARY KEY AUTO_INCREMENT,
                                  holiday_date DATE NOT NULL UNIQUE,
                                  description VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- 9. Create table for attendance requests (new table for missing attendance)
CREATE TABLE attendance_requests (
                                     request_id INT PRIMARY KEY AUTO_INCREMENT,
                                     employee_id INT NOT NULL,
                                     request_date DATE NOT NULL,
                                     log_date DATE NOT NULL,
                                     log_in_time TIME,
                                     log_out_time TIME,
                                     status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
                                     reason TEXT,
                                     submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
                                         ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 10. Trigger to calculate total hours worked (no changes)
/*DELIMITER //
CREATE TRIGGER calculate_total_hours
    BEFORE INSERT OR UPDATE ON attendance
    FOR EACH ROW
BEGIN
IF NEW.log_in_time IS NOT NULL AND NEW.log_out_time IS NOT NULL THEN
SET NEW.total_hours = TIMESTAMPDIFF(MINUTE, NEW.log_in_time, NEW.log_out_time) / 60;
ELSE
SET NEW.total_hours = NULL;
END IF;
END;
//
DELIMITER ;*/

-- 11. Sample view for monthly attendance report (no changes)
CREATE VIEW monthly_attendance_report AS
SELECT
    e.employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
    MONTH(a.log_date) AS month,
    YEAR(a.log_date) AS year,
    COUNT(CASE WHEN a.status = 'Present' THEN 1 END) AS days_present,
    COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) AS days_absent,
    COUNT(CASE WHEN a.status = 'Leave' THEN 1 END) AS days_on_leave
FROM
    employees e
        LEFT JOIN
    attendance a ON e.employee_id = a.employee_id
GROUP BY
    e.employee_id, YEAR(a.log_date), MONTH(a.log_date);


-- 1. Create table for working week days
CREATE TABLE working_days (
                              working_day_id INT PRIMARY KEY AUTO_INCREMENT,
                              department_id INT, -- Optional: NULL for global default or specific department
                              day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
                              is_working_day BOOLEAN DEFAULT TRUE, -- TRUE for working day, FALSE for non-working day
                              FOREIGN KEY (department_id) REFERENCES departments(department_id)
                                  ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Example Data:
-- Global Working Days:
-- INSERT INTO working_days (day_of_week, is_working_day) VALUES
-- ('Monday', TRUE), ('Tuesday', TRUE), ('Wednesday', TRUE), ('Thursday', TRUE),
-- ('Friday', TRUE), ('Saturday', FALSE), ('Sunday', FALSE);

-- Department-Specific Working Days:
-- INSERT INTO working_days (department_id, day_of_week, is_working_day) VALUES
-- (1, 'Saturday', TRUE); -- Department 1 works on Saturdays


-- Multi-tenant client management additions

-- Add table for clients (tenants)
CREATE TABLE clients (
    client_id INT PRIMARY KEY AUTO_INCREMENT,
    client_name VARCHAR(255) NOT NULL UNIQUE,
    client_email VARCHAR(255) NOT NULL UNIQUE,
    client_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Modify existing tables to associate with clients
ALTER TABLE departments ADD client_id INT NOT NULL AFTER department_id;
ALTER TABLE employees ADD client_id INT NOT NULL AFTER employee_id;
ALTER TABLE projects ADD client_id INT NOT NULL AFTER project_id;

-- Add foreign key constraints for client association
ALTER TABLE departments ADD CONSTRAINT fk_departments_client FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE employees ADD CONSTRAINT fk_employees_client FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE projects ADD CONSTRAINT fk_projects_client FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE ON UPDATE CASCADE;
