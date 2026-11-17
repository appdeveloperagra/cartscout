import AdminCrud from "@/components/admin/admin-crud";
import { adminModules } from "@/lib/admin-modules";

export default function AdminModulePage({ moduleKey }: { moduleKey: string }) {
  const adminModule = adminModules[moduleKey];
  if (!adminModule) throw new Error(`Unknown admin module: ${moduleKey}`);

  return <AdminCrud key={adminModule.key} module={adminModule} />;
}
