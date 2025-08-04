import { useEffect, useState } from 'react';
import { getStudentDashboard } from '@/api';
import type { StudentDashboardResponse } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Book, SmilePlus } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function StudentDashboardPage() {
  const [sessions, setSessions] = useState<StudentDashboardResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentDashboard()
      .then(res => setSessions(res.data))
      .catch(err => console.error("Failed to fetch dashboard", err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'PENDING': 
            return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Pending</Badge>;
        case 'ACCEPTED': 
            return <Badge className="bg-blue-100 text-primary hover:bg-blue-200">Accepted</Badge>;
        case 'COMPLETED': 
            return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200">Completed</Badge>;
        default: 
            return <Badge>{status}</Badge>;
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Bookings</h1>
      {sessions.length === 0 ? (
        <div className="text-center p-10 md:p-16 border-2 border-dashed rounded-lg flex flex-col items-center">
            <SmilePlus className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold">No Sessions Booked Yet</h2>
            <p className="mt-2 text-muted-foreground">It looks like you're ready to start learning. Find a class that's right for you!</p>
            <Link to="/classes" className="mt-6">
                <Button>Browse Classes</Button>
            </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <Book className="h-5 w-5 text-primary" />
                    <p className="font-bold text-lg">{item.className}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>with {item.mentorName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(item.sessionDate).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}</span>
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                    {getStatusBadge(item.status)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}