-- Add UPDATE and DELETE policies for test_results

CREATE POLICY "Users can update their own test results"
ON public.test_results
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own test results"
ON public.test_results
FOR DELETE
USING (auth.uid() = user_id); 