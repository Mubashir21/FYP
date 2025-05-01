import Logo from "../public/logo.svg";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import Link from "next/link";
import { Button } from "./ui/button";

const navItems = [
  { name: "Home", link: "/home" },
  { name: "About Us", link: "/aboutus" },
  { name: "System Features", link: "/features" },
  { name: "Ongoing Projects", link: "/projects" },
  { name: "Support Us", link: "/supportus" },
  { name: "Blog", link: "/Blog" },
];

export default function Header() {
  return (
    // <header className="bg-black text-white">
    <header>
      <div className="flex justify-between items-center mx-80">
        <Image src={Logo} alt="Logo" width={50} height={50} />
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.name}>
                <Link href={item.link} legacyBehavior passHref>
                  <NavigationMenuLink className="px-2 ">
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <Button variant="outline">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </header>
  );
}
