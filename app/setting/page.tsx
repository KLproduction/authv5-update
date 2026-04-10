import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingForm from "@/components/auth/SettingForm";

const SettingPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-start justify-center px-4 py-10">
      <SettingForm user={user} />
    </div>
  );
};

export default SettingPage;
