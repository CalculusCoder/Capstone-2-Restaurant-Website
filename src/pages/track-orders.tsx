import React from "react";
import HomeNavbar from "@/components/layouts/home_navbar";
import OrdersList from "@/features/track_orders/components/track_orders_list";

const TrackOrders = () => {
  return (
    <>
      <HomeNavbar />
      <OrdersList />
    </>
  );
};

export default TrackOrders;
