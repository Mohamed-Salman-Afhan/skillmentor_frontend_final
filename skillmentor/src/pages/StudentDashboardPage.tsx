import { useEffect, useState } from 'react';
import { getStudentDashboard } from '@/api';
import type { StudentDashboardResponse } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Book } from 'lucide-react';

export default function StudentDashboardPage() {
  const [sessions, setSessions] = useState<StudentDashboardResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentDashboard()
      .then(res => setSessions(res.data))
      .catch(err => console.error("Failed to fetch dashboard", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-10">Loading your dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Bookings</h1>
      {sessions.length === 0 ? (
        <div className="text-center p-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">You haven't booked any sessions yet.</p>
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
                            <span>{new Date(item.sessionDate).toLocaleString()}</span>
                        </div>
                    </div>
                    <Badge 
                        className="mt-2 md:mt-0"
                        variant={
                            item.status === 'COMPLETED' ? 'default' : 
                            item.status === 'ACCEPTED' ? 'secondary' : 'destructive'
                        }
                    >
                        {item.status}
                    </Badge>
                </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}