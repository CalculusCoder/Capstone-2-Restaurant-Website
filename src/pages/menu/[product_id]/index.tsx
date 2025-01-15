import React, { useEffect, useState } from "react";
import HomeNavbar from "@/components/layouts/home_navbar";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

const ProductItem = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { product_id } = router.query;
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["menu-item", product_id],
    queryFn: async () => {
      const response = await axios.get(`/api/order`, {
        headers: {
          // Authorization: `Bearer ${userFirebaseUid}`,
        },
        params: {
          product_id,
        },
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    retry: 0,
    enabled: !!product_id,
  });

  useEffect(() => {
    if (data) {
      const basePrice = Number(data.productData[0]?.price) || 0;

      const toppingsPrice = selectedToppings.reduce((sum, toppingId) => {
        const topping = data.productToppings.find(
          (topping: any) => topping.topping_id === toppingId
        );
        return sum + (Number(topping?.additional_price) || 0);
      }, 0);

      setTotal((basePrice + toppingsPrice) * quantity);
    }
  }, [data, selectedToppings, quantity]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(`/api/cart`, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart-details"] });
      toast({
        title: "Success",
        description: "Succesfully added item to cart. ",
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

  async function handleSubmit() {
    const cartData = {
      product_id,
      selectedToppings,
      quantity,
      total,
      userId,
    };
    mutation.mutate(cartData);
  }

  return (
    <>
      <HomeNavbar />
      <div className=" lg:px-20 xl:px-40 h-screen flex flex-col lg:flex-row justify-around items-center text-red-500 md:gap-8 md:items-center">
        <div className="relative w-3/4 sm:w-2/3 md:w-1/2 h-48 sm:h-64 md:h-[50%] lg:h-[50%] ">
          <Image
            src={`/${data?.productData[0].image_url}`}
            alt={data?.productData[0].product_name || "Product Image"}
            className="rounded-full object-cover"
            fill
          />
        </div>

        <div className="w-full max-w-2xl h-auto flex flex-col gap-4 text-center md:text-left md:h-[70%] md:justify-center md:gap-6 xl:gap-8">
          <h1 className="text-2xl sm:text-3xl font-bold uppercase xl:text-5xl">
            {data?.productData[0].product_name}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg">
            Ignite your taste buds with this fiery delicious dish made
            exclusively here at Miami Delights.
          </p>

          {!userId && <div>Please register or sign in to start ordering!</div>}

          {userId && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">
                ${data?.productData[0].price}
              </h2>

              {/* OPTIONS CONTAINER */}
              <div className="flex flex-wrap gap-6">
                {data?.productToppings?.map((topping: any, index: any) => (
                  <div>
                    <button
                      key={topping.topping_id}
                      className="min-w-[6rem] p-2 ring-1 ring-red-400 rounded-md"
                      style={{
                        background: selectedToppings.includes(
                          topping.topping_id
                        )
                          ? "rgb(248 113 113)"
                          : "white",
                        color: selectedToppings.includes(topping.topping_id)
                          ? "white"
                          : "red",
                      }}
                      onClick={() => {
                        setSelectedToppings((prevSelected) =>
                          prevSelected.includes(topping.topping_id)
                            ? prevSelected.filter(
                                (id) => id !== topping.topping_id
                              )
                            : [...prevSelected, topping.topping_id]
                        );
                      }}
                    >
                      {topping.topping_name}
                    </button>
                    <div className="mt-3 text-center">
                      ${topping.additional_price}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                {/* QUANTITY */}
                <div className="flex justify-between w-full p-3 ring-1 ring-red-500">
                  <span>Quantity</span>
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={() =>
                        setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                      }
                    >
                      {"<"}
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity((prev) => (prev < 9 ? prev + 1 : 9))
                      }
                    >
                      {">"}
                    </button>
                  </div>
                </div>
                {/* CART BUTTON */}
                <button
                  className="uppercase w-56 bg-red-500 text-white p-3 ring-1 ring-red-500"
                  onClick={handleSubmit}
                >
                  Add to Cart
                </button>
              </div>

              <h2 className="text-2xl font-bold">Total: ${total}</h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductItem;
