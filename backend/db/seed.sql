INSERT INTO employees (name, email, department, designation, salary) VALUES
  ('Ananya Rao',    'ananya.rao@example.com',    'Engineering',     'Senior Software Engineer', 2200000),
  ('Rohan Mehta',   'rohan.mehta@example.com',   'Design',          'Product Designer',         1500000),
  ('Priya Nair',    'priya.nair@example.com',    'Human Resources', 'HR Manager',               1300000),
  ('Karthik Iyer',  'karthik.iyer@example.com',  'Finance',         'Financial Analyst',        1100000),
  ('Sara Thomas',   'sara.thomas@example.com',   'Engineering',     'QA Engineer',               900000)
ON CONFLICT DO NOTHING;
