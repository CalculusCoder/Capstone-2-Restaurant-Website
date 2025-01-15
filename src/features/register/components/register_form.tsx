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
import axios from "axios";
import * as RegisterUtils from "../register_utils";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";

type FormData = z.infer<typeof RegisterUtils.registerFormSchema>;

const RegisterForm = () => {
  const router = useRouter();

  const { toast } = useToast();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(RegisterUtils.registerFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`/api/auth/register`, data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("userId", data.userId);
      toast({
        title: "Success",
        description: "Succesfully registered user. Redirecting....",
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

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center bg-fuchsia-50 px-4">
        <Card className="max-w-md w-full shadow-lg border border-red-500">
          <CardHeader>
            <CardTitle className="text-3xl text-red-500">Register</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your information below to get started!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-y-6"
            >
              {/* First Name */}
              <div>
                <Label className="text-gray-700">First Name</Label>
                <Input
                  {...register("first_name")}
                  placeholder="First Name"
                  className=" focus:ring-red-500"
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <Label className="text-gray-700">Last Name</Label>
                <Input
                  {...register("last_name")}
                  placeholder="Last Name"
                  className=" focus:ring-red-500"
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.last_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label className="text-gray-700">Email</Label>
                <Input
                  {...register("email")}
                  placeholder="Email"
                  type="email"
                  className=" focus:ring-red-500"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label className="text-gray-700">Password</Label>
                <Input
                  {...register("password")}
                  placeholder="Password"
                  type="password"
                  className=" focus:ring-red-500"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Submitting..." : "Register"}
              </Button>
            </form>

            <div className="flex items-center justify-between mt-6 text-gray-700">
              <span>Already have an account?</span>
              <Button
                variant="ghost"
                className="text-red-500 hover:underline px-0"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RegisterForm;
