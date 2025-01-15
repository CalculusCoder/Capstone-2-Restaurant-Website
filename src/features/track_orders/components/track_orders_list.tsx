import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";

type Orders = {
  order_item_id: number;
  quantity: number;
  total_price: string;
  product_name: string;
  order_status: string;
  created_at: string;
  toppings: Toppings[];
};

type Toppings = {
  order_item_topping_id: number;
  topping_name: string;
};

const OrdersList = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["track-orders"],
    queryFn: async () => {
      const response = await axios.get("/api/track-orders", {
        headers: {
          // Authorization: `Bearer ${userFirebaseUid}`,
        },
        params: {
          userId,
        },
      });
      return response.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: !!userId,
    retry: 0,
  });

  if (isLoading) {
    return <p className="text-center p-4">Loading orders...</p>;
  }

  if (isError) {
    return (
      <p className="text-center p-4 text-red-500">
        Error loading orders. Please try again later.
      </p>
    );
  }

  return (
    <>
      <div className="p-4 lg:px-20 xl:px-40">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        {data?.orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <table className="w-full border-separate border-spacing-3">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="hidden md:table-cell">Order Item ID</th>
                <th>Date</th>
                <th>Price</th>
                <th>Product</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.orders.map((order: Orders) => (
                <tr
                  key={order.order_item_id}
                  className="text-sm md:text-base odd:bg-gray-100"
                >
                  <td className="hidden md:table-cell py-4 px-2">
                    {order.order_item_id}
                  </td>
                  <td className="py-4 px-2">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-2">
                    ${parseFloat(order.total_price).toFixed(2)}
                  </td>
                  <td className="py-4 px-2">
                    <div>
                      <span className="font-medium">{order.product_name}</span>
                      {order.toppings.length > 0 && (
                        <ul className="text-sm text-gray-600 mt-1">
                          {order.toppings.map((topping) => (
                            <li key={topping.order_item_topping_id}>
                              • {topping.topping_name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </td>

                  <td
                    className={`py-4 px-2 capitalize ${
                      order.order_status === "preparing"
                        ? "bg-blue-200"
                        : order.order_status === "oven"
                        ? "bg-red-300"
                        : order.order_status === "ready"
                        ? "bg-green-300"
                        : order.order_status === "delivered"
                        ? "bg-green-500"
                        : ""
                    }`}
                  >
                    {order.order_status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default OrdersList;
