import { Link, NavLink } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Shield } from 'lucide-react';

export default function Header() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Skillmentor</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <NavLink to="/classes" className={({isActive}) => isActive ? "text-foreground" : "text-foreground/60"}>Classes</NavLink>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? "text-foreground" : "text-foreground/60"}>Dashboard</NavLink>
            {isAdmin && (
              <NavLink to="/admin" className="flex items-center text-red-500/80">
                <Shield className="h-4 w-4 mr-1" /> Admin
              </NavLink>
            )}
          </nav>
        </div>
        
        {/* Mobile Menu */}
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon"><Menu/></Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium mt-6">
                        <NavLink to="/classes" className={({isActive}) => isActive ? "text-foreground" : "text-foreground/60"}>Classes</NavLink>
                        <NavLink to="/dashboard" className={({isActive}) => isActive ? "text-foreground" : "text-foreground/60"}>Dashboard</NavLink>
                        {isAdmin && (
                            <NavLink to="/admin" className="flex items-center text-red-500/80">
                                <Shield className="h-5 w-5 mr-1" /> Admin
                            </NavLink>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl='/' />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}