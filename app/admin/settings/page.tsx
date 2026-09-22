import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminSettingsForm from "./AdminSettingsForm";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <AdminSettingsForm
      initialName={session?.user?.name ?? ""}
      initialEmail={session?.user?.email ?? ""}
    />
  );
}
