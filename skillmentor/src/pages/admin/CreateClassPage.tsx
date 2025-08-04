import { createClassroom, uploadFile } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BookMarked, ImageUp, ArrowRight, UploadCloud, FileCheck2 } from 'lucide-react';

// --- Validation Schema (unchanged) ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const classroomFormSchema = z.object({
  name: z.string().min(3, "Class name must be at least 3 characters."),
  image: z.any()
    .refine((files) => files?.length == 1, 'Image is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    )
});

type ClassroomFormData = z.infer<typeof classroomFormSchema>;

export default function CreateClassPage() {
    const { toast } = useToast();
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<ClassroomFormData>({
        resolver: zodResolver(classroomFormSchema)
    });

    const imageFile = watch("image");
    const selectedImageName = imageFile && imageFile.length > 0 ? imageFile[0].name : null;

    const onSubmit = async (formData: ClassroomFormData) => {
        try {
            const file = formData.image[0];
            const fileResponse = await uploadFile(file);
            const imageUrl = fileResponse.data.url;

            const classroomData = {
                name: formData.name,
                imageUrl: imageUrl,
            };

            await createClassroom(classroomData);
            toast({ variant: "success", title: "Success", description: "Classroom created successfully."});
            reset();
        } catch (error) {
            toast({ title: "Error", description: "Failed to create classroom.", variant: "destructive"});
        }
    };

    return (
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>Create New Classroom</CardTitle>
                <CardDescription>Add a new subject that mentors can be assigned to.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center">
                            <BookMarked className="mr-2 h-4 w-4" />
                            Class Name
                        </Label>
                        <Input 
                            id="name" 
                            placeholder="e.g., A/L Physics" 
                            {...register("name")} 
                        />
                        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="image" className="flex items-center">
                           <ImageUp className="mr-2 h-4 w-4" />
                           Class Image
                        </Label>
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
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Creating..." : "Create Class"}
                        {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}