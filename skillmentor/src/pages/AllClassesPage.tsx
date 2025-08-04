import { useEffect, useState } from 'react';
import { getAllClassesForStudent } from '@/api';
import type { Classroom, Mentor } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BookUser } from 'lucide-react';
import BookingDialog from '@/components/common/BookingDialog';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AllClassesPage() {
    const [classes, setClasses] = useState<Classroom[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

    useEffect(() => {
        getAllClassesForStudent()
            .then(res => setClasses(res.data))
            .catch(err => console.error("Failed to fetch classes:", err))
            .finally(() => setLoading(false));
    }, []);
    
    const handleScheduleClick = (cls: Classroom, mentor: Mentor) => {
        setSelectedClass(cls);
        setSelectedMentor(mentor);
        setDialogOpen(true);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Browse Classes</h1>
                <p className="text-muted-foreground">Find the perfect mentor for your needs in any subject.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map(cls => (
                    <Card key={cls.id} className="flex flex-col overflow-hidden">
                        <img 
                            src={cls.imageUrl || 'https://img.freepik.com/free-vector/empty-classroom-interior-with-chalkboard_1308-61229.jpg?w=740'} 
                            alt={cls.name}
                            className="h-40 w-full object-cover"
                        />
                        <CardHeader>
                            <CardTitle>{cls.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between">
                           <div className="space-y-4">
                                {(cls.mentors && cls.mentors.length > 0) ? cls.mentors.map((mentor, index) => (
                                    <div key={mentor.id}>
                                        {/* Add a separator between mentors */}
                                        {index > 0 && <hr className="my-4" />}
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={mentor.imageUrl} alt={`${mentor.firstName} ${mentor.lastName}`} />
                                                <AvatarFallback>{mentor.firstName[0]}{mentor.lastName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{mentor.firstName} {mentor.lastName}</p>
                                                <p className="text-sm text-muted-foreground">{mentor.title}</p>
                                                <p className="text-sm font-semibold text-primary">Rs. {Number(mentor.sessionFee).toLocaleString('en-US')}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-3">
                                            <Link to={`/mentor/${mentor.id}`}><Button variant="outline" size="sm">Profile</Button></Link>
                                            <Button size="sm" onClick={() => handleScheduleClick(cls, mentor)}>
                                                Schedule <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center text-sm text-muted-foreground py-4">
                                        <BookUser className="mx-auto h-8 w-8 mb-2" />
                                        No mentors assigned yet.
                                    </div>
                                )}
                           </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <BookingDialog 
                open={isDialogOpen}
                onOpenChange={setDialogOpen}
                classroom={selectedClass}
                mentor={selectedMentor}
            />
        </>
    )
}