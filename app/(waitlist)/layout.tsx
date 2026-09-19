import Navbar from '@/component/Navbar';

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
