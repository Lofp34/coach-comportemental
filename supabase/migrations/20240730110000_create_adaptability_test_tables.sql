-- Table for storing the adaptability test questions
CREATE TABLE public.adaptability_questions (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    "order" INTEGER NOT NULL UNIQUE
);

-- Table for storing the results of each adaptability test taken by a user
CREATE TABLE public.adaptability_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 20),
    notes TEXT
);

-- Enable RLS
ALTER TABLE public.adaptability_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adaptability_results ENABLE ROW LEVEL SECURITY;

-- Policies for questions: anyone can read
CREATE POLICY "Allow authenticated users to read adaptability questions"
ON public.adaptability_questions
FOR SELECT
TO authenticated
USING (true);

-- Policies for results: users can manage their own
CREATE POLICY "Users can view their own adaptability results"
ON public.adaptability_results
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own adaptability results"
ON public.adaptability_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own adaptability results"
ON public.adaptability_results
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id); 