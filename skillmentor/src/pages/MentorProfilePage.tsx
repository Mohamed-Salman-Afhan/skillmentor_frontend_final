import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMentorProfile } from '@/api';
import type { MentorProfileResponse } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookCopy, Briefcase, GraduationCap, DollarSign } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MentorProfilePage() {
    const { id } = useParams<{ id: string }>();
    const [profile, setProfile] = useState<MentorProfileResponse | null>(null);

    useEffect(() => {
        if (id) {
            getMentorProfile(parseInt(id)).then(res => setProfile(res.data));
        }
    }, [id]);

    if (!profile) return <LoadingSpinner />;

    const { mentor, classes } = profile;

    return (
        <div>
            <Button asChild variant="outline" className="mb-6">
                <Link to="/classes"><ArrowLeft className="mr-2 h-4 w-4"/>Back to All Classes</Link>
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Mentor Details */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="w-24 h-24 mb-4">
                                <AvatarImage src={mentor.imageUrl} />
                                <AvatarFallback>{mentor.firstName[0]}{mentor.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <h1 className="text-2xl font-bold">{mentor.firstName} {mentor.lastName}</h1>
                            <p className="text-md text-muted-foreground">{mentor.title}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-3 text-muted-foreground" />
                                <span>{mentor.profession}</span>
                            </div>
                            <div className="flex items-center">
                                <GraduationCap className="h-4 w-4 mr-3 text-muted-foreground" />
                                <span>{mentor.qualification}</span>
                            </div>
                            <div className="flex items-center font-semibold text-primary">
                                <DollarSign className="h-4 w-4 mr-3" />
                                <span>Rs. {Number(mentor.sessionFee).toLocaleString('en-US')} / session</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Bio and Classes */}
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <CardHeader><CardTitle>About Me</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{mentor.bio}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Classes Taught</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {classes.map(c => (
                                <div key={c.name} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                    <div className="flex items-center">
                                        <BookCopy className="h-5 w-5 mr-3 text-primary" />
                                        <span className="font-medium">{c.name}</span>
                                    </div>
                                   <Badge variant="secondary">{c.studentCount} students booked</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}