import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

type Product = {
  product_id: number;
  product_name: string;
  price: string;
  product_category: string;
  image_url: string;
};

const MenuItems = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const response = await axios.get(`/api/menu`, {
        headers: {
          // Authorization: `Bearer ${userFirebaseUid}`,
        },
        params: {
          // companyId,
        },
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    retry: 0,
  });

  return (
    <section className=" py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-8">
          Menu
        </h2>

        {/* pizzas */}
        <h2 className="text-3xl font-bold text-red-500 mb-4">Pizzas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.pizzas.map((pizza: Product) => (
            <Link href={`/menu/${pizza.product_id}`}>
              <Card
                key={pizza.product_id}
                className="shadow-lg hover:shadow-2xl transition"
              >
                <CardHeader className="p-0">
                  <img
                    src={pizza.image_url}
                    alt={pizza.product_name}
                    className="rounded-t-lg object-cover h-48 w-full"
                  />
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle className="text-xl font-bold text-red-500">
                    {pizza.product_name}
                  </CardTitle>

                  <p className="text-lg text-gray-700 font-medium mt-2">
                    ${pizza.price}
                  </p>

                  <div className="mt-4">
                    <button className="bg-red-500 text-white py-2 px-4 rounded-xl">
                      Order Now
                    </button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* burgers */}
        <h2 className="text-3xl font-bold text-red-500 mb-4 mt-16">Burgers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.burgers.map((pizza: Product) => (
            <Link href={`/menu/${pizza.product_id}`}>
              <Card
                key={pizza.product_id}
                className="shadow-lg hover:shadow-2xl transition"
              >
                <CardHeader className="p-0">
                  <img
                    src={pizza.image_url}
                    alt={pizza.product_name}
                    className="rounded-t-lg object-cover h-48 w-full"
                  />
                </CardHeader>
                <CardContent className="text-center">
                  <CardTitle className="text-xl font-bold text-red-500">
                    {pizza.product_name}
                  </CardTitle>

                  <p className="text-lg text-gray-700 font-medium mt-2">
                    ${pizza.price}
                  </p>

                  <div className="mt-4">
                    <Link href={"/menu"}>
                      <button className="bg-red-500 text-white py-2 px-4 rounded-xl">
                        Order Now
                      </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuItems;
