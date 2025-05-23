-- Drop existing constraints and indexes if they exist
ALTER TABLE public.subscriptions 
    DROP CONSTRAINT IF EXISTS subscriptions_user_id_key;

-- Add unique constraint to user_id in subscriptions table
ALTER TABLE public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);

-- Add indexes for better query performance
DROP INDEX IF EXISTS subscriptions_user_id_idx;
DROP INDEX IF EXISTS subscriptions_status_idx;
CREATE INDEX subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX subscriptions_status_idx ON public.subscriptions(status);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;

-- Create policies
CREATE POLICY "Users can view own subscription"
ON public.subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
ON public.subscriptions FOR ALL
TO service_role
USING (true)
WITH CHECK (true); 