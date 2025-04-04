import Logo from "../public/logo.svg";
import Image from "next/image";

const sections = [
  { name: "Home", link: "/home" },
  { name: "About Us", link: "/aboutus" },
  { name: "System Features", link: "/features" },
  { name: "Ongoing Projects", link: "/projects" },
  { name: "Support Us", link: "/supportus" },
  { name: "Blog", link: "/Blog" },
];

export default function Header() {
  return (
    <header>
      <div className="flex justify-between items-center py-5 mx-80">
        <Image src={Logo} alt="Logo" width={50} height={50} />
        <div className="flex gap-5">
          {sections.map(({ name, link }) => (
            <a key={name} href={link} className="hover:underline">
              {name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
