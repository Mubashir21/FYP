"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Menu, Shield, Users, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "@/components/responsive-container";

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  const navigationItems = [
    {
      title: "Home",
      href: "/home",
      description: "Return to our homepage"
    },
    {
      title: "Features",
      href: "#features",
      description: "Explore our key features and capabilities",
      hasDropdown: true,
      items: [
        {
          title: "Real-time Detection",
          href: "#detection",
          description: "AI-powered wildlife detection system",
          icon: <Shield className="h-4 w-4" />
        },
        {
          title: "Community Alerts",
          href: "#alerts", 
          description: "Instant notifications for safety",
          icon: <Bell className="h-4 w-4" />
        },
        {
          title: "Stakeholder Management",
          href: "#stakeholders",
          description: "Manage community stakeholders",
          icon: <Users className="h-4 w-4" />
        }
      ]
    },
    {
      title: "About",
      href: "/about",
      description: "Learn about our mission and team"
    },
    {
      title: "Projects",
      href: "/projects", 
      description: "View our ongoing conservation projects"
    },
    {
      title: "Support",
      href: "/support",
      description: "Get help and contact us"
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-stone-200">
      <ResponsiveContainer maxWidth="7xl" className="px-6">
          <div className="relative flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Link href="/home" className="flex items-center space-x-2">
                <img 
                src="/favicon_io (2)/android-chrome-192x192.png" 
                alt="WildTechAlert Logo" 
                width={32} 
                height={32}
                className="h-8 w-8"
              />
              <span className="hidden font-bold sm:inline-block ">
                WildTechAlert
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Absolutely Centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.hasDropdown ? (
                      <>
                        <NavigationMenuTrigger className="text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors bg-transparent border-none shadow-none px-2 py-1">
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3  p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.items?.map((subItem) => (
                              <ListItem
                                key={subItem.title}
                                title={subItem.title}
                                href={subItem.href}
                                icon={subItem.icon}
                              >
                                {subItem.description}
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link href={item.href} className="text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors px-2 py-1">
                          {item.title}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-6">
              <Link href="/login" className="hidden md:inline-flex text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
            </nav>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden"
                  size="sm"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <img 
                      src="/logo.svg" 
                      alt="WildTechAlert Logo" 
                      width={24} 
                      height={24}
                      className="h-6 w-6"
                    />
                    <span className="font-bold text-gray-900">WildTechAlert</span>
                  </div>
                  
                  <nav className="flex flex-col space-y-2">
                    {navigationItems.map((item) => (
                      <div key={item.title}>
                        <Link
                          href={item.href}
                          className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                          onClick={() => setIsOpen(false)}
                        >
                          <span>{item.title}</span>
                        </Link>
                        {item.hasDropdown && item.items && (
                          <div className="ml-4 mt-2 space-y-1">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.href}
                                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.icon}
                                <span>{subItem.title}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                  
                  <div className="border-t pt-4 space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800" asChild>
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </ResponsiveContainer>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center space-x-2">
            {icon}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
