import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { setAuthTokenFunction } from './api';

// Layouts and Pages
import Header from './components/common/Header';
import AdminLayout from './pages/admin/AdminLayout';
import HomePage from './pages/HomePage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import MentorProfilePage from './pages/MentorProfilePage';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';
import CreateClassPage from './pages/admin/CreateClassPage';
import CreateMentorPage from './pages/admin/CreateMentorPage';
import AllClassesPage from './pages/AllClassesPage';

function App() {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenFunction(() => getToken({ template: 'skillmentor' }));
  }, [getToken]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Protected Routes for Signed In Users */}
          <Route path="/classes" element={<SignedIn><AllClassesPage /></SignedIn>} />
          <Route path="/dashboard" element={<SignedIn><StudentDashboardPage /></SignedIn>} />
          <Route path="/mentor/:id" element={<SignedIn><MentorProfilePage /></SignedIn>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<SignedIn><AdminLayout /></SignedIn>}>
            <Route index element={<ManageBookingsPage />} />
            <Route path="bookings" element={<ManageBookingsPage />} />
            <Route path="create-class" element={<CreateClassPage />} />
            <Route path="create-mentor" element={<CreateMentorPage />} />
          </Route>
          
          <Route path="*" element={
              <SignedOut><RedirectToSignIn /></SignedOut>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;