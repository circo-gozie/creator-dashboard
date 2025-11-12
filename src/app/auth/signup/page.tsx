"use client";

import { useState } from "react";
import EmailSignupForm from "@/components/forms/email-signup-form";
import OTP from "@/components/inputs/otp";

export default function SignUpPage() {
  const [step, setStep] = useState<"email" | "password" | "otp">("email");
  const [userData, setUserData] = useState<{
    email?: string;
    phoneNumber?: { code: string; number: string };
  }>({});
  const [verifiedOtp, setVerifiedOtp] = useState<string>("");

  return (
    <div className="flex size-full h-full flex-col items-center justify-center translate-y-1/4 py-8">
      {step === "otp" ? (
        <OTP
          userData={userData}
          signupMode={userData.email ? "email" : "number"}
          setStep={setStep}
          setVerifiedOtp={setVerifiedOtp}
        />
      ) : (
        <EmailSignupForm
          step={step}
          setStep={setStep}
          userData={userData}
          setUserData={setUserData}
          verifiedOtp={verifiedOtp}
        />
      )}
    </div>
  );
}
