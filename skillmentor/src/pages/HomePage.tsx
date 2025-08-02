import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full mt-20">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Welcome to Skillmentor</h1>
      <p className="mt-4 text-lg text-muted-foreground">Your personal marketplace for 1-on-1 tutoring sessions.</p>
      <div className="mt-8">
        <SignedOut>
          <SignInButton mode="modal">
            <Button size="lg">Sign In & Get Started</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link to="/classes">
            <Button size="lg">Browse Classes</Button>
          </Link>
        </SignedIn>
      </div>
    </div>
  );
}