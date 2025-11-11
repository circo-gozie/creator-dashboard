"use client";

import { useState } from "react";
import EmailSignupForm from "@/components/forms/email-signup-form";
import OTP from "@/components/inputs/otp";

export default function SignUpForm() {
  const [getOTP, setGetOTP] = useState(false);
  return (
    <div className="w-full h-svh">
      <div className="flex flex-col items-center justify-center size-full">
        {getOTP ? <OTP /> : <EmailSignupForm setGetOTP={setGetOTP} />}
      </div>
    </div>
  );
}
