"use client";

import { useState } from "react";
import SetupForm from "@/components/forms/setup-form";
import SetupComplete from "@/components/forms/setup-complete";

// Zod Schema

const Setup = () => {
  const [isSetupCompleted, setIsSetupCompleted] = useState(false);

  return (
    <>
      {isSetupCompleted ? (
        <SetupComplete />
      ) : (
        <SetupForm setIsSetupCompleted={setIsSetupCompleted} />
      )}
    </>
  );
};

export default Setup;
