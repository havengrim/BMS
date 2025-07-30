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
import images from "@/assets/images";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLogin } from "@/stores/useAccount";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending, isError } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    login(
      { email, password },
      {
        onSuccess: () => navigate("/dashboard"),
      }
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center flex flex-col justify-center items-center">
          <img src={images.logo} className="h-14 w-14" />
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your email and password to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Logging in..." : "Login"}
              </Button>
              {isError && (
                <p className="text-red-500 text-sm text-center">
                  Invalid credentials. Please try again.
                </p>
              )}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
