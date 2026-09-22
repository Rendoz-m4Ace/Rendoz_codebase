import HomeNavbar from '@/component/home/HomeNavbar';
import HomeHero from '@/component/home/HomeHero';
import ExploreCategories from '@/component/home/ExploreCategories';
import FeaturedListings from '@/component/home/FeaturedListings';
import HowRendozWorks from '@/component/home/HowRendozWorks';
import TrendingSection from '@/component/home/TrendingSection';
import CloseToYou from '@/component/home/CloseToYou';
import EarnSection from '@/component/home/EarnSection';
import Testimonials from '@/component/home/Testimonials';
import HomeFooter from '@/component/home/HomeFooter';

export default function HomePage() {
  return (
    <>
      <HomeNavbar />
      <main>
        <HomeHero />
        <ExploreCategories />
        <FeaturedListings />
        <HowRendozWorks />
        <TrendingSection />
        <CloseToYou />
        <EarnSection />
        <Testimonials />
      </main>
      <HomeFooter />
    </>
  );
}
