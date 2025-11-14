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
import { CircleCheckIcon, Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { RESET_PASSWORD } from "@/graphQl/auth";
import { ResetPasswordInput, LoginResponse } from "@/types/auth";
import { Toggle } from "@/components/ui/toggle";

interface NewPasswordFormProps {
  userData: {
    email?: string;
    phoneNumber?: { code: string; number: string };
  };
  verifiedOtp: string;
}
const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function NewPasswordForm({
  userData,
  verifiedOtp,
}: NewPasswordFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password field to validate in real-time
  const password = form.watch("password") || "";
  const confirmPassword = form.watch("confirmPassword") || "";

  // Validation checks for password requirements
  const validationChecks = {
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
    hasMinLength: password.length >= 8,
  };

  const validationFields = [
    { label: "Uppercase", isValid: validationChecks.hasUppercase },
    { label: "Lowercase", isValid: validationChecks.hasLowercase },
    { label: "Number", isValid: validationChecks.hasNumber },
    { label: "Special Character", isValid: validationChecks.hasSpecialChar },
    { label: "Minimum 8 Characters", isValid: validationChecks.hasMinLength },
  ];

  const isFormValid =
    !!password &&
    !!confirmPassword &&
    password === confirmPassword &&
    !form.formState.errors.password &&
    !form.formState.errors.confirmPassword &&
    Object.values(validationChecks).every((check) => check);

  const [resetPassword, { loading: resetting }] = useMutation<
    { resetUserPassword: LoginResponse },
    { input: ResetPasswordInput }
  >(RESET_PASSWORD, {
    onCompleted: () => {
      toast.success("Password reset successful! Redirecting to login...");
      router.push("/auth/login");
    },
    onError: (error) => {
      console.error("Password reset failed:", error);
      toast.error(
        error.message || "Failed to reset password. Redirecting to login..."
      );
      // Redirect to login even on error (temporary for debugging)
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Validate that we have required data
    if (!verifiedOtp) {
      toast.error("Verification code is missing. Please try again.");
      return;
    }

    if (!userData.email && !userData.phoneNumber) {
      toast.error("User data is missing. Please restart the process.");
      return;
    }

    const resetInput: ResetPasswordInput = {
      email: userData.email || undefined,
      phoneNumber: userData.phoneNumber || undefined,
      password: data.password,
      verificationCode: Number(verifiedOtp),
    };

    console.log("Reset password input:", {
      ...resetInput,
      password: "***hidden***",
    });

    try {
      await resetPassword({
        variables: {
          input: resetInput,
        },
      });
    } catch (error) {
      console.error("Reset password error:", error);
    }
  }

  return (
    <Card className="w-full gap-4">
      <CardHeader className="flex flex-col gap-2 sm:gap-4 justify-center text-center py-6 border-b-0">
        <CardTitle className="font-bold mx-auto w-fit text-2xl">
          Update Password
        </CardTitle>
        <CardDescription className="font-semibold text-foreground-200 sm:max-w-3/4 text-center">
          Minimum 8 characters with letters, numbers, and symbols.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-new-password" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="!relative">
                  <FieldLabel htmlFor="form-new-password-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-new-password-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <Button
                    variant="icon"
                    type="button"
                    size={"icon"}
                    className="bg-transparent px-0 translate-y-3/4 absolute !w-fit top-1 right-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </Button>
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="!relative">
                  <FieldLabel htmlFor="form-new-password-confirm">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-new-password-confirm"
                    aria-invalid={fieldState.invalid}
                    placeholder="Re-enter your new password"
                    autoComplete="new-password"
                    type={showConfirmPassword ? "text" : "password"}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <Button
                    variant="icon"
                    type="button"
                    size={"icon"}
                    className="bg-transparent px-0 translate-y-3/4 absolute !w-fit top-1 right-2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <Eye /> : <EyeClosed />}
                  </Button>
                </Field>
              )}
            />
          </FieldGroup>

          <div className="w-full sm:px-8 py-2 mx-auto flex flex-wrap gap-1 justify-center">
            {validationFields.map((field) => (
              <Toggle
                key={field.label}
                pressed={field.isValid}
                disabled
                aria-label={`${field.label} requirement ${
                  field.isValid ? "met" : "not met"
                }`}
                size="sm"
                className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-primary data-[state=on]:*:[svg]:stroke-foreground cursor-default"
              >
                <CircleCheckIcon className="transition-colors" />
                {field.label}
              </Toggle>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          form="form-new-password"
          size={"lg"}
          disabled={resetting || !isFormValid}
        >
          {resetting ? "Resetting password..." : "Reset password"}
        </Button>
      </CardFooter>
    </Card>
  );
}
