'use client';

import { useRouter } from 'next/navigation';

export default function FreeTierButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/dashboard')}
      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-md font-medium"
    >
      Get Started
    </button>
  );
} 