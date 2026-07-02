-- Admin student data page policies for prototype use.
-- This app uses a local admin password, not Supabase Auth.
-- For a real production app, move reset actions to a secure server/API route with service-role auth.

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read students" ON students;
DROP POLICY IF EXISTS "Allow public delete students" ON students;
DROP POLICY IF EXISTS "Allow public read attempts" ON attempts;
DROP POLICY IF EXISTS "Allow public delete attempts" ON attempts;
DROP POLICY IF EXISTS "Allow public read attempt answers" ON attempt_answers;
DROP POLICY IF EXISTS "Allow public delete attempt answers" ON attempt_answers;
DROP POLICY IF EXISTS "Allow public read activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Allow public delete activity logs" ON activity_logs;
DROP POLICY IF EXISTS "Allow public read feedback" ON feedback;
DROP POLICY IF EXISTS "Allow public delete feedback" ON feedback;
DROP POLICY IF EXISTS "Allow public read courses" ON courses;
DROP POLICY IF EXISTS "Allow public read exams" ON exams;
DROP POLICY IF EXISTS "Allow public read questions" ON questions;

CREATE POLICY "Allow public read students"
ON students FOR SELECT
USING (true);

CREATE POLICY "Allow public delete students"
ON students FOR DELETE
USING (true);

CREATE POLICY "Allow public read attempts"
ON attempts FOR SELECT
USING (true);

CREATE POLICY "Allow public delete attempts"
ON attempts FOR DELETE
USING (true);

CREATE POLICY "Allow public read attempt answers"
ON attempt_answers FOR SELECT
USING (true);

CREATE POLICY "Allow public delete attempt answers"
ON attempt_answers FOR DELETE
USING (true);

CREATE POLICY "Allow public read activity logs"
ON activity_logs FOR SELECT
USING (true);

CREATE POLICY "Allow public delete activity logs"
ON activity_logs FOR DELETE
USING (true);

CREATE POLICY "Allow public read feedback"
ON feedback FOR SELECT
USING (true);

CREATE POLICY "Allow public delete feedback"
ON feedback FOR DELETE
USING (true);

CREATE POLICY "Allow public read courses"
ON courses FOR SELECT
USING (true);

CREATE POLICY "Allow public read exams"
ON exams FOR SELECT
USING (true);

CREATE POLICY "Allow public read questions"
ON questions FOR SELECT
USING (true);
