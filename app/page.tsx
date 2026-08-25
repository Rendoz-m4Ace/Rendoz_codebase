import HeroSection from "@/component/HeroSection";
import Why from "@/component/Why";
import What from "@/component/What";
import TrustFeatures from "@/component/TrustFeatures";
import HowItWorks from "@/component/HowItWorks";
import FAQSection from "@/component/FAQSection";
import WaitlistFooter from "@/component/WaitlistFooter";
 
export default function Home() {
  return (
    <main>
      <HeroSection />
      <Why />
      <What />
      <TrustFeatures />
      <HowItWorks />
      <FAQSection />
      <WaitlistFooter />
    </main>
  );
}