import { useEffect, useState } from 'react';
import { getAllClassesForStudent } from '@/api';
import type { Classroom, Mentor } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BookingDialog from '@/components/common/BookingDialog'; // <-- IMPORT THE DIALOG

export default function AllClassesPage() {
    const [classes, setClasses] = useState<Classroom[]>([]);
    const [loading, setLoading] = useState(true);
    
    // --- STATE FOR THE DIALOG ---
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

    useEffect(() => {
        getAllClassesForStudent()
            .then(res => setClasses(res.data))
            .catch(err => console.error("Failed to fetch classes:", err))
            .finally(() => setLoading(false));
    }, []);
    
    // --- FUNCTION TO OPEN THE DIALOG ---
    const handleScheduleClick = (cls: Classroom, mentor: Mentor) => {
        setSelectedClass(cls);
        setSelectedMentor(mentor);
        setDialogOpen(true);
    };

    if (loading) {
        return <div className="text-center p-10">Loading available classes...</div>;
    }

    return (
        <>
            <h1 className="text-3xl font-bold tracking-tight mb-6">Browse Classes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map(cls => (
                    <Card key={cls.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{cls.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                           {(cls.mentors && cls.mentors.length > 0) ? cls.mentors.map(mentor => (
                               <div key={mentor.id} className="space-y-4">
                                   <div className="flex items-center gap-3">
                                       <Avatar>
                                           <AvatarImage src={mentor.imageUrl} alt={`${mentor.firstName} ${mentor.lastName}`} />
                                           <AvatarFallback>{mentor.firstName[0]}{mentor.lastName[0]}</AvatarFallback>
                                       </Avatar>
                                       <div>
                                           <p className="font-semibold">{mentor.firstName} {mentor.lastName}</p>
                                           <p className="text-sm text-muted-foreground">{mentor.title}</p>
                                       </div>
                                   </div>
                                   <div className="flex justify-end gap-2">
                                       <Link to={`/mentor/${mentor.id}`}><Button variant="secondary" size="sm">Profile</Button></Link>
                                       {/* --- ADD ONCLICK HANDLER HERE --- */}
                                       <Button size="sm" onClick={() => handleScheduleClick(cls, mentor)}>
                                            Schedule <ArrowRight className="ml-2 h-4 w-4" />
                                       </Button>
                                   </div>
                               </div>
                           )) : <p className="text-sm text-muted-foreground">No mentors assigned yet.</p>}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* --- RENDER THE DIALOG --- */}
            <BookingDialog 
                open={isDialogOpen}
                onOpenChange={setDialogOpen}
                classroom={selectedClass}
                mentor={selectedMentor}
            />
        </>
    )
}