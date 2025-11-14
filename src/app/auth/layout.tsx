"use client";

import { useState } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="relative min-h-screen bg-transparent">
      {/* Placeholder background while video loads */}
      {!videoLoaded && (
        <div className="fixed top-0 left-0 w-full h-full z-0 bg-gradient-to-br from-background via-accent to-background-3" />
      )}

      <video
        className={`fixed top-0 left-0 w-full h-full z-0 object-cover transition-opacity duration-700 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        src="https://assets.circleandclique.com/artifacts/videos/onboarding.webm"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setVideoLoaded(true)}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
