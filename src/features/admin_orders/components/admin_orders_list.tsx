import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Orders = {
  order_item_id: number;
  quantity: number;
  total_price: string;
  product_name: string;
  order_status: string;
  created_at: string;
  order_id: number;
  toppings: Toppings[];
};

type Toppings = {
  order_item_topping_id: number;
  topping_name: string;
};

const AdminOrdersList = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const response = await axios.get("/api/admin-orders", {
        headers: {
          // Authorization: `Bearer ${userFirebaseUid}`,
        },
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    retry: 0,
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put(`/api/admin-orders-update`, { ...data });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["track-orders"] });

      console.log("Track orders query invalidated");

      toast({
        title: "Success",
        description: "Succesfully updated status.",
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.error || "Unknown error occurred";

        toast({
          title: "Error",
          description: errorMessage,
        });
      } else {
        toast({
          title: "Error",
          description:
            "Something went wrong. If the issue persists, please contact support.",
        });
      }
    },
  });

  const groupedOrders = (data?.orders || []).reduce(
    (acc: Record<number, Orders[]>, order: Orders) => {
      acc[order.order_id] = acc[order.order_id] || [];
      acc[order.order_id].push(order);
      return acc;
    },
    {}
  );

  async function onSubmit(orderId: number, status: string) {
    const orderData = {
      orderId,
      status,
    };
    mutation.mutate(orderData);
  }

  return (
    <>
      <div className="p-4 lg:px-20 xl:px-40">
        <h1 className="text-2xl font-bold mb-6">All Restaurant Orders</h1>
        {Object.keys(groupedOrders).length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <table className="w-full border-separate border-spacing-3">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="hidden md:table-cell">Order ID</th>
                <th>Date</th>
                <th>Price</th>
                <th>Product</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedOrders).map(([orderId, orders]: any) => {
                const firstOrder = orders[0];
                return (
                  <React.Fragment key={orderId}>
                    <tr className="bg-gray-200">
                      <td className="hidden md:table-cell py-4 px-2">
                        {orderId}
                      </td>
                      <td className="py-4 px-2">
                        {new Date(firstOrder.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-2">
                        $
                        {orders
                          .reduce(
                            (sum: any, order: any) =>
                              sum + parseFloat(order.total_price),
                            0
                          )
                          .toFixed(2)}
                      </td>
                      <td colSpan={2} className="py-4 px-2">
                        <Select
                          defaultValue={firstOrder.order_status}
                          onValueChange={(value) =>
                            onSubmit(parseInt(orderId), value)
                          }
                        >
                          <SelectTrigger
                            className={`py-4 px-2 capitalize ${
                              firstOrder.order_status === "preparing"
                                ? "bg-blue-200"
                                : firstOrder.order_status === "oven"
                                ? "bg-red-300"
                                : firstOrder.order_status === "ready"
                                ? "bg-green-300"
                                : firstOrder.order_status === "delivered"
                                ? "bg-green-500"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="oven">Oven</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                    {orders.map((order: any) => (
                      <tr
                        key={order.order_item_id}
                        className="text-sm odd:bg-gray-100"
                      >
                        <td className="hidden md:table-cell py-4 px-2"></td>
                        <td className="py-4 px-2"></td>
                        <td className="py-4 px-2">
                          ${parseFloat(order.total_price).toFixed(2)}
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-medium">
                            {order.product_name}
                          </span>
                          {order.toppings.length > 0 && (
                            <ul className="text-sm text-gray-600 mt-1">
                              {order.toppings.map((topping: any) => (
                                <li key={topping.order_item_topping_id}>
                                  • {topping.topping_name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                        <td></td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AdminOrdersList;
