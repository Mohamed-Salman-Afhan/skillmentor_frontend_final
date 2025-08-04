import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <section className="bg-white">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-4rem)]">
                    {/* Left Side: Text Content */}
                    <div className="flex flex-col justify-center text-center md:text-left py-12">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-primary leading-tight">
                            Unlock Your Potential with a Personal <span className="text-accent">Mentor</span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
                            Skillmentor is a peer-to-peer tutoring platform offering personalized 1-on-1 academic support from fellow learners who have mastered the subjects you're studying.
                        </p>
                        <div className="mt-8 flex gap-4 justify-center md:justify-start">
                            <SignedIn>
                                <Link to="/classes">
                                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
                                        Browse Classes <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </SignedIn>
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
                                        Browse Classes <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                    </div>

                    {/* --- THIS IS THE FIX --- */}
                    {/* Right Side: Full-bleed Image */}
                    <div className="relative hidden md:block">
                        <img
                            src="/hero-img.jpg" // Assuming 'hero-img.jpg' is in your /public folder
                            alt="A group of diverse students studying together"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                         {/* Optional: Add a subtle gradient overlay to blend the image */}
                        <div className="absolute inset-0 bg-gradient-to-l from-white/5 to-white/10"></div>
                    </div>
                    {/* --- END OF FIX --- */}
                </div>
            </div>
        </section>
    );
}