import Link from "next/link";
import Image from "next/image";

const Logo = () => (
  <Link href="/" className="flex items-center space-x-2">
    <Image
      src="/logo.png"
      alt="Cihat Salik Logo"
      width={40}
      height={40}
      className="rounded-sm"
      priority
    />
    {/* <span className="text-md text-lg whitespace-nowrap font-bold">
      Cihat Salik
    </span> */}
  </Link>
);

export default Logo;
