import grotesk from "@/assets/fonts/grotesk";
import CreateFormButton from "@/components/client/create-form-button";
import FormList from "@/components/client/form-list";

const Dashboard = () => {
  return (
    <div>
      <div className={"flex w-full items-center justify-between gap-4"}>
        <h1 className={`text-2xl ${grotesk.className} font-bold`}>Forms</h1>
        <CreateFormButton />
      </div>

      <FormList />
    </div>
  );
};

export default Dashboard;
