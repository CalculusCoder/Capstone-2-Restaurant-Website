import React from "react";
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
import { useRouter } from "next/router";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const router = useRouter();
  const { toast } = useToast();

  const { control, register, handleSubmit } = useForm<FormData>({});

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`/api/auth/login`, { ...data });
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("userId", data.userId);
      toast({
        title: "Success",
        description: "Succesfully logged in. Redirecting....",
      });
      setTimeout(() => {
        router.push("/menu");
      }, 2000);
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

  const onSubmit = async (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center bg-fuchsia-50 px-4">
        <Card className="max-w-md w-full shadow-lg border border-red-500">
          <CardHeader>
            <CardTitle className="text-3xl text-black">Login</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your information below to get started!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-y-6"
            >
              <div>
                <Label className="text-gray-700">Email</Label>
                <Input
                  {...register("email")}
                  placeholder="Email"
                  className=" focus:ring-red-500"
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                />
              </div>

              <Button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Logging In..." : "Login"}
              </Button>
            </form>

            <div className="flex items-center justify-between mt-6 text-gray-700">
              <span>Dont have an account?</span>
              <Button
                variant="ghost"
                className="text-red-500 hover:underline px-0"
                onClick={() => router.push("/register")}
              >
                Register
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LoginForm;
