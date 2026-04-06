import { HeroSection } from "@/components/landing/hero";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { ProblemsSection } from "@/components/landing/problems";
import { TaxSection } from "@/components/landing/tax";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { PricingSection } from "@/components/landing/pricing";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { FounderSection } from "@/components/landing/founder";
import { FinalCTASection } from "@/components/landing/final-cta";
import { ScrollReveal } from "@/components/landing/scroll-reveal";

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <ScrollReveal>
                <DashboardPreview />
            </ScrollReveal>
            <ScrollReveal>
                <ProblemsSection />
            </ScrollReveal>
            <ScrollReveal>
                <TaxSection />
            </ScrollReveal>
            <HowItWorksSection />
            <ScrollReveal>
                <PricingSection />
            </ScrollReveal>
            <ScrollReveal>
                <TestimonialsSection />
            </ScrollReveal>
            <ScrollReveal>
                <FounderSection />
            </ScrollReveal>
            <ScrollReveal>
                <FinalCTASection />
            </ScrollReveal>
        </>
    );
}
