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
import { ChevronLeft, Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CountryCodeSelector } from "../inputs/country-code-selector";
import { useMutation } from "@apollo/client/react";
import { VERIFY_CREDENTIALS } from "@/graphQl/auth";
import {
  VerifyCredentialsInput,
  VerifyCredentialsResponse,
} from "@/types/auth";

interface SignInFormProps {
  setLoginData: (data: {
    email?: string;
    phoneNumber?: { code: string; number: string };
    password: string;
    code: string;
  }) => void;
  setGetOTP: (getOTP: boolean) => void;
}
const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "Email must be at most 254 characters"),
  password: z.string().min(1, "Password is required"),
  number: z.string().optional(),
});

const phoneSchema = z.object({
  email: z.string().optional(),
  password: z.string().min(1, "Password is required"),
  number: z
    .string()
    .min(1, "Phone number is required")
    .max(15, "Number must be between 1 and 15 characters")
    .regex(/^\d+$/, "Number must contain only digits"),
});

const formSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
  number: z.string().optional(),
});

export default function SignInForm({
  setLoginData,
  setGetOTP,
}: SignInFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [signupMode, setSignupMode] = useState<"email" | "number">("email");
  const [countryCode, setCountryCode] = useState("+234");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur", // Validate when field loses focus
    defaultValues: {
      email: "",
      password: "",
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

  // Check if the form is valid based on the current login mode
  const email = form.watch("email");
  const number = form.watch("number");
  const password = form.watch("password");

  const isFormValid =
    !!password &&
    (signupMode === "email"
      ? !!email && !form.formState.errors.email
      : !!number && !form.formState.errors.number);

  const [verifyCredentials, { loading: verifying }] = useMutation<
    { verifyCredentials: VerifyCredentialsResponse },
    { input: VerifyCredentialsInput }
  >(VERIFY_CREDENTIALS, {
    onCompleted: (data) => {
      if (!data.verifyCredentials.error && data.verifyCredentials.data.code) {
        toast.success(
          "Credentials verified! Check your " +
            (signupMode === "email" ? "email" : "WhatsApp") +
            " for OTP."
        );

        // Store login data including the OTP code for the final login step
        setLoginData({
          email: signupMode === "email" ? email : undefined,
          phoneNumber:
            signupMode === "number"
              ? { code: countryCode, number: number as string }
              : undefined,
          password: password as string,
          code: data.verifyCredentials.data.code,
        });

        setGetOTP(true);
      } else {
        toast.error(data.verifyCredentials.message || "Invalid credentials");
      }
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to verify credentials. Please try again."
      );
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Validate based on login mode
    if (signupMode === "email") {
      const result = emailSchema.safeParse(data);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        if (errors.email && errors.email[0]) {
          form.setError("email", { message: errors.email[0] });
        }
        if (errors.password && errors.password[0]) {
          form.setError("password", { message: errors.password[0] });
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
        if (errors.password && errors.password[0]) {
          form.setError("password", { message: errors.password[0] });
        }
        return;
      }
    }

    // Verify credentials
    try {
      await verifyCredentials({
        variables: {
          input: {
            email: signupMode === "email" ? data.email : undefined,
            phoneNumber:
              signupMode === "number"
                ? { code: countryCode, number: data.number as string }
                : undefined,
            password: data.password as string,
          },
        },
      });
    } catch (error) {
      console.error("Verify credentials error:", error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="bg-background dark:bg-accent size-7"
          onClick={() => router.push("/auth/register")}
        >
          <ChevronLeft />
        </Button>
        <div className="w-grow inline-flex items-center w-full justify-between">
          <CardTitle>Welcome back </CardTitle>
          <CardDescription className="w-fit text-nowrap text-primary-200 ">
            Login as a User
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {signupMode === "email" ? (
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email address"
                      autoComplete="off"
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
                    <FieldLabel htmlFor="form-rhf-demo-number">
                      WhatsApp Number
                    </FieldLabel>
                    <div className="w-full flex items-center gap-1">
                      <CountryCodeSelector
                        code={countryCode}
                        setCode={setCountryCode}
                      />
                      <Input
                        {...field}
                        id="form-rhf-demo-number"
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
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="!relative ">
                  <FieldLabel htmlFor="form-rhf-demo-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
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
                    className="bg-transparent px-0 translate-y-3/4 absolute !w-fit top-1 right-2 "
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </Button>
                </Field>
              )}
            />
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
              setSignupMode(signupMode === "email" ? "number" : "email");
              form.reset();
              form.clearErrors();
            }}
          >
            {signupMode === "email"
              ? "Use WhatsApp number instead"
              : "Use email instead"}
          </Button>
          <Button
            type="submit"
            className="w-full"
            form="form-rhf-demo"
            size={"lg"}
            disabled={verifying || !isFormValid}
          >
            {verifying ? "Verifying..." : "Sign In"}
          </Button>

          <Button
            type="button"
            className="text-foreground/70 gap-1"
            form="form-rhf-demo"
            variant="link"
            onClick={() => router.push("/auth/signup")}
          >
            {`Don't have an account?`}
            <span className="underline underline-offset-2 text-foreground">
              Sign Up
            </span>
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
