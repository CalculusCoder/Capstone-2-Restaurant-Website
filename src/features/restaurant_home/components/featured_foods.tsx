import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const foodData = [
  {
    id: 1,
    title: "Margherita Pizza",
    image: "/pizza1.jpg",
  },
  {
    id: 2,
    title: "Cowboy Burger",
    image: "/burger-3.jpg",
  },
  {
    id: 3,
    title: "The Monster Burger",
    image: "/burger-2.jpg",
  },
  {
    id: 4,
    title: "Cheese Pizza",
    image: "/cheese.jpg",
  },
  {
    id: 5,
    title: "Pepporoni Pizza",
    image: "/pep.jpg",
  },
  {
    id: 5,
    title: "Miami Ribeye",
    image: "/steak.jpg",
  },
];

const FeaturedFoods = () => {
  return (
    <section className=" py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-8">
          Featured Foods
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {foodData.map((food) => (
            <Card
              key={food.id}
              className="shadow-lg hover:shadow-2xl transition"
            >
              <CardHeader className="p-0">
                <img
                  src={food.image}
                  alt={food.title}
                  className="rounded-t-lg object-cover h-48 w-full"
                />
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-xl font-bold text-red-500">
                  {food.title}
                </CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedFoods;
