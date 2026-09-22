import HomeHero from '@/component/home/HomeHero';
import ExploreCategories from '@/component/home/ExploreCategories';
import HowRendozWorks from '@/component/home/HowRendozWorks';
import TrendingSection from '@/component/home/TrendingSection';
import CloseToYou from '@/component/home/CloseToYou';
import EarnSection from '@/component/home/EarnSection';
import HomeFaq from '@/component/home/HomeFaq';
import Testimonials from '@/component/home/Testimonials';
import HomeFooter from '@/component/home/HomeFooter';

export default function HomePage() {
  return (
    <>
      <main className="overflow-x-hidden">
        <HomeHero />
        <ExploreCategories />
        <HowRendozWorks />
        <TrendingSection />
        <CloseToYou />
        <EarnSection />
        <HomeFaq />
        <Testimonials />
      </main>
      <HomeFooter />
    </>
  );
}
