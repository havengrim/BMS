import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import images from "@/assets/images";

import { useRegister } from "@/stores/useAccount";
import  Spinner  from "@/components/ui/spinner";  // <-- import Spinner

type RegisterFormData = {
  name:string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  contact_number: string;
  address: string;
  civil_status: string;
  birthdate: string;
};

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [form, setForm] = useState<RegisterFormData>({
    name:"",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    contact_number: "",
    address: "",
    civil_status: "",
    birthdate: "",
  });

  const registerMutation = useRegister();
  const { mutate: register, status } = registerMutation;
  const isLoading = status === "pending";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(form);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center flex flex-col justify-center items-center">
          <img src={images.logo} className="h-14 w-14" alt="Logo" />
          <CardTitle className="text-xl">Create Your Account</CardTitle>
          <CardDescription>
            Register to access the Barangay Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {/* Username */}
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="JuanDelaCruz"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Full Name:</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Juan Dela Cruz"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>


              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@domain.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Contact Number */}
              <div className="grid gap-2">
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                  id="contact_number"
                  name="contact_number"
                  type="tel"
                  placeholder="09XXXXXXXXX"
                  value={form.contact_number}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Address */}
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Street, Barangay, Municipality"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Civil Status */}
              <div className="grid gap-2 w-full">
                <Label htmlFor="civil_status">Civil Status</Label>
                <Select
                  name="civil_status"
                  value={form.civil_status}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, civil_status: value }))
                  }
                  required
                >
                  <SelectTrigger id="civil_status" className="w-full">
                    <SelectValue placeholder="Select your civil status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="separated">Separated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Birthdate */}
              <div className="grid gap-2 w-full">
                <Label htmlFor="birthdate">Birthdate</Label>
                <Input
                  id="birthdate"
                  name="birthdate"
                  className="w-full block"
                  type="date"
                  value={form.birthdate}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Spinner /> : "Register"}
              </Button>
            </div>

            <div className="text-center text-sm mt-4">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By registering, you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
