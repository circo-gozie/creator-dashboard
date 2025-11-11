"use client";

import { useState } from "react";
// import { EmailWhatsappSignUp } from "@/components/auth/EmailWhatsappSignUp";
import Link from "next/link";
import Image from "next/image";
import SignUpForm from "../signup/page";

export default function Register() {
  const [sso, setSso] = useState(true);
  return (
    <div className="flex justify-center py-10 md:py-20 px-4">
      {sso ? (
        <div className="w-full max-w-[620px] bg-secondary rounded-3xl px-5 sm:px-16 py-10">
          <div className="text-xl sm:text-3xl font-bold text-center leading-[130%] text-foreground">
            Sign up to get started
          </div>

          <div className="my-8 sm:my-10 space-y-4">
            <div className="border border-foreground/25 rounded-full py-4 sm:py-5.5 flex justify-center items-center gap-2.5 cursor-pointer">
              <Image
                src="/assets/icons/google.svg"
                alt="Google"
                width={16}
                height={16}
              />
              <span className="text-sm sm:text-base font-medium text-foreground tracking-[-3%]">
                Continue with Google
              </span>
            </div>

            <div className="border border-foreground/25 rounded-full py-4 sm:py-5.5 flex justify-center items-center gap-2.5 cursor-pointer">
              <Image
                src="/assets/icons/facebook.svg"
                alt="Facebook"
                width={16}
                height={16}
              />
              <span className="text-sm sm:text-base font-medium text-foreground tracking-[-3%]">
                Continue with Facebook
              </span>
            </div>

            <div className="border border-foreground/25 rounded-full py-4 sm:py-5.5 flex justify-center items-center gap-2.5 cursor-pointer">
              <Image
                src="/assets/icons/apple.svg"
                alt="Apple"
                width={16}
                height={16}
              />
              <span className="text-sm sm:text-base font-medium text-foreground tracking-[-3%]">
                Continue with Apple
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <div className="h-px bg-foreground/25 w-full"></div>
              <span className="text-sm text-foreground-2">OR</span>
              <div className="h-px bg-foreground/25 w-full"></div>
            </div>

            <div
              className="border border-foreground/25 rounded-full py-4 sm:py-5.5 flex justify-center items-center gap-2.5 cursor-pointer"
              onClick={() => setSso(false)}
            >
              <span className="text-sm sm:text-base font-medium text-foreground tracking-[-3%]">
                Sign Up with Email or WhatsApp
              </span>
            </div>
          </div>

          <div className="text-center">
            <span className="font-medium text-foreground-2">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-foreground underline block md:inline"
              >
                Sign In
              </Link>
            </span>
          </div>

          <div className="mt-7 text-xs font-medium text-foreground-2 text-center">
            By creating an account, you agree to Circo’s{" "}
            <Link href="/" className="text-primary">
              Terms of Service
            </Link>{" "}
            <br /> and confirm that you have read Circo’s{" "}
            <Link href="/" className="text-primary ">
              Privacy Policy
            </Link>
          </div>
        </div>
      ) : (
        <SignUpForm />
      )}
    </div>
  );
}
