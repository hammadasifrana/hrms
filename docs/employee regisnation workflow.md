
# Employee Resignation Workflow

## Key Workflow Features

### 1. Resignation Process
- **Employee submits resignation:**  
  Adds a record in `resignation_requests` with the proposed resignation date and reason.
- **Manager/HR reviews and approves/rejects:**  
  Updates status in `resignation_requests`.
- **Upon approval:**  
  Updates `employees.resignation_status` to `resigned` and sets `last_working_day`.

### 2. Exit Interview Process
- **Exit interview scheduled:**  
  Adds a record in `exit_interviews` with the interview date and assigned HR/manager.
- **Feedback collection:**  
  During the interview, feedback, reasons for leaving, and suggestions are documented.
- **Eligibility for rehire:**  
  HR marks whether the employee is eligible for rehire.

### 3. Clearance Process
- **Tasks assigned for clearance:**  
  Adds records to `clearance_tasks` (e.g., return of assets, final handovers).
- **Task completion tracking:**  
  HR or managers update status in `clearance_tasks` as tasks are completed.

## Sample Queries

### Submit a Resignation Request
```sql
INSERT INTO resignation_requests (employee_id, client_id, resignation_date, reason)
VALUES (1, 123, '2024-12-31', 'Career growth opportunities');
```

### Approve Resignation
```sql
UPDATE resignation_requests
SET status = 'approved'
WHERE request_id = 1;

UPDATE employees
SET resignation_status = 'resigned', last_working_day = '2024-12-31'
WHERE employee_id = 1;
```

### Schedule Exit Interview
```sql
INSERT INTO exit_interviews (employee_id, interview_date, assigned_hr)
VALUES (1, '2024-12-15', 'HR123');
```

### Mark Clearance Task Complete
```sql
UPDATE clearance_tasks
SET status = 'completed'
WHERE task_id = 1;
```

## Notes
- Ensure all processes are logged for compliance.
- Regularly update the workflow for efficiency improvements.
- Customize queries to fit your database schema.
