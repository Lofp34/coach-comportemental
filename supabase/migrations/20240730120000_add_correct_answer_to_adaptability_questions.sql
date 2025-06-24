-- Add the correct_answer column to the adaptability_questions table
ALTER TABLE public.adaptability_questions
ADD COLUMN correct_answer BOOLEAN NOT NULL DEFAULT true; 