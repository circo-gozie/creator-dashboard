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
import {
  SEND_FORGOT_PASSWORD_OTP,
  VERIFY_FORGOT_PASSWORD_OTP,
} from "@/graphQl/auth";
import { SendOtpInput, VerifyOTPInput } from "@/types/auth";
import { toast } from "sonner";

// Zod schema for OTP validation
const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "Verification code is required")
    .regex(/^\d{6}$/, "Verification code must be exactly 6 digits"),
});

type OTPFormData = z.infer<typeof otpSchema>;

interface ResetPasswordOTPProps {
  userData: {
    email?: string;
    phoneNumber?: { code: string; number: string };
  };
  resetMode: "email" | "number";
  setVerifiedOtp: (otp: string) => void;
  setStep: (step: "input-email" | "otp" | "new-password") => void;
}

export default function ResetPasswordOTP({
  userData,
  resetMode,
  setVerifiedOtp,
  setStep,
}: ResetPasswordOTPProps) {
  const [countdown, setCountdown] = useState(299);

  // Toggle this if the API expects OTP to be used only once in RESET_PASSWORD
  // Set to false to skip VERIFY_FORGOT_PASSWORD_OTP and go directly to password step
  const VERIFY_OTP_BEFORE_PASSWORD = true;
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

  // Apollo mutations
  const [resendOTP, { loading: resendingOTP }] = useMutation<
    {
      sendForgotPasswordOtp: {
        error: string;
        data: string;
        message: string;
        statusCode: number;
      };
    },
    { input: SendOtpInput }
  >(SEND_FORGOT_PASSWORD_OTP, {
    onCompleted: () => {
      toast.success("OTP resent successfully!");
      setCountdown(299); // Reset countdown
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resend OTP.");
    },
  });

  // Option 1: Verify OTP before moving to password step (may consume the OTP)
  const [verifyOTP, { loading: verifyingOTP }] = useMutation<
    { verifyForgotPasswordOTP: boolean },
    { input: VerifyOTPInput }
  >(VERIFY_FORGOT_PASSWORD_OTP, {
    onCompleted: (data) => {
      if (data.verifyForgotPasswordOTP) {
        toast.success("OTP verified! Now create your new password.");
        setStep("new-password");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Invalid OTP. Please try again.");
    },
  });

  // Option 2: Skip verification and go directly to password step
  // This might be needed if the API expects the OTP to be used only once in RESET_PASSWORD
  const skipVerificationAndContinue = (otp: string) => {
    setVerifiedOtp(otp);
    console.log("Skipping OTP verification, stored OTP:", otp);
    toast.success("Now create your new password.");
    setStep("new-password");
  };

  const handleResendOTP = async () => {
    await resendOTP({
      variables: {
        input:
          resetMode === "email"
            ? { email: userData.email }
            : { phoneNumber: userData.phoneNumber! },
      },
    });
  };

  // Function to call when countdown reaches 0
  const handleCountdownComplete = () => {
    toast.info("OTP expired. Please request a new code.");
  };

  const onSubmit = async (data: OTPFormData) => {
    if (VERIFY_OTP_BEFORE_PASSWORD) {
      // Option 1: Verify the OTP first before proceeding to password step
      try {
        console.log("Verifying OTP:", {
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          code: Number(data.otp),
        });

        await verifyOTP({
          variables: {
            input: {
              email: userData.email || undefined,
              phoneNumber: userData.phoneNumber || undefined,
              code: Number(data.otp),
            },
          },
        });

        // Only store the OTP after successful verification
        setVerifiedOtp(data.otp);
        console.log("OTP verified successfully, stored:", data.otp);
      } catch (error) {
        console.error("OTP verification error:", error);
      }
    } else {
      // Option 2: Skip verification, just store OTP and continue
      // Use this if VERIFY_FORGOT_PASSWORD_OTP consumes the OTP
      skipVerificationAndContinue(data.otp);
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
        className="w-full space-y-6 mx-auto p-4"
      >
        <CardHeader className="flex-col text-center pb-0 justify-center border-0">
          <CardTitle className="mx-auto w-fit">
            <p>Check your {resetMode === "email" ? "email" : "WhatsApp"}</p>
          </CardTitle>
          <CardDescription className="w-full">
            {"We've"} sent a 6-digit code to
            <span className="font-medium px-0.5">
              {resetMode === "email"
                ? userData.email
                : `+${userData.phoneNumber?.code} ${userData.phoneNumber?.number}`}
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
                onClick={handleResendOTP}
                disabled={resendingOTP}
              >
                {resendingOTP ? "Resending..." : "Resend code"}
              </Button>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            size={"lg"}
            disabled={!isDirty || !isValid || verifyingOTP}
          >
            {verifyingOTP ? "Verifying..." : "Verify & Continue"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
