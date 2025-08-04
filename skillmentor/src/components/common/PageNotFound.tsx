import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';

export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
        <TriangleAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
        <p className="mt-4 text-lg text-muted-foreground">
            Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8">
            <Link to="/">
                <Button>Go Back to Homepage</Button>
            </Link>
        </div>
    </div>
  );
}