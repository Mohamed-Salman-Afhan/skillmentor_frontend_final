import { createClassroom } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

export default function CreateClassPage() {
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get('name') as string,
            imageUrl: formData.get('imageUrl') as string,
        };

        try {
            await createClassroom(data);
            toast({ title: "Success", description: "Classroom created successfully."});
            event.currentTarget.reset();
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
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Class Name</Label>
                        <Input id="name" name="name" placeholder="e.g., A/L Physics" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Class Image URL</Label>
                        <Input id="imageUrl" name="imageUrl" placeholder="https://example.com/image.jpg" />
                    </div>
                    <Button type="submit">Create Class</Button>
                </form>
            </CardContent>
        </Card>
    );
}