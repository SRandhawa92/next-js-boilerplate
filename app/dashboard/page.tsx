import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const isPro = subscription?.status === 'pro';

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {!isPro ? (
        <div className="bg-muted p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-2">You're on the Free plan</h2>
          <p className="text-muted-foreground mb-4">
            Upgrade to Pro to unlock all features and get unlimited access.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md font-medium"
          >
            Upgrade to Pro
          </Link>
        </div>
      ) : (
        <div className="bg-primary/10 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-2">Pro Plan Active</h2>
          <p className="text-muted-foreground">
            You have access to all premium features.
          </p>
        </div>
      )}

      {/* Add your dashboard content here */}
      <div className="grid gap-6">
        {isPro ? (
          <>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Pro Feature 1</h3>
              <p className="text-muted-foreground">
                This is a pro-only feature that you now have access to.
              </p>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Pro Feature 2</h3>
              <p className="text-muted-foreground">
                Another exclusive feature for pro subscribers.
              </p>
            </div>
          </>
        ) : (
          <div className="border rounded-lg p-6 opacity-50">
            <h3 className="text-xl font-semibold mb-4">Pro Features (Locked)</h3>
            <p className="text-muted-foreground">
              Upgrade to Pro to unlock these features.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 