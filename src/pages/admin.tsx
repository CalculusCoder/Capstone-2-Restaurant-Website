import React, { useState, useRef } from "react";
import HomeNavbar from "@/components/layouts/home_navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const AdminPage = () => {
  const [toppings, setToppings] = useState<{ name: string; price: number }[]>(
    []
  );
  const [newTopping, setNewTopping] = useState("");
  const [newToppingPrice, setNewToppingPrice] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [category, setCategory] = useState("");

  const { toast } = useToast();

  const handleAddTopping = () => {
    if (newTopping.trim()) {
      setToppings((prev) => [
        ...prev,
        { name: newTopping, price: newToppingPrice },
      ]);
      setNewTopping("");
      setNewToppingPrice(0);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(`/api/product`, data);
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Succesfully created product.",
      });

      if (formRef.current) {
        formRef.current.reset();
      }
      setToppings([]);
      setNewTopping("");
      setNewToppingPrice(0);
      setCategory("");
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const productData = {
      product_name: (form.elements.namedItem("productName") as HTMLInputElement)
        .value,
      product_price: parseFloat(
        (form.elements.namedItem("price") as HTMLInputElement).value
      ),
      image_url: (form.elements.namedItem("imageUrl") as HTMLInputElement)
        .value,
      product_category: category,
      toppings: toppings,
    };

    mutation.mutate(productData);
  };

  return (
    <>
      <HomeNavbar />
      <div className="flex h-screen w-full items-center justify-center bg-fuchsia-50 px-4">
        <Card className="max-w-md w-full shadow-lg border border-red-500">
          <CardHeader>
            <CardTitle className="text-3xl text-red-500">Add Product</CardTitle>
            <CardDescription className="text-gray-600">
              Enter the product information below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-y-6"
            >
              <div>
                <Label className="text-gray-700">Product Name</Label>
                <Input
                  name="productName"
                  placeholder="Product Name"
                  className=" focus:ring-red-500"
                />
              </div>

              <div>
                <Label className="text-gray-700">Price</Label>
                <Input
                  name="price"
                  placeholder="Price"
                  className=" focus:ring-red-500"
                />
              </div>

              <div>
                <Label>Product Category</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Product Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pizza">Pizza</SelectItem>
                    <SelectItem value="burger">Burger</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700">Image URL</Label>
                <Input
                  name="imageUrl"
                  placeholder="Image URL (eg. pizza.png)"
                  className=" focus:ring-red-500"
                />
              </div>

              <div>
                <Label className="text-gray-700 mb-2">Custom Toppings</Label>
                <div className="flex items-center gap-x-2 mb-4">
                  <Input
                    placeholder="Topping Name"
                    value={newTopping}
                    onChange={(e) => setNewTopping(e.target.value)}
                    className="border-gray-300 focus:ring-red-500"
                  />

                  <Label>Price</Label>
                  <Input
                    type="number"
                    placeholder="Price"
                    value={newToppingPrice}
                    onChange={(e) =>
                      setNewToppingPrice(parseFloat(e.target.value))
                    }
                    className="border-gray-300 focus:ring-red-500 w-24"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTopping}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {toppings.map((topping, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded-lg"
                    >
                      <span className="text-gray-700">{topping.name}</span>
                      <span className="text-gray-500">
                        ${topping.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminPage;
