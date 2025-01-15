import React from "react";
import LandingPage from "../features/restaurant_home/components/landing_page";
import HomeNavbar from "@/components/layouts/home_navbar";
import FeaturedFoods from "@/features/restaurant_home/components/featured_foods";
import Contact from "@/features/restaurant_home/components/contact_us";

const Home = () => {
  return (
    <>
      <HomeNavbar />
      <LandingPage />
      <FeaturedFoods />
      <Contact />
    </>
  );
};

export default Home;
