"use client";

import { useState } from "react";
import ResetPasswordForm from "@/components/forms/reset-password-form";
import ResetPasswordOTP from "@/components/inputs/reset-password-otp";
import NewPasswordForm from "@/components/forms/new-password-form";

const ResetPasswordPage = () => {
  const [step, setStep] = useState<"input-email" | "otp" | "new-password">(
    "input-email"
  );
  const [userData, setUserData] = useState<{
    email?: string;
    phoneNumber?: { code: string; number: string };
  }>({});
  const [verifiedOtp, setVerifiedOtp] = useState("");

  console.log("Reset Password Page State:", {
    step,
    hasEmail: !!userData.email,
    hasPhone: !!userData.phoneNumber,
    hasOtp: !!verifiedOtp,
  });

  return (
    <div className="w-full h-screen flex justify-center items-center px-6">
      <div className="w-full sm:max-w-md">
        {step === "input-email" && (
          <ResetPasswordForm
            isOtpReceived={false}
            setReceivedOTP={(received) => {
              if (received) setStep("otp");
            }}
            userData={userData}
            setUserData={setUserData}
          />
        )}

        {step === "otp" && (
          <ResetPasswordOTP
            userData={userData}
            resetMode={userData.email ? "email" : "number"}
            setVerifiedOtp={setVerifiedOtp}
            setStep={setStep}
          />
        )}

        {step === "new-password" && (
          <NewPasswordForm userData={userData} verifiedOtp={verifiedOtp} />
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
