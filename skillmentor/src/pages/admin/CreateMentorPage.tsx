import { createMentor, getAllClassesForStudent } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import type { Classroom } from '@/types';
import { useEffect, useState } from 'react';

export default function CreateMentorPage() {
    const { toast } = useToast();
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    
    useEffect(() => {
        getAllClassesForStudent().then(res => setClassrooms(res.data));
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const selectedClassroomIds = Array.from(formData.getAll('classroomIds')).map(Number);
        
        const data = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            address: formData.get('address') as string,
            title: formData.get('title') as string,
            sessionFee: Number(formData.get('sessionFee')),
            profession: formData.get('profession') as string,
            bio: formData.get('bio') as string,
            phoneNumber: formData.get('phoneNumber') as string,
            qualification: formData.get('qualification') as string,
            imageUrl: formData.get('imageUrl') as string,
            classroomIds: selectedClassroomIds,
        };

        try {
            await createMentor(data);
            toast({ title: "Success", description: "Mentor created successfully."});
            event.currentTarget.reset();
        } catch (error) {
            toast({ title: "Error", description: "Failed to create mentor.", variant: "destructive"});
        }
    };

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>Create New Mentor</CardTitle>
                <CardDescription>Add a new mentor and assign them to classes.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Form Fields */}
                    <div className="space-y-2"><Label>First Name</Label><Input name="firstName" required/></div>
                    <div className="space-y-2"><Label>Last Name</Label><Input name="lastName" required/></div>
                    <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" required/></div>
                    <div className="space-y-2"><Label>Phone</Label><Input name="phoneNumber"/></div>
                    <div className="space-y-2"><Label>Address</Label><Input name="address"/></div>
                    <div className="space-y-2"><Label>Title</Label><Input name="title" placeholder="e.g. Senior Tutor"/></div>
                    <div className="space-y-2"><Label>Profession</Label><Input name="profession"/></div>
                    <div className="space-y-2"><Label>Qualification</Label><Input name="qualification"/></div>
                    <div className="space-y-2"><Label>Session Fee</Label><Input name="sessionFee" type="number" required/></div>
                    <div className="space-y-2 md:col-span-2"><Label>Image URL</Label><Input name="imageUrl"/></div>
                    <div className="space-y-2 md:col-span-2"><Label>Bio</Label><Textarea name="bio" /></div>
                    
                    <div className="space-y-2 md:col-span-2">
                        <Label>Assign to Classes</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 border rounded-md">
                            {classrooms.map(cls => (
                                <div key={cls.id} className="flex items-center space-x-2">
                                    <input type="checkbox" name="classroomIds" value={cls.id} id={`cls-${cls.id}`} className="rounded" />
                                    <Label htmlFor={`cls-${cls.id}`}>{cls.name}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <Button type="submit">Create Mentor</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}