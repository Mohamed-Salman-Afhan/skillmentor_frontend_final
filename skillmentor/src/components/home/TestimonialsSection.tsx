import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
    {
        quote: "Skillmentor helped me finally understand complex topics I've struggled with for years. My mentor was fantastic!",
        name: "Sarah L.",
        role: "A/L Student",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        quote: "The flexibility and quality of tutors are unmatched. I was able to find the perfect mentor for my needs.",
        name: "David K.",
        role: "A/L Student",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        quote: "A must-have for any student looking for extra help. The platform is simple and effective.",
        name: "Emily R.",
        role: "A/L Student",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
];

export default function TestimonialsSection() {
    return (
        <section className="py-20">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold tracking-tight">Loved by Students Everywhere</h2>
                <p className="mt-4 text-lg text-muted-foreground">Here's what our users are saying about us.</p>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.name}>
                            <CardContent className="pt-6">
                                <p className="italic">"{testimonial.quote}"</p>
                                <div className="mt-4 flex items-center justify-center">
                                    <Avatar>
                                        <AvatarImage src={testimonial.avatar} />
                                        <AvatarFallback>{testimonial.name.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 text-left">
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}