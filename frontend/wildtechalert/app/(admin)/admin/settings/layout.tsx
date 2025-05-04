import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const menuItems = [
  // { name: "Profile", link: "/admin/settings/profile" },
  { name: "Device Registration", link: "/admin/settings/registration" },
  { name: "Account Approvals", link: "/admin/settings/approvals" },
];

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* <h1 className="mb-4 text-xl md:text-2xl">Settings</h1> */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-2">
          {menuItems.map(({ name, link }) => (
            <Link
              key={name}
              href={link}
              className={buttonVariants({ variant: "ghost" })}
            >
              {name}
            </Link>
          ))}
        </div>
        <div className="flex-1">{children} </div>
      </div>
    </div>
  );
}
