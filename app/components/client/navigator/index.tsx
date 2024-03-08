"use client";

import { BellIcon, Cog6ToothIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Tab, Tabs } from "@nextui-org/react";
import { usePathname } from "next/navigation";

const navigatorLinks = [
  { id: 1, icon: HomeIcon, label: "Home", href: "/dashboard" },
  { id: 2, icon: BellIcon, label: "Invitations", href: "/dashboard/invitations" },
  { id: 3, icon: Cog6ToothIcon, label: "Settings", href: "/dashboard/settings" },
];

const Navigator = () => {
  const pathname = usePathname();

  return (
    <Tabs color={"default"} variant={"underlined"} selectedKey={pathname} items={navigatorLinks} aria-label={"Navigation"}>
      {(navigatorLink) => (
        <Tab
          key={navigatorLink.href}
          href={navigatorLink.href}
          title={
            <div className={"flex items-center justify-center gap-2"}>
              <navigatorLink.icon className={"w-5 h-5"} />
              <span>{navigatorLink.label}</span>
            </div>
          }
        />
      )}
    </Tabs>
  );
};

export default Navigator;
