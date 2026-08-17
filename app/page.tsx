import HeroSection from "@/component/HeroSection";
import TrustFeatures from "@/component/TrustFeatures";
import HowItWorks from "@/component/HowItWorks";
import FAQSection from "@/component/FAQSection";
import WaitlistFooter from "@/component/WaitlistFooter";
 
export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrustFeatures />
      <HowItWorks />
      <FAQSection />
      <WaitlistFooter />
    </main>
  );
}