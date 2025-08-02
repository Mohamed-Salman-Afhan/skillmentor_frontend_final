import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Shield, BookOpen, UserPlus, ListChecks } from 'lucide-react';

export default function AdminLayout() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // This effect runs whenever the loading state or user details change.
    // We only perform the redirect check AFTER Clerk has finished loading.
    if (isLoaded && user?.publicMetadata?.role !== 'admin') {
      // If the user is definitely loaded and not an admin, send them to the student dashboard.
      navigate('/dashboard');
    }
  }, [isLoaded, user, navigate]);

  // --- THIS IS THE CRUCIAL FIX ---
  // While Clerk is checking the user's session and metadata, show a loading message.
  // This prevents the redirect from happening prematurely.
  if (!isLoaded) {
    return <div className="text-center p-10 font-semibold">Verifying admin access...</div>;
  }
  // --- END OF FIX ---

  // A safety check: if the user is loaded but is not an admin, render nothing
  // while the useEffect redirect takes place.
  if (user?.publicMetadata?.role !== 'admin') {
    return null;
  }

  // If we get here, the user is loaded and is confirmed to be an admin.
  // We can now safely render the admin panel.
  const navLinkClass = ({ isActive }: {isActive: boolean}) => 
    `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-muted/50'
    }`;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="md:w-64">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" /> Admin Panel
        </h2>
        <nav className="flex flex-col space-y-1">
          <NavLink to="/admin/bookings" className={navLinkClass}>
            <ListChecks className="mr-2 h-4 w-4"/> Manage Bookings
          </NavLink>
          <NavLink to="/admin/create-class" className={navLinkClass}>
            <BookOpen className="mr-2 h-4 w-4"/> Create Class
          </NavLink>
          <NavLink to="/admin/create-mentor" className={navLinkClass}>
            <UserPlus className="mr-2 h-4 w-4"/> Create Mentor
          </NavLink>
        </nav>
      </aside>
      <div className="flex-1 border-l-0 md:border-l md:pl-6">
        <Outlet />
      </div>
    </div>
  );
}