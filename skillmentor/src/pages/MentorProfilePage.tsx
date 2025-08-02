import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMentorProfile } from '@/api';
import type { MentorProfileResponse } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function MentorProfilePage() {
    const { id } = useParams<{ id: string }>();
    const [profile, setProfile] = useState<MentorProfileResponse | null>(null);

    useEffect(() => {
        if (id) {
            getMentorProfile(parseInt(id)).then(res => setProfile(res.data));
        }
    }, [id]);

    if (!profile) return <div>Loading mentor profile...</div>;

    return (
        <div>
            <Button asChild variant="ghost" className="mb-4">
                <Link to="/classes"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Classes</Link>
            </Button>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <Avatar className="w-32 h-32">
                    <AvatarImage src={profile.mentor.imageUrl} />
                    <AvatarFallback>{profile.mentor.firstName[0]}{profile.mentor.lastName[0]}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-bold">{profile.mentor.firstName} {profile.mentor.lastName}</h1>
                    <p className="text-xl text-muted-foreground mt-1">{profile.mentor.profession}</p>
                    <p className="mt-4">{profile.mentor.bio}</p>
                    <p className="mt-2"><span className="font-semibold">Qualifications:</span> {profile.mentor.qualification}</p>
                </div>
            </div>
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Classes Taught</h2>
                <div className="space-y-3">
                    {profile.classes.map(c => (
                        <div key={c.name} className="flex justify-between items-center p-4 bg-muted rounded-lg">
                           <span className="font-medium">{c.name}</span>
                           <Badge>{c.studentCount} students booked</Badge>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}