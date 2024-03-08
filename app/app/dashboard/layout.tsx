import grotesk from "@/assets/fonts/grotesk";
import Navigator from "@/components/client/navigator";
import ThemeSwitch from "@/components/client/theme-switch";
import { UserButton } from "@clerk/nextjs";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <nav className={"hidden lg:flex w-full p-4 items-center justify-between gap-8 bg-default-50"}>
        <div className={"flex items-center gap-2"}>
          <Square3Stack3DIcon className={"w-12 h-12"} />
          <h1 className={`text-2xl ${grotesk.className} font-bold`}>AirForms</h1>
        </div>

        <Navigator />

        <div className={"flex items-center gap-2"}>
          <UserButton />
          <ThemeSwitch />
        </div>
      </nav>

      <main className={"p-8"}>{children}</main>
    </>
  );
};

export default DashboardLayout;
