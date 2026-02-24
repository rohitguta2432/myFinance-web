import { HeroSection } from "@/components/sections/hero";
import { OutcomesSection } from "@/components/sections/outcomes";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { PrivacyFirstSection } from "@/components/sections/privacy-first";
import { PricingTableSection } from "@/components/sections/pricing-table";
import { FDCalculatorSection } from "@/components/sections/fd-calculator";
import { SampleInsightsSection } from "@/components/sections/sample-insights";
import { FAQSection } from "@/components/sections/faq";
import { FinalCTASection } from "@/components/sections/final-cta";

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <OutcomesSection />
            <HowItWorksSection />
            <PrivacyFirstSection />
            <PricingTableSection />
            <FDCalculatorSection />
            <SampleInsightsSection />
            <FAQSection />
            <FinalCTASection />
        </>
    );
}
