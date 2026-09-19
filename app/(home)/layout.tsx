// No shared navbar — each home page renders its own HomeNavbar
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
