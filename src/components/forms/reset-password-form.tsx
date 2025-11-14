"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CountryCodeSelector } from "../inputs/country-code-selector";
import { useMutation } from "@apollo/client/react";
import { SendOtpInput } from "@/types/auth";
import { SEND_FORGOT_PASSWORD_OTP } from "@/graphQl/auth";

interface ResetPasswordFormProps {
  isOtpReceived: boolean;
  setReceivedOTP: (value: boolean) => void;
  userData: {
    email?: string;
    phoneNumber?: { code: string; number: string };
  };
  setUserData: (data: {
    email?: string;
    phoneNumber?: { code: string; number: string };
  }) => void;
}
// Create separate schemas for email and phone validation
const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "Email must be at most 254 characters"),
  number: z.string().optional(),
});

const phoneSchema = z.object({
  email: z.string().optional(),
  number: z
    .string()
    .min(1, "Phone number is required")
    .min(1, "Number must be between 1 and 15 characters")
    .max(15, "Number must be between 1 and 15 characters")
    .regex(/^\d+$/, "Number must contain only digits"),
});

// Base schema with all optional fields
const formSchema = z.object({
  email: z.string().optional(),
  number: z.string().optional(),
});

export default function ResetPasswordForm({
  setReceivedOTP,
  setUserData,
}: ResetPasswordFormProps) {
  const router = useRouter();
  const [resetMode, setResetMode] = useState<"email" | "number">("email");
  const [countryCode, setCountryCode] = useState("+234");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      number: "",
    },
  });

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    // Only allow digits
    const value = e.target.value.replace(/\D/g, "");
    onChange(value);
  };

  const sendResetOTP = async () => {
    try {
      if (resetMode === "email") {
        // Send OTP to email
        await sendForgotPasswordOTP({
          variables: {
            input: {
              email: email,
            },
          },
        });

        // Save user data for later use
        setUserData({ email: email });

        // Move to OTP step
        toast.success("OTP sent to your email!");
        setReceivedOTP(true);
      } else {
        // Send OTP to phone number
        await sendForgotPasswordOTP({
          variables: {
            input: {
              phoneNumber: {
                code: countryCode,
                number: number as string,
              },
            },
          },
        });

        // Save user data for later use
        setUserData({
          phoneNumber: {
            code: countryCode,
            number: number as string,
          },
        });

        // Move to OTP step
        toast.success("OTP sent to your WhatsApp!");
        setReceivedOTP(true);
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
      console.error("Send OTP error:", error);
    }
  };

  // Check if the form is valid based on the current reset mode
  const email = form.watch("email");
  const number = form.watch("number");

  const isFormValid =
    resetMode === "email"
      ? !!email && !form.formState.errors.email
      : !!number && !form.formState.errors.number;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Manual validation based on reset mode
    if (resetMode === "email") {
      const result = emailSchema.safeParse(data);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        if (errors.email && errors.email[0]) {
          form.setError("email", { message: errors.email[0] });
        }
        return;
      }
    } else {
      const result = phoneSchema.safeParse(data);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        if (errors.number && errors.number[0]) {
          form.setError("number", { message: errors.number[0] });
        }
        return;
      }
    }

    // Validation passed, send OTP
    await sendResetOTP();
  }

  const [sendForgotPasswordOTP, { loading: sendingOTP }] = useMutation<
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
    onError: (error) => {
      toast.error(error.message || "Failed to send OTP. Please try again.");
    },
  });

  return (
    <Card className="w-full gap-4">
      <CardHeader className="flex flex-col gap-2 sm:gap-4 justify-center text-center py-6 border-b-0">
        <CardTitle className="font-bold mx-auto w-fit text-2xl">
          Reset your password
        </CardTitle>
        <CardDescription className="font-semibold text-foreground-200 sm:max-w-3/4 text-center">
          Enter your email or WhatsApp number. If it’s linked to an account,
          we’ll send you a code to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-reset-password" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {resetMode === "email" ? (
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-reset-password-email">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-reset-password-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email address"
                      autoComplete="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ) : (
              <Controller
                name="number"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-reset-password-number">
                      WhatsApp Number
                    </FieldLabel>
                    <div className="w-full flex items-center gap-1">
                      <CountryCodeSelector
                        code={countryCode}
                        setCode={setCountryCode}
                      />
                      <Input
                        {...field}
                        id="form-reset-password-number"
                        type="tel"
                        inputMode="numeric"
                        maxLength={15}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your WhatsApp number"
                        autoComplete="tel"
                        onChange={(e) => handleNumberInput(e, field.onChange)}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex flex-col gap-4">
          <Button
            type="button"
            variant="link"
            className="text-foreground underline underline-offset-2"
            onClick={() => {
              setResetMode(resetMode === "email" ? "number" : "email");
              form.reset();
              form.clearErrors();
            }}
          >
            {resetMode === "email"
              ? "Use WhatsApp number instead"
              : "Use email instead"}
          </Button>
          <Button
            type="submit"
            className="w-full"
            form="form-reset-password"
            size={"lg"}
            disabled={sendingOTP || !isFormValid}
          >
            {sendingOTP ? "Sending code..." : "Send verification code"}
          </Button>

          <Button
            type="button"
            className="text-foreground/70 gap-1"
            variant="link"
            onClick={() => router.push("/auth/login")}
          >
            Remember your password?
            <span className="underline underline-offset-2 text-foreground">
              Sign in
            </span>
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
