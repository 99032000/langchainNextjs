interface LayoutProps {
  children?: React.ReactNode;
}
import Image from 'next/legacy/image';
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex flex-col space-y-4 relative">
      <main className="flex w-full flex-col justify-center h-full min-h-screen">
        <Image src="/background.png" alt="" layout="fill" className=" -z-10" />
        {children}
      </main>
    </div>
  );
}
