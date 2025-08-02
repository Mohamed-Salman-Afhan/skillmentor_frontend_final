import { useEffect, useState } from 'react';
import { getAdminBookings, approveBooking, completeBooking } from '@/api';
import type { BookingDetailsResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Check, CheckCheck } from 'lucide-react';

export default function ManageBookingsPage() {
  const [bookings, setBookings] = useState<BookingDetailsResponse[]>([]);
  const { toast } = useToast();

  const fetchBookings = () => {
    getAdminBookings()
      .then(res => setBookings(res.data))
      .catch(() => toast({ title: "Error", description: "Failed to fetch bookings.", variant: "destructive" }));
  };

  useEffect(fetchBookings, []);

  const handleAction = async (action: (id: number) => Promise<any>, id: number, successMessage: string) => {
    try {
        await action(id);
        toast({ title: "Success", description: successMessage });
        fetchBookings();
    } catch (error) {
        toast({ title: "Error", description: "Action failed.", variant: "destructive" });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage All Bookings</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Mentor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.bookingId}>
                <TableCell className="font-medium">{booking.studentName}</TableCell>
                <TableCell>{booking.className}</TableCell>
                <TableCell>{booking.mentorName}</TableCell>
                <TableCell>{new Date(booking.sessionDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={
                      booking.status === 'COMPLETED' ? 'default' : 
                      booking.status === 'ACCEPTED' ? 'secondary' : 'destructive'
                  }>{booking.status}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {booking.status === 'PENDING' && (
                    <Button size="sm" onClick={() => handleAction(approveBooking, booking.bookingId, "Booking approved.")}>
                      <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                  )}
                  {booking.status === 'ACCEPTED' && (
                    <Button size="sm" variant="outline" onClick={() => handleAction(completeBooking, booking.bookingId, "Booking marked as completed.")}>
                      <CheckCheck className="mr-2 h-4 w-4" /> Complete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}