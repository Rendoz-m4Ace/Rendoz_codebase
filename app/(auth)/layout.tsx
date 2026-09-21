// Auth route group layout — no shared navbar or footer.
// Each auth page renders its own minimal chrome.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
