import HeroSection from "@/components/home/HeroSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import Footer from "@/components/home/Footer";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <FaqSection />
      <Footer />
    </div>
  );
}