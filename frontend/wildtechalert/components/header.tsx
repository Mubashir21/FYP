// import {
//   Menubar,
//   MenubarContent,
//   MenubarItem,
//   MenubarMenu,
//   MenubarSeparator,
//   MenubarShortcut,
//   MenubarTrigger,
// } from "@/components/ui/menubar";

export default function Header() {
  return (
    <header>
      <div className="flex justify-around items-center py-5">
        <p>WildTechAlert</p>
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
