import React, { useEffect, useState } from "react";
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
import { Eye, EyeOff } from "lucide-react";
import images from "@/assets/images";
import { useRegister } from "@/stores/useAccount";
import Spinner from "@/components/ui/spinner";
import { validatePhilippinePhone } from "@/stores/validatePhone";
import addresses from "@/data/addresses.json"
type RegisterFormData = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  contact_number: string;
  houseNum: string; // ✅ added
  address: string;
  civil_status: string;
  birthdate: string;
};

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    contact_number: "",
    houseNum: "", // ✅ added
    address: "",
    civil_status: "",
    birthdate: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useRegister();
  const { mutate: register, status } = registerMutation;
  const isLoading = status === "pending";

  const [phoneError, setPhoneError] = useState("");

   const [addressList, setAddressList] = useState<string[]>([]);

  useEffect(() => {
    setAddressList(addresses);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // remove non-digit characters
    setForm({ ...form, contact_number: value });

    if (value.length > 0 && !validatePhilippinePhone(value)) {
      setPhoneError("Invalid Phone Number");
    } else {
      setPhoneError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

              {/* Full Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
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
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirm_password}
                    onChange={handleChange}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full p-0 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Contact Number */}
              <div className="grid gap-2">
                <Label htmlFor="contact_number">Contact Number</Label>
                <div className="flex flex-col space-y-1">
                  <Input
                    id="contact_number"
                    type="tel"
                    inputMode="numeric"
                    maxLength={13}
                    value={form.contact_number}
                    onChange={handlePhoneChange}
                    placeholder="09XXXXXXXXX or 9XXXXXXXXX"
                    required
                  />
                  {phoneError && <span className="text-red-500 text-sm">{phoneError}</span>}
                </div>
              </div>

              {/* House Number ✅ */}
              <div className="grid gap-2">
                <Label htmlFor="houseNum">House Number</Label>
                <Input
                  id="houseNum"
                  name="houseNum"
                  type="number"
                  placeholder="e.g. 123"
                  value={form.houseNum}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Address */}
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Select
                    value={form.address}
                    onValueChange={(value) => setForm({ ...form, address: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select address" />
                    </SelectTrigger>
                    <SelectContent>
                      {addressList.map((addr, i) => (
                        <SelectItem key={i} value={addr}>
                          {addr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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