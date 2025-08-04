import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Shield, BookOpen, UserPlus, ListChecks, LayoutDashboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminLayout() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [isLoaded, user, navigate]);

  if (!isLoaded) {
    return <LoadingSpinner />;
  }
  
  if (user?.publicMetadata?.role !== 'admin') {
    return null;
  }

  const navLinkClass = ({ isActive }: {isActive: boolean}) => 
    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-primary text-primary-foreground' 
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
      <aside>
        <Card>
            <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4 flex items-center px-3 text-primary">
                    <Shield className="h-5 w-5 mr-3 text-primary" /> 
                    Admin Panel
                </h2>
                <nav className="flex flex-col space-y-1">
                    <NavLink to="/admin/dashboard" className={navLinkClass}>
                        <LayoutDashboard className="mr-3 h-5 w-5"/> 
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/bookings" className={navLinkClass}>
                        <ListChecks className="mr-3 h-5 w-5"/> 
                        Manage Bookings
                    </NavLink>
                    <NavLink to="/admin/create-class" className={navLinkClass}>
                        <BookOpen className="mr-3 h-5 w-5"/> 
                        Create Class
                    </NavLink>
                    <NavLink to="/admin/create-mentor" className={navLinkClass}>
                        <UserPlus className="mr-3 h-5 w-5"/> 
                        Create Mentor
                    </NavLink>
                </nav>
            </CardContent>
        </Card>
      </aside>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}