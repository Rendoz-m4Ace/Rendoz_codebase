import HeroSection from "@/component/HeroSection";
import Why from "@/component/why";
import What from "@/component/what";
import TrustFeatures from "@/component/TrustFeatures";
import HowItWorks from "@/component/HowItWorks";
import FAQSection from "@/component/FAQSection";
import WaitlistFooter from "@/component/WaitlistFooter";
import RentCategory from "@/component/RentCategory";
import MarketPlace from "@/component/MarketPlace";
 
export default function Home() {
  return (
    <main>
      <HeroSection />
      <Why />
      <What />
      <RentCategory />
      <MarketPlace />
      <TrustFeatures />
      <HowItWorks />
      <FAQSection />
      <WaitlistFooter />
    </main>
  );
}