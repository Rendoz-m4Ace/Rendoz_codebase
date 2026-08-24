import TrustFeatures from "@/components/TrustFeatures";
import HowItWorks from "@/components/HowItWorks";
import FAQSection from "@/components/FAQSection";
import WaitlistFooter from "@/components/WaitlistFooter";
 
export default function Home() {
  return (
    <main>
      <TrustFeatures />
      <HowItWorks />
      <FAQSection />
      <WaitlistFooter />
    </main>
  );
}