"use client";

import { createContext, useContext } from "react";

export type AdminRole = "staff" | "superadmin";

export const AdminRoleContext = createContext<AdminRole>("staff");

export function useAdminRole() {
  return useContext(AdminRoleContext);
}

export function SuperadminOnly({ children }: { children: React.ReactNode }) {
  const role = useAdminRole();
  return role === "superadmin" ? children : null;
}
