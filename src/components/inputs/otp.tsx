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
import Spinner from "../loaders/spinner";

// Zod schema for OTP validation
const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "Verification code is required")
    .regex(/^\d{6}$/, "Verification code must be exactly 6 digits"),
});

type OTPFormData = z.infer<typeof otpSchema>;

export default function OTP() {
  const [countdown, setCountdown] = useState(299);
  const [email] = useState("theweeknd@gmail.com");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Function to call when countdown reaches 0
  const handleCountdownComplete = () => {
    // Add your logic here - e.g., auto-resend OTP, show notification, etc.
    console.log("Countdown complete! Performing action...");
    // You can call an API, show a toast, or perform any action here
  };

  const onSubmit = async (data: OTPFormData) => {
    try {
      setIsSubmitting(true);
      console.log("OTP submitted:", data.otp);
      // Handle OTP verification here
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsSubmitting(false);
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
        className="w-full sm:max-w-md space-y-6  p-4"
      >
        <CardHeader className="flex-col text-center pb-0 justify-center border-0">
          <CardTitle className="mx-auto w-fit ">
            <p>Check your email </p>
          </CardTitle>
          <CardDescription className="w-full ">
            {"We've"} sent a 6-digit code to
            <span className="font-medium px-0.5">{email}</span> Enter it below
            to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 items-center justify-center">
          <Label htmlFor="otp" className="me-auto">
            Verification code
          </Label>
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                pattern="^[0-9]*$"
                value={field.value}
                onChange={field.onChange}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />

                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.otp && (
            <p className="text-sm text-destructive me-auto">
              {errors.otp.message}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Label htmlFor="otp" className="me-auto text-foreground-300">
            {"Didn't"} get the Code?{" "}
            <span className="text-foreground">
              Resend in {formatTime(countdown)}
            </span>
          </Label>
          <Button
            type="submit"
            className="w-full"
            size={"lg"}
            disabled={!isDirty || !isValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                Verifying <Spinner />
              </>
            ) : (
              "Verify account"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
