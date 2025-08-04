import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createBooking, uploadFile } from "@/api";
import type { Classroom, Mentor, CreateBookingRequest } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, UploadCloud, ArrowRight } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const bookingFormSchema = z.object({
  sessionDateTime: z.string().min(1, "Session date and time are required.").refine((dateTime) => new Date(dateTime) > new Date(), {
    message: "Booking date and time must be in the future.",
  }),
  bankSlip: z.instanceof(FileList)
    .refine((files) => files?.length == 1, 'Payment slip is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom: Classroom | null;
  mentor: Mentor | null;
}

export default function BookingDialog({ open, onOpenChange, classroom, mentor }: BookingDialogProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
  });

  const onSubmit = async (formData: BookingFormData) => {
    if (!classroom || !mentor) return;

    try {
      const file = formData.bankSlip[0];
      const fileResponse = await uploadFile(file);
      const bankSlipUrl = fileResponse.data.url;

      const bookingData: CreateBookingRequest = {
        classroomId: classroom.id,
        mentorId: mentor.id,
        sessionDateTime: new Date(formData.sessionDateTime).toISOString(),
        duration: 60,
        bankSlipUrl: bankSlipUrl,
      };

      await createBooking(bookingData);
      toast({ title: "Success!", description: "Your session is booked and pending approval.", variant: "success" });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Booking failed:", error);
      toast({ title: "Booking Failed", description: "Could not create the booking. Please try again.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Schedule a Session</DialogTitle>
          <DialogDescription>
            You are booking a session for <span className="font-semibold text-primary">{classroom?.name}</span> with <span className="font-semibold text-primary">{mentor?.firstName} {mentor?.lastName}</span>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="space-y-2">
                <Label htmlFor="sessionDateTime" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Preferred Date & Time
                </Label>
                <Input id="sessionDateTime" type="datetime-local" {...register("sessionDateTime")} />
                {errors.sessionDateTime && <p className="text-xs text-red-600">{errors.sessionDateTime.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="bankSlip" className="flex items-center">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload Payment Slip
                </Label>
                <Input id="bankSlip" type="file" accept="image/*" {...register("bankSlip")} />
                {errors.bankSlip && <p className="text-xs text-red-600">{errors.bankSlip.message as string}</p>}
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Booking..." : "Confirm Booking"}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}