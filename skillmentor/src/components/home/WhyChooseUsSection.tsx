import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Star, BookOpen } from 'lucide-react';

const features = [
    {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: "Expert Mentors",
        description: "Connect with highly qualified mentors who are experts in their fields and passionate about teaching.",
    },
    {
        icon: <Star className="h-8 w-8 text-primary" />,
        title: "Personalized Learning",
        description: "Get tailored 1-on-1 sessions designed to meet your specific learning goals and pace.",
    },
    {
        icon: <BookOpen className="h-8 w-8 text-primary" />,
        title: "Flexible Scheduling",
        description: "Book sessions at times that fit your schedule, with our easy-to-use online booking system.",
    },
];

export default function WhyChooseUsSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold tracking-tight">Why Choose Skillmentor?</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    We provide a comprehensive platform designed to accelerate your learning journey and help you achieve academic excellence.
                </p>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <Card key={feature.title} className="text-left transform transition-transform hover:-translate-y-2">
                            <CardHeader>
                                <div className="bg-primary/10 p-4 rounded-full w-fit mb-4">
                                    {feature.icon}
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                                <CardDescription className="mt-2">{feature.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}