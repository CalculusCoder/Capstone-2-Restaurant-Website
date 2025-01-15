import React from "react";
import LandingPage from "../features/restaurant_home/components/landing_page";
import HomeNavbar from "@/components/layouts/home_navbar";
import FeaturedFoods from "@/features/restaurant_home/components/featured_foods";

const Home = () => {
  return (
    <>
      <HomeNavbar />
      <LandingPage />
      <FeaturedFoods />
    </>
  );
};

export default Home;
