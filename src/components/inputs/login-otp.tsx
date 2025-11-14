"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useMutation } from "@apollo/client/react";
import { LOGIN } from "@/graphQl/auth";
import { LoginDataInput, LoginResponse } from "@/types/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import Spinner from "../loaders/spinner";

// Zod schema for OTP validation
const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "Verification code is required")
    .regex(/^\d{6}$/, "Verification code must be exactly 6 digits"),
});

type OTPFormData = z.infer<typeof otpSchema>;

interface LoginOTPProps {
  loginData: {
    email?: string;
    phoneNumber?: { code: string; number: string };
    password: string;
    code: string;
  };
  signupMode: "email" | "number";
}

export default function LoginOTP({ loginData, signupMode }: LoginOTPProps) {
  const [countdown, setCountdown] = useState(299);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  // Apollo mutation
  const [login, { loading: loggingIn }] = useMutation<
    { login: LoginResponse },
    { input: LoginDataInput }
  >(LOGIN, {
    onCompleted: (data) => {
      // Store tokens in cookies
      setCookie("accessToken", data.login.accessToken, {
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      });
      setCookie("refreshToken", data.login.refreshToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      });

      toast.success("Login successful!");

      // Redirect based on account setup status
      if (data.login.existingUser) {
        router.push("/"); // Existing user, go to home
      } else {
        router.push("/auth/setup"); // New user, complete setup
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to login. Please try again.");
    },
  });

  // Function to call when countdown reaches 0
  const handleCountdownComplete = () => {
    toast.info("OTP expired. Please request a new code.");
  };

  const onSubmit = async (data: OTPFormData) => {
    try {
      await login({
        variables: {
          input: {
            email: loginData.email || undefined,
            phoneNumber: loginData.phoneNumber || undefined,
            password: loginData.password,
            code: Number(data.otp),
          },
        },
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Countdown reached 0
          handleCountdownComplete();
          return 299; // Restart countdown
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full  space-y-6  p-4"
      >
        <CardHeader className="flex-col text-center pb-0 justify-center border-0">
          <CardTitle className="mx-auto w-fit ">
            <p>Check your {signupMode === "email" ? "email" : "WhatsApp"}</p>
          </CardTitle>
          <CardDescription className="w-full ">
            {"We've"} sent a 6-digit code to
            <span className="font-medium px-0.5">
              {signupMode === "email"
                ? loginData.email
                : `+${loginData.phoneNumber?.code} ${loginData.phoneNumber?.number}`}
            </span>{" "}
            Enter it below to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col w-full gap-2">
          <Label htmlFor="otp">Verification code</Label>
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                pattern="^[0-9]*$"
                value={field.value}
                onChange={field.onChange}
                className="w-full"
              >
                <InputOTPGroup className="w-full gap-2">
                  <InputOTPSlot index={0} className="flex-1" />
                  <InputOTPSlot index={1} className="flex-1" />
                  <InputOTPSlot index={2} className="flex-1" />
                  <InputOTPSlot index={3} className="flex-1" />
                  <InputOTPSlot index={4} className="flex-1" />
                  <InputOTPSlot index={5} className="flex-1" />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.otp && (
            <p className="text-sm text-destructive">{errors.otp.message}</p>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div className="flex items-center justify-between w-full">
            <Label htmlFor="otp" className="text-foreground-300">
              {"Didn't"} get the code?
            </Label>
            {countdown > 0 ? (
              <span className="text-sm text-foreground">
                Resend in {formatTime(countdown)}
              </span>
            ) : (
              <Button
                type="button"
                variant="link"
                className="text-primary p-0 h-auto"
                onClick={() => {
                  toast.info("Please go back and re-enter your credentials");
                }}
              >
                Go back
              </Button>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            size={"lg"}
            disabled={!isDirty || !isValid || loggingIn}
          >
            {loggingIn ? (
              <>
                Signing in <Spinner />
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
