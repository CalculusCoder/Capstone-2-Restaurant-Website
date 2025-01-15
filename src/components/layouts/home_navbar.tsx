import React, { useEffect, useState } from "react";
import Menu from "../ui_general/menu";
import Link from "next/link";
import CartIcon from "../ui_general/cart_icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { User2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Checkout from "@/features/cart/components/checkout";
import { useRouter } from "next/router";

const HomeNavbar = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const { data } = useQuery({
    queryKey: ["cart-details"],
    queryFn: async () => {
      const response = await axios.get(`/api/cart-details`, {
        headers: {
          // Authorization: `Bearer ${userFirebaseUid}`,
        },
        params: {
          userId,
        },
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    retry: 0,
    enabled: !!userId,
  });

  function clearAuthData() {
    localStorage.removeItem("userId");
  }

  return (
    <div className="h-12 p-4 flex items-center justify-between border-b-2 border-b-red-200 md:h-24 lg:px-20 xl:px-40">
      <div className="hidden md:flex gap-4 flex-1">
        <Link href="/">Home</Link>
        <Link href="/menu">Menu</Link>
      </div>

      <div className="text-xl md:font-bold flex-1 md:text-center">
        <Link href="/">
          <span className="font-serif text-3xl">Miami</span>{" "}
          <span className="text-red-300 text-3xl">Delights</span>
        </Link>
      </div>

      <div className="md:hidden">
        <Menu />
      </div>

      <div className="hidden md:flex gap-4 items-center justify-end flex-1">
        <div className="flex items-center ml-auto gap-6">
          <Button
            className="relative rounded-full"
            variant="outline"
            size="icon"
            onClick={() => setIsDialogOpen(true)}
          >
            <CartIcon />
            {data?.totalQuantity > 0 && (
              <div className="absolute bottom-6 left-4 translate-x-1 text-xs bg-red-500 text-white rounded-full p-1 px-2">
                {data?.totalQuantity}
              </div>
            )}
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="mb-6">Checkout</DialogTitle>
              </DialogHeader>
              <Checkout
                cartData={data?.cartData}
                totalAmount={data?.totalAmount}
              />
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full" variant="outline" size="icon">
                <User2 />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>

              <DropdownMenuSeparator />

              {!userId && (
                <div>
                  <DropdownMenuItem asChild>
                    <Link href={"/login"}>Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={"/register"}>Register</Link>
                  </DropdownMenuItem>
                </div>
              )}

              {userId && (
                <div>
                  {userId === "2" ? (
                    <div>
                      <DropdownMenuItem asChild>
                        <Link href={"/admin-orders"}>Admin Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={"/admin"}>Add Menu Items</Link>
                      </DropdownMenuItem>
                    </div>
                  ) : (
                    <div>
                      <DropdownMenuItem asChild>
                        <Link href={"/track-orders"}>Track Orders</Link>
                      </DropdownMenuItem>
                    </div>
                  )}

                  <DropdownMenuItem asChild>
                    <button
                      className="w-full"
                      onClick={() => {
                        clearAuthData();
                        router.push("/login");
                      }}
                    >
                      Sign Out
                    </button>
                  </DropdownMenuItem>
                </div>
              )}

              {/* {userId === "10" && (
                <div>
                  <DropdownMenuItem asChild>
                    <Link href={"/admin-orders"}>Manage Orders</Link>
                  </DropdownMenuItem>
                </div>
              )} */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default HomeNavbar;
