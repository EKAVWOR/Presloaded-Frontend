import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import FeaturedCourses from "../components/home/FeaturedCourses";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Programs from "../components/home/Programs";
import Testimonials from "../components/home/Testimonials";
import CTA from "../components/home/CTA";

const HomePage = () => (
  <>
    <Hero />
    <Stats />
    <Programs />
    <WhyChooseUs />
    <Testimonials />
    <CTA />
  </>
);

export default HomePage;