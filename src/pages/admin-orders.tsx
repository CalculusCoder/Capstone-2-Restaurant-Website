import React from "react";
import HomeNavbar from "@/components/layouts/home_navbar";
import AdminOrdersList from "@/features/admin_orders/components/admin_orders_list";

const AdminOrders = () => {
  return (
    <>
      <HomeNavbar />
      <AdminOrdersList />
    </>
  );
};

export default AdminOrders;
