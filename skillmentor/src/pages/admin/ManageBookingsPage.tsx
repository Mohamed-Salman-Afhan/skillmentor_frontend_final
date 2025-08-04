import { useEffect, useState} from 'react';
import { getAdminBookings, approveBooking, completeBooking } from '@/api';
import type { BookingDetailsResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { Check, CheckCheck, ChevronLeft, ChevronRight, Search, Inbox, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useDebounce } from '@/hooks/useDebounce';

export default function ManageBookingsPage() {

  const [bookings, setBookings] = useState<BookingDetailsResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    useEffect(() => {
      setIsLoading(true);
      getAdminBookings(currentPage, debouncedSearchTerm)
          .then(res => {
              setBookings(res.data.content || []);
              setTotalPages(res.data.totalPages || 0);
          })
          .catch(() => toast({ title: "Error", description: "Failed to fetch bookings.", variant: "destructive" }))
          .finally(() => setIsLoading(false));
  }, [currentPage, debouncedSearchTerm]);
    
  const handleAction = async (action: (id: number) => Promise<any>, id: number, successMessage: string) => {
    try {
        await action(id);
        toast({ variant: "success", title: "Success", description: successMessage });
        // Refresh the current view after an action
        getAdminBookings(currentPage, debouncedSearchTerm).then(res => {
            setBookings(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        });
    } catch (error) {
        toast({ title: "Error", description: "Action failed.", variant: "destructive" });
    }
};

const getStatusBadge = (status: string) => {
  switch (status) {
      case 'PENDING': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Pending</Badge>;
      case 'ACCEPTED': return <Badge className="bg-blue-100 text-primary hover:bg-blue-200">Accepted</Badge>;
      case 'COMPLETED': return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200">Completed</Badge>;
      default: return <Badge>{status}</Badge>;
  }
};

    if (isLoading) return <LoadingSpinner />;

    return (
      <div className="space-y-6">
          <Card>
              <CardHeader>
                  <CardTitle>Manage Bookings</CardTitle>
                  <CardDescription>Approve and track all student sessions.</CardDescription>
                  <div className="relative pt-2 group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                          placeholder="Search by student, class, or mentor..." 
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                          <Button 
                              variant="secondary" 
                              size="icon" 
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                              onClick={() => setSearchTerm('')}
                          >
                              <X className="h-4 w-4 text-destructive" />
                          </Button>
                      )}
                  </div>
              </CardHeader>
              <CardContent>
                  <div className="border rounded-lg">
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Student</TableHead>
                                  <TableHead>Session Details</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {bookings.length > 0 ? (
                                  bookings.map((booking) => (
                                  <TableRow key={booking.bookingId}>
                                      <TableCell className="font-medium">{booking.studentName}</TableCell>
                                      <TableCell>
                                          <div className="font-medium">{booking.className}</div>
                                          <div className="text-sm text-muted-foreground">with {booking.mentorName}</div>
                                          <div className="text-xs text-muted-foreground mt-1">
                                              {new Date(booking.sessionDate).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
                                          </div>
                                      </TableCell>
                                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
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
                                  ))
                              ) : (
                                  <TableRow>
                                      <TableCell colSpan={4} className="text-center h-24">
                                          <div className="flex flex-col items-center gap-2">
                                              <Inbox className="h-8 w-8 text-muted-foreground"/>
                                              <span className="text-muted-foreground">No bookings found.</span>
                                          </div>
                                      </TableCell>
                                  </TableRow>
                              )}
                          </TableBody>
                      </Table>
                  </div>
              </CardContent>
          </Card>

          <div className="flex items-center justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0}>
                  <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {currentPage + 1} of {totalPages || 1}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages - 1}>
                  Next <ChevronRight className="h-4 w-4" />
              </Button>
          </div>
      </div>
  );
}