import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createBooking, uploadFile } from "@/api";
import type { Classroom, Mentor, CreateBookingRequest } from "@/types";
import { useState, useRef } from "react"; 
  
interface BookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classroom: Classroom | null;
    mentor: Mentor | null;
  }
  
  export default function BookingDialog({ open, onOpenChange, classroom, mentor }: BookingDialogProps) {
    const { toast } = useToast();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null); // <-- CREATE A REF FOR THE FORM
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!classroom || !mentor || !selectedFile) {
          toast({ title: "Missing Information", description: "Please select a date and upload the payment slip.", variant: "destructive" });
          return;
      }
      
      // Check if the form ref is available
      if (!formRef.current) {
          return;
      }
  
      setSubmitting(true);
      try {
        const fileResponse = await uploadFile(selectedFile);
        const bankSlipUrl = fileResponse.data.url;
  
        // --- THIS IS THE FIX ---
        // Use the ref to create FormData, which guarantees the correct element type.
        const formData = new FormData(formRef.current);
        const localDateTime = formData.get('sessionDateTime') as string;
        const sessionDateTimeISO = new Date(localDateTime).toISOString();
        // --- END OF FIX ---
  
        const bookingData: CreateBookingRequest = {
          classroomId: classroom.id,
          mentorId: mentor.id,
          sessionDateTime: sessionDateTimeISO,
          duration: 60,
          bankSlipUrl: bankSlipUrl,
        };
  
        await createBooking(bookingData);
        toast({ title: "Success!", description: "Your session has been booked and is pending approval." });
        onOpenChange(false);
      } catch (error) {
        console.error("Booking failed:", error);
        toast({ title: "Booking Failed", description: "Could not create the booking. Please try again.", variant: "destructive" });
      } finally {
          setSubmitting(false);
      }
    };
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Session</DialogTitle>
            <DialogDescription>
              Book a session for **{classroom?.name}** with **{mentor?.firstName} {mentor?.lastName}**.
            </DialogDescription>
          </DialogHeader>
          {/* --- ATTACH THE REF TO THE FORM ELEMENT --- */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                  <Label htmlFor="sessionDateTime">Preferred Date & Time</Label>
                  <Input id="sessionDateTime" name="sessionDateTime" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="bankSlip">Upload Payment Slip (Image)</Label>
                  <Input id="bankSlip" type="file" required accept="image/*" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}/>
              </div>
              <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Booking..." : "Confirm Booking"}
                  </Button>
              </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }