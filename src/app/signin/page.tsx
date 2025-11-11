"use client";

import { useState } from "react";
import SignInForm from "@/components/forms/signin-form";
import OTP from "@/components/inputs/otp";

export default function SignInPage() {
  const [getOTP, setGetOTP] = useState(false);
  return (
    <div className="w-full h-svh">
      <div className="flex flex-col items-center justify-center size-full">
        {getOTP ? <OTP /> : <SignInForm setGetOTP={setGetOTP} />}
      </div>
    </div>
  );
}
