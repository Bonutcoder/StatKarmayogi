-- ==============================================================================
-- StatKarmayogi: Enable Row Level Security (RLS) on all public tables
-- Run this script in the Supabase SQL Editor to resolve all "RLS Disabled in Public" warnings.
-- ==============================================================================

-- 1. Enable Row Level Security (RLS) on all schema tables
ALTER TABLE IF EXISTS public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.role_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.employee_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.competency_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.course_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.training_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.training_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mastery_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.recommendations ENABLE ROW LEVEL SECURITY;

-- 2. Grant full access to service_role and backend postgres connections
-- (FastAPI backend and admin jobs use service_role / direct connection)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO service_role;

-- 3. Default RLS Policies (Allow authenticated / backend access)
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'departments', 'users', 'employees', 'roles', 'competencies',
        'role_competencies', 'employee_competencies', 'competency_history',
        'skill_gaps', 'courses', 'course_competencies', 'training_history',
        'training_documents', 'document_chunks', 'assessments', 'questions',
        'assessment_attempts', 'answers', 'mastery_records', 'audit_events',
        'jobs', 'recommendations'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        -- Drop existing policy if any with same name to allow clean rerun
        EXECUTE format('DROP POLICY IF EXISTS "Allow service role full access" ON public.%I', tbl);
        EXECUTE format('CREATE POLICY "Allow service role full access" ON public.%I FOR ALL TO service_role USING (true) WITH CHECK (true)', tbl);

        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated read" ON public.%I', tbl);
        EXECUTE format('CREATE POLICY "Allow authenticated read" ON public.%I FOR SELECT TO authenticated USING (true)', tbl);
    END LOOP;
END $$;
