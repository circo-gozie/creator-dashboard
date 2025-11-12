"use client";

import { useState } from "react";
// import { EmailWhatsappSignUp } from "@/components/auth/EmailWhatsappSignUp";
import Link from "next/link";
import Image from "next/image";
import SignUpForm from "../signup/page";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const authOptions = [
  {
    label: "Continue with Google",
    icon: "/google.svg",
    href: "/auth/google",
  },

  {
    label: "Continue with Apple",
    icon: "/apple.svg",
    href: "/auth/apple",
  },
];

export default function Register() {
  const [sso, setSso] = useState(true);
  return (
    <div className="flex justify-center py-10 md:py-20 px-4">
      {sso ? (
        <Card className="w-full max-w-[620px] ">
          <CardHeader className="border-b-0 pb-0">
            <CardTitle className="text-center justify-center pt-4 text-xl sm:text-4xl font-bold leading-[130%] text-foreground">
              Sign up to get started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 sm:space-y-6">
              {authOptions.map((option) => (
                <Button
                  key={option.label}
                  className="flex gap-2 items-center w-full !border-border"
                  variant="outline"
                  size="lg"
                >
                  <div className="size-6 relative">
                    <Image
                      src={option.icon}
                      alt={option.label}
                      fill
                      className={cn(
                        "object-contain",
                        option.icon.includes("apple")
                          ? "invert scale-130 dark:invert-0"
                          : ""
                      )}
                    />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-foreground tracking-[-3%]">
                    {option.label}
                  </span>
                </Button>
              ))}

              <div className="flex gap-2 items-center">
                <div className="h-px bg-border w-full"></div>
                <span className="text-sm text-foreground-2">OR</span>
                <div className="h-px bg-border w-full"></div>
              </div>

              <Button
                className="flex gap-2 items-center w-full !border-border"
                variant="outline"
                size="lg"
                onClick={() => setSso(false)}
              >
                <span className="text-sm sm:text-base font-medium text-foreground tracking-[-3%]">
                  Sign Up with Email or WhatsApp
                </span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex-col pb-4">
            <div className="text-center">
              <span className="font-medium text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-foreground underline block md:inline"
                >
                  Sign In
                </Link>
              </span>
            </div>

            <div className="mt-7 text-xs font-medium text-muted-foreground text-center">
              By creating an account, you agree to Circo’s{" "}
              <Link href="/" className="text-primary">
                Terms of Service
              </Link>{" "}
              <br /> and confirm that you have read Circo’s{" "}
              <Link href="/" className="text-primary ">
                Privacy Policy
              </Link>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <SignUpForm />
      )}
    </div>
  );
}
