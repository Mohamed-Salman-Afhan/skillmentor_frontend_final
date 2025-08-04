import { useEffect, useState } from 'react';
import { getAdminDashboardStats, getDailyBookings } from '@/api';
import type { AdminDashboardStatsDto, DailyBookings } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, BookOpen} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const name = payload[0].name || label;
        const value = payload[0].value;
        return (
            <div className="p-2 bg-background border rounded-lg shadow-lg">
                <p className="font-semibold">{`${name}: ${value}`}</p>
            </div>
        );
    }
    return null;
};

const PIE_CHART_COLORS = ['hsl(var(--accent))', 'hsl(var(--primary))', 'hsl(var(--muted-foreground))'];

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminDashboardStatsDto | null>(null);
    const [bookingsData, setBookingsData] = useState<DailyBookings[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getAdminDashboardStats(),
            getDailyBookings()
        ]).then(([statsRes, bookingsRes]) => {
            setStats(statsRes.data);
            setBookingsData(bookingsRes.data);
        }).catch(err => {
            console.error("Failed to fetch dashboard data:", err);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading || !stats) {
        return <LoadingSpinner />;
    }

    const pieChartData = [
        { name: 'Pending', value: stats.pendingSessions },
        { name: 'Accepted', value: stats.acceptedSessions },
        { name: 'Completed', value: stats.completedSessions },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">A high-level overview of the Skillmentor platform.</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Mentors</CardTitle>
                        <div className="p-2 bg-blue-100 rounded-full"><Users className="h-5 w-5 text-blue-600" /></div>
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.totalMentors}</div></CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <div className="p-2 bg-green-100 rounded-full"><UserCheck className="h-5 w-5 text-green-600" /></div>
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.totalStudents}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Classrooms</CardTitle>
                        <div className="p-2 bg-purple-100 rounded-full"><BookOpen className="h-5 w-5 text-purple-600" /></div>
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.totalClassrooms}</div></CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Session Status Overview</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value" nameKey="name">
                                    {pieChartData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Total Bookings Per Day</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                             <LineChart data={bookingsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" stroke="#888888" fontSize={12} />
                                <YAxis stroke="#888888" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="bookingCount" stroke="hsl(var(--primary))" strokeWidth={2} name="Total Bookings" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}