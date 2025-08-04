import { createMentor, getAllClassesForStudent, uploadFile } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import type { Classroom, CreateMentorRequest } from '@/types';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, BookMarked, Briefcase, DollarSign, GraduationCap, Hash, ImageUp, Mail, MapPin, Phone, User, UploadCloud, FileCheck2 } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// --- 1. SCHEMA VALIDATES RAW FORM DATA (STRINGS) ---
const mentorFormSchema = z.object({
  firstName: z.string().min(2, "First name is required.").max(25, "First name must not exceed 25 characters."),
  lastName: z.string().min(2, "Last name is required.").max(25, "Last name must not exceed 25 characters."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().regex(/^07\d{8}$/, "Phone must be 10 digits and start with 07."),
  address: z.string().optional(),
  title: z.string().min(3, "Title is required."),
  profession: z.string().min(3, "Profession is required."),
  qualification: z.string().min(2, "Qualification is required."),
  // Validate sessionFee and classroomIds as strings from the form
  sessionFee: z.string().min(0, "Session fee is required."),
  image: z.any()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), ".jpg, .jpeg, .png and .webp files are accepted.")
    .optional(),
  bio: z.string().optional(),
  classroomIds: z.array(z.string()).min(1, "Please assign at least one class."),
});

type MentorFormData = z.infer<typeof mentorFormSchema>;

export default function CreateMentorPage() {
    const { toast } = useToast();
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<MentorFormData>({
        resolver: zodResolver(mentorFormSchema),
        defaultValues: { classroomIds: [] }
    });

    const imageFile = watch("image");
    const selectedImageName = imageFile && imageFile.length > 0 ? imageFile[0].name : null;
    
    useEffect(() => {
        getAllClassesForStudent().then(res => setClassrooms(res.data));
    }, []);

    const onSubmit = async (formData: MentorFormData) => {
        let imageUrl = '';
        try {
            if (formData.image && formData.image.length > 0) {
                const fileResponse = await uploadFile(formData.image[0]);
                imageUrl = fileResponse.data.url;
            }

            const mentorData: CreateMentorRequest = {
                ...formData,
                sessionFee: Number(formData.sessionFee), // Convert string to number
                classroomIds: formData.classroomIds.map(Number), // Convert string array to number array
                imageUrl: imageUrl,
                address: formData.address || "",
                bio: formData.bio || "",
            };

            await createMentor(mentorData);
            toast({ title: "Success", description: "Mentor created successfully.", variant: "success", });
            reset();
        } catch (error) {
            toast({ title: "Error", description: "Failed to create mentor.", variant: "destructive" });
        }
    };

    return (
        <Card className="max-w-3xl">
            <CardHeader>
                <CardTitle>Create New Mentor</CardTitle>
                <CardDescription>Fill out the details below to add a new mentor to the platform and assign them to their respective classes.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                         <h3 className="text-lg font-medium border-b pb-2">Personal Details</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="flex items-center"><User className="mr-2 h-4 w-4"/>First Name</Label>
                                <Input id="firstName" {...register("firstName")} />
                                {errors.firstName && <p className="text-xs text-red-600">{errors.firstName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="flex items-center"><User className="mr-2 h-4 w-4"/>Last Name</Label>
                                <Input id="lastName" {...register("lastName")} />
                                {errors.lastName && <p className="text-xs text-red-600">{errors.lastName.message}</p>}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4"/>Email</Label>
                                <Input id="email" type="email" {...register("email")} />
                                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className="flex items-center"><Phone className="mr-2 h-4 w-4"/>Phone</Label>
                                <Input id="phoneNumber" {...register("phoneNumber")} />
                                {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>}
                            </div>
                             <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address" className="flex items-center"><MapPin className="mr-2 h-4 w-4"/>Address</Label>
                                <Input id="address" {...register("address")} />
                            </div>
                         </div>
                    </div>

                     <div className="space-y-4">
                         <h3 className="text-lg font-medium border-b pb-2">Professional Details</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="title" className="flex items-center"><Hash className="mr-2 h-4 w-4"/>Title</Label>
                                <Input id="title" placeholder="e.g. Senior Tutor" {...register("title")} />
                                {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="profession" className="flex items-center"><Briefcase className="mr-2 h-4 w-4"/>Profession</Label>
                                <Input id="profession" {...register("profession")} />
                                {errors.profession && <p className="text-xs text-red-600">{errors.profession.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="qualification" className="flex items-center"><GraduationCap className="mr-2 h-4 w-4"/>Qualification</Label>
                                <Input id="qualification" {...register("qualification")} />
                                {errors.qualification && <p className="text-xs text-red-600">{errors.qualification.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sessionFee" className="flex items-center"><DollarSign className="mr-2 h-4 w-4"/>Session Fee (Rs.)</Label>
                                <Input id="sessionFee" type="number" {...register("sessionFee")} />
                                {errors.sessionFee && <p className="text-xs text-red-600">{errors.sessionFee.message}</p>}
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="image" className="flex items-center"><ImageUp className="mr-2 h-4 w-4"/>Mentor Image</Label>
                                <div className="flex items-center justify-center w-full">
                                    <Label htmlFor="image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                                        {selectedImageName ? (
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <FileCheck2 className="w-8 h-8 mb-2 text-green-500" />
                                                <p className="font-semibold text-sm text-green-600">File Selected:</p>
                                                <p className="text-xs text-muted-foreground">{selectedImageName}</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (MAX. 5MB)</p>
                                            </div>
                                        )}
                                        <Input id="image" type="file" className="hidden" accept="image/*" {...register("image")} />
                                    </Label>
                                </div> 
                                {errors.image && <p className="text-xs text-red-600 mt-2">{errors.image.message as string}</p>}
                            </div>
                        
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" placeholder="A brief introduction about the mentor..." {...register("bio")} />
                            </div>
                         </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-lg font-medium border-b pb-2 flex items-center"><BookMarked className="mr-2 h-4 w-4"/>Assign to Classes</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                            {classrooms.map(cls => (
                                <div key={cls.id} className="flex items-center space-x-2">
                                    <input type="checkbox" value={cls.id} id={`cls-${cls.id}`} className="h-4 w-4 rounded" {...register("classroomIds")} />
                                    <Label htmlFor={`cls-${cls.id}`} className="font-normal">{cls.name}</Label>
                                </div>
                            ))}
                        </div>
                        {errors.classroomIds && <p className="text-xs text-red-600">{errors.classroomIds.message}</p>}
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting} size="lg">
                            {isSubmitting ? "Creating..." : "Create Mentor"}
                            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
