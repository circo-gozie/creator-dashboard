"use client";

import { useState } from "react";
import LoginForm from "@/components/forms/login-form";
import LoginOTP from "@/components/inputs/login-otp";

export default function LoginPage() {
  const [getOTP, setGetOTP] = useState(false);
  const [loginData, setLoginData] = useState<{
    email?: string;
    phoneNumber?: { code: string; number: string };
    password: string;
    code: string;
  }>({
    password: "",
    code: "",
  });

  return (
    <div className="w-full ">
      <div className="flex flex-col items-center justify-center translate-y-1/4 size-full p-4">
        {getOTP ? (
          <LoginOTP
            loginData={loginData}
            signupMode={loginData.email ? "email" : "number"}
          />
        ) : (
          <LoginForm setLoginData={setLoginData} setGetOTP={setGetOTP} />
        )}
      </div>
    </div>
  );
}
