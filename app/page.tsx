import HeroSection from "@/component/HeroSection";
import Why from "@/component/why";
import What from "@/component/what";
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