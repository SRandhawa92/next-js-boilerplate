import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto">
      <h1 className="font-bold text-2xl mb-8">Protected Page</h1>
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h2 className="font-semibold text-xl mb-4">Your Profile</h2>
        <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
