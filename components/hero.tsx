import Link from 'next/link'

export default function Hero() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center">
        <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl">
          Welcome to Your App
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Get started by signing in or creating a new account
        </p>
        <div className="flex gap-4">
          <Link
            href="/sign-in"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-md font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
