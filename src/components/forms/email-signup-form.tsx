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
import { ChevronLeft, CircleCheckIcon, Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { CountryCodeSelector } from "../inputs/country-code-selector";

interface EmailSignupFormProps {
  setGetOTP: (getOTP: boolean) => void;
}
const formSchema = z.object({
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "Please enter a valid email address.",
    })
    .refine((val) => !val || val.length <= 254, {
      message: "Email must be at most 254 characters.",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must be at most 128 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)."
    ),
  number: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 15), {
      message: "Number must be between 1 and 15 characters.",
    })
    .refine((val) => !val || /^\d+$/.test(val), {
      message: "Number must contain only digits.",
    }),
});

export default function SignUpForm({ setGetOTP }: EmailSignupFormProps) {
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

  // Watch password field to validate in real-time
  const password = form.watch("password");

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

  // Check if the form is valid based on the current signup mode
  const email = form.watch("email");
  const number = form.watch("number");
  const isFormValid =
    (signupMode === "email"
      ? !!email && !form.formState.errors.email
      : !!number && !form.formState.errors.number) &&
    Object.values(validationChecks).every((check) => check);

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Validate that the correct field is filled based on signup mode
    if (signupMode === "email" && !data.email) {
      form.setError("email", { message: "Email is required." });
      return;
    }
    if (signupMode === "number" && !data.number) {
      form.setError("number", { message: "WhatsApp number is required." });
      return;
    }

    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
    setGetOTP(true);
  }

  return (
    <Card className="w-full sm:max-w-md gap-4">
      <CardHeader>
        <Button variant={"ghost"} size={"icon"} className="bg-accent size-7">
          <ChevronLeft />
        </Button>
        <CardTitle>Sign Up with Email or WhatsApp </CardTitle>
        <CardDescription className="sr-only">
          Create an account to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
        <Field orientation="horizontal" className="flex flex-col gap-4">
          <Button
            type="button"
            variant="link"
            className="text-foreground underline underline-offset-2"
            onClick={() => {
              setSignupMode(signupMode === "email" ? "number" : "email");
              form.reset();
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
            disabled={form.formState.isSubmitting || !isFormValid}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Next"}
          </Button>

          <Button
            type="button"
            className="text-foreground/70 gap-1"
            form="form-rhf-demo"
            variant="link"
            onClick={() => router.push("/signin")}
          >
            Already have an account?
            <span className="underline underline-offset-2 text-foreground">
              Sign in
            </span>
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
