import Link from "next/link";
import Image from "next/image";

const Logo = () => (
  <Link href="/" className="flex items-center space-x-2" title="Cihat Salik - Home Page">
    <Image
      src="/logo.svg"
      alt="Cihat Salik Logo"
      title="Cihat Salik - Software Developer Logo"
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
