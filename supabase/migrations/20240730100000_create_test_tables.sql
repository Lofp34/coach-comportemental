-- Create an enum type for test dimensions
CREATE TYPE public.test_dimension AS ENUM ('affirmation', 'expressivite');

-- Table for storing the test questions
CREATE TABLE public.test_questions (
    id SERIAL PRIMARY KEY,
    dimension public.test_dimension NOT NULL,
    text_left TEXT NOT NULL,
    text_right TEXT NOT NULL,
    "order" INTEGER NOT NULL UNIQUE
);

-- Table for storing the results of each test taken by a user
CREATE TABLE public.test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    assertiveness_score INTEGER NOT NULL,
    expressiveness_score INTEGER NOT NULL,
    assertiveness_category CHAR(1) NOT NULL,
    expressiveness_category CHAR(1) NOT NULL,
    final_profile TEXT[] NOT NULL
);

-- Table for storing the individual answers for each test result
CREATE TABLE public.test_answers (
    id BIGSERIAL PRIMARY KEY,
    result_id UUID NOT NULL REFERENCES public.test_results(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES public.test_questions(id) ON DELETE CASCADE,
    answer_value INTEGER NOT NULL CHECK (answer_value BETWEEN 1 AND 4)
);

-- Enable RLS for all tables
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_answers ENABLE ROW LEVEL SECURITY;

-- Policies for test_questions: everyone can read them
CREATE POLICY "Allow authenticated users to read questions"
ON public.test_questions
FOR SELECT
TO authenticated
USING (true);

-- Policies for test_results: users can manage their own results
CREATE POLICY "Users can view their own test results"
ON public.test_results
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test results"
ON public.test_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policies for test_answers: users can manage their own answers
CREATE POLICY "Users can view their own answers"
ON public.test_answers
FOR SELECT
USING (auth.uid() = (
    SELECT user_id FROM public.test_results WHERE id = result_id
));

CREATE POLICY "Users can create their own answers"
ON public.test_answers
FOR INSERT
WITH CHECK (auth.uid() = (
    SELECT user_id FROM public.test_results WHERE id = result_id
)); 