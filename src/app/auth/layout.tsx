export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-transparent">
      <video
        className="fixed top-0 left-0 w-full h-full z-0 object-cover"
        src="https://assets.circleandclique.com/artifacts/videos/onboarding.webm"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
