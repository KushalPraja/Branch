import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Branch</h1>
        <p className="text-xl mt-4 text-zinc-400">
          Create your own custom link page in seconds
        </p>
        <div className="mt-8 flex flex-col gap-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/signup">Create Account</Link>
          </Button>
        </div>
        <p className="text-sm text-zinc-500 mt-8">
          Join thousands of creators who use Branch to share their content
        </p>
      </div>
    </div>
  );
}

