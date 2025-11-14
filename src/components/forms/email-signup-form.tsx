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
import {
  CheckCircle2Icon,
  ChevronLeft,
  CircleCheckIcon,
  Eye,
  EyeClosed,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { CountryCodeSelector } from "../inputs/country-code-selector";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import {
  SendAccountVerificationOTPResponse,
  SendOtpInput,
  CreateUserInput,
  CreateUserResponse,
} from "@/types/auth";
import { deviceToken, getDeviceId, getDeviceName } from "@/lib/device-utils";
import {
  CHECK_EMAIL_AVAILABILITY,
  CHECK_PHONE_NUMBER_AVAILABILITY,
  SEND_ACCOUNT_VERIFICATION_OTP,
  CREATE_USER,
} from "@/graphQl/auth";
import { Alert, AlertDescription } from "../ui/alert";
import Link from "next/link";
interface EmailSignupFormProps {
  step: "email" | "password" | "otp";
  setStep: (step: "email" | "password" | "otp") => void;
  userData: {
    email?: string;
    phoneNumber?: { code: string; number: string };
  };
  setUserData: (data: {
    email?: string;
    phoneNumber?: { code: string; number: string };
  }) => void;
  verifiedOtp: string;
}
// Create separate schemas for email and phone validation
const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "Email must be at most 254 characters"),
  password: z.string().optional(),
  number: z.string().optional(),
});

const phoneSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
  number: z
    .string()
    .min(1, "Phone number is required")
    .min(1, "Number must be between 1 and 15 characters")
    .max(15, "Number must be between 1 and 15 characters")
    .regex(/^\d+$/, "Number must contain only digits"),
});

const passwordSchema = z.object({
  email: z.string().optional(),
  number: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)"
    ),
});

// Base schema with all optional fields
const formSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
  number: z.string().optional(),
});

export default function SignUpForm({
  step,
  setStep,
  userData,
  setUserData,
  verifiedOtp,
}: EmailSignupFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [signupMode, setSignupMode] = useState<"email" | "number">("email");
  const [countryCode, setCountryCode] = useState("+234");
  const [isAccountExists, setIsAccountExists] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
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

  const validate = async () => {
    try {
      if (signupMode === "email") {
        // Check email availability
        const { data } = await checkEmail({
          variables: {
            email: email,
          },
        });

        if (data?.checkEmailAvailability) {
          // Email is available, send OTP
          setIsAccountExists(false); // Reset the state
          await sendOTP({
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
          setStep("otp");
        } else {
          // Email already taken - only show card alert
          setIsAccountExists(true);
        }
      } else {
        // Check phone number availability
        const { data } = await checkPhoneNumber({
          variables: {
            input: {
              code: countryCode,
              number: number,
            },
          },
        });

        if (data?.checkPhoneNumberAvailability) {
          // Phone number is available, send OTP
          setIsAccountExists(false); // Reset the state
          await sendOTP({
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
          setStep("otp");
        } else {
          // Phone number already taken - only show card alert
          setIsAccountExists(true);
        }
      }
    } catch (error) {
      toast.error("Failed to verify. Please try again.");
      console.error("Validation error:", error);
    }
  };

  // Watch password field to validate in real-time
  const password = form.watch("password") || "";

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

  // Check if the form is valid based on the current signup mode and step
  const email = form.watch("email");
  const number = form.watch("number");

  const isFormValid =
    step === "email"
      ? signupMode === "email"
        ? !!email && !form.formState.errors.email
        : !!number && !form.formState.errors.number
      : step === "password"
      ? !!password &&
        !form.formState.errors.password &&
        Object.values(validationChecks).every((check) => check)
      : false;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Manual validation based on signup mode and step
    if (step === "email") {
      // Validate email or phone number
      if (signupMode === "email") {
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

      // Validation passed, proceed to check availability and send OTP
      await validate();
    } else if (step === "password") {
      // Validate password
      const result = passwordSchema.safeParse(data);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        if (errors.password && errors.password[0]) {
          form.setError("password", { message: errors.password[0] });
        }
        return;
      }

      // Password validation passed, create user account
      if (!data.password) {
        toast.error("Password is required");
        return;
      }

      // Log the data being sent
      const userInput: CreateUserInput = {
        email: userData.email || undefined,
        phoneNumber: userData.phoneNumber || undefined,
        password: data.password,
        accountType: "User",
        otp: Number(verifiedOtp),
        signupPlatform: "Web",
        deviceDetails: {
          deviceId: getDeviceId(),
          deviceType: "Android", // Backend only accepts IOS or Android
          deviceName: getDeviceName(),
          deviceToken: deviceToken(),
          appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "2.0.0",
        },
      };

      try {
        await createUser({
          variables: {
            input: userInput,
          },
        });
      } catch (error) {
        console.error("Error creating account:", error);
      }
    }
  }

  const [checkEmail, { loading: checkingEmail }] = useLazyQuery<{
    checkEmailAvailability: boolean;
  }>(CHECK_EMAIL_AVAILABILITY);

  const [checkPhoneNumber, { loading: checkingNumber }] = useLazyQuery<{
    checkPhoneNumberAvailability: boolean;
  }>(CHECK_PHONE_NUMBER_AVAILABILITY);

  const [sendOTP, { loading: sendingOTP }] = useMutation<
    SendAccountVerificationOTPResponse,
    { input: SendOtpInput }
  >(SEND_ACCOUNT_VERIFICATION_OTP);

  const [createUser, { loading: creatingUser }] = useMutation<
    { createUser: CreateUserResponse },
    { input: CreateUserInput }
  >(CREATE_USER, {
    onCompleted: () => {
      toast.success("Account created successfully!");
      router.push("/auth/setup");
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to create account. Please try again."
      );
    },
  });

  return (
    <Card className="w-full  gap-4">
      <CardHeader>
        <Button
          onClick={() => router.back()}
          variant={"ghost"}
          size={"icon"}
          className="bg-background dark:bg-accent size-7"
        >
          <ChevronLeft />
        </Button>
        <CardTitle className="font-bold text-2xl">
          Create your account{" "}
        </CardTitle>
        <CardDescription className="sr-only font-semibold text-primary-200">
          Create an account to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {step === "email" &&
              (signupMode === "email" ? (
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-email">
                        Email
                      </FieldLabel>
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
              ))}

            {isAccountExists && step === "email" && (
              <Alert className="bg-[#FFECD5] *:text-[#C86F02]">
                <CheckCircle2Icon className="stroke-[#C86F02]" />

                <AlertDescription className="flex justify-start wrap-anywhere gap-1">
                  <p>
                    This{" "}
                    {signupMode === "email" ? "email address" : "phone number"}{" "}
                    is already linked to an existing account. To continue
                    <Link
                      className="ps-0.5 underline underline-offset-2"
                      href={"/auth/login"}
                    >
                      sign in.
                    </Link>
                  </p>
                </AlertDescription>
              </Alert>
            )}
            {step === "password" && (
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="!relative "
                  >
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
            )}
          </FieldGroup>
          {step === "password" && (
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
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className="flex flex-col gap-4">
          {step === "email" && (
            <Button
              type="button"
              variant="link"
              className="text-foreground underline underline-offset-2"
              onClick={() => {
                setSignupMode(signupMode === "email" ? "number" : "email");
                form.reset();
                form.clearErrors();
                setIsAccountExists(false); // Reset account exists state when switching
              }}
            >
              {signupMode === "email"
                ? "Use WhatsApp number instead"
                : "Use email instead"}
            </Button>
          )}
          <Button
            type="submit"
            className="w-full"
            form="form-rhf-demo"
            size={"lg"}
            disabled={
              checkingEmail ||
              checkingNumber ||
              sendingOTP ||
              creatingUser ||
              !isFormValid
            }
          >
            {checkingEmail || checkingNumber
              ? "Checking availability..."
              : sendingOTP
              ? "Sending OTP..."
              : creatingUser
              ? "Creating account..."
              : step === "password"
              ? "Create Account"
              : "Continue"}
          </Button>

          {step === "email" && (
            <Button
              type="button"
              className="text-foreground/70 gap-1"
              form="form-rhf-demo"
              variant="link"
              onClick={() => router.push("/auth/login")}
            >
              Already have an account?
              <span className="underline underline-offset-2 text-foreground">
                Sign in
              </span>
            </Button>
          )}
        </Field>
      </CardFooter>
    </Card>
  );
}
