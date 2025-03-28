import Logo from "../public/logo.svg";
import Image from "next/image";

export default function Header() {
  return (
    <header>
      <div className="flex justify-around items-center py-5">
        <Image src={Logo} alt="Logo" width={50} height={50} />
        <div className="flex gap-5">
          <div>Mission</div>
          <div>Locations</div>
          <div>Stakeholders</div>
          <div>About</div>
        </div>
      </div>
    </header>
  );
}
