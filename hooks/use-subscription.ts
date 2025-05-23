import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export type Subscription = {
  id: string;
  user_id: string;
  status: 'free' | 'pro';
  price_id: string;
  created_at: string;
};

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getSubscription() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setSubscription(null);
          return;
        }

        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setSubscription(subscription);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    }

    getSubscription();
  }, []);

  const isPro = subscription?.status === 'pro';

  return {
    subscription,
    loading,
    isPro,
  };
} 