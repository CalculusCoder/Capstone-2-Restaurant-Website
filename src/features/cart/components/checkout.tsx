import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

type CartData = {
  cart_id: number;
  cart_item_id: number;
  quantity: number;
  total_price: string;
  product_name: string;
  toppings: Toppings[];
};

type Toppings = {
  topping_id: number;
  topping_name: string;
  additional_price: number;
};

interface Props {
  cartData: CartData[];
  totalAmount: number;
}

const Checkout: React.FC<Props> = ({ cartData, totalAmount }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const mutation = useMutation({
    mutationFn: async (cartItemId: number) => {
      const response = await axios.delete(`/api/cart-delete`, {
        params: { cartItemId },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart-details"] });

      toast({
        title: "Success",
        description: "Succesfully deleted cart item.",
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

  const stripeMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/checkout-sessions`, {
        cartData,
        totalAmount,
        userId,
      });
      return response.data;
    },
    onSuccess: (data) => {
      window.location.href = data.url;
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

  return (
    <>
      <div className="flex flex-col gap-y-4">
        {cartData?.map((item) => (
          <div
            key={item.cart_item_id}
            className="p-4 border-b last:border-b-0 flex flex-col gap-y-2"
          >
            {/* Product Details */}
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">{item.product_name}</h3>
              <p className="text-sm text-gray-500">
                Total: ${item.total_price}
              </p>
            </div>
            {/* Quantity */}

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              <button
                className="text-sm text-gray-500"
                onClick={() => mutation.mutate(item.cart_item_id)}
              >
                <Trash2 className="text-red-500" />
              </button>
            </div>

            {/* Toppings */}
            <div>
              <h4 className="text-sm font-medium">Toppings</h4>
              <ul className="flex gap-2 text-sm text-gray-500">
                {item.toppings.map((topping) => (
                  <li key={topping.topping_id}>
                    {topping.topping_name} (+${topping.additional_price})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {(cartData?.length === 0 || !cartData) && (
          <div>Start addding items to your cart!</div>
        )}

        {cartData.length > 0 && (
          <div className="flex justify-between">
            <div className="font-semibold">
              Total Amount: <span className="text-red-500">${totalAmount}</span>
            </div>
            <div>
              <section>
                <Button
                  onClick={() => stripeMutation.mutate()}
                  type="submit"
                  role="link"
                  className="bg-red-500"
                >
                  Checkout
                </Button>
              </section>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Checkout;
