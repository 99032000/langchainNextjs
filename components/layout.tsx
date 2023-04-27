interface LayoutProps {
  children?: React.ReactNode;
}
import Image from 'next/legacy/image';
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex flex-col space-y-4">
      <main className="flex w-full flex-col overflow-hidden h-screen justify-center">
        <Image src="/background.jpg" alt="" layout="fill" className=" -z-10" />
        {children}
      </main>
    </div>
  );
}
