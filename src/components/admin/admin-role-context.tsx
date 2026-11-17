"use client";

import { createContext, useContext } from "react";

export type AdminRole = "staff" | "admin" | "superadmin";

export const AdminRoleContext = createContext<AdminRole>("staff");

export function useAdminRole() {
  return useContext(AdminRoleContext);
}

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const role = useAdminRole();
  return role === "admin" || role === "superadmin" ? children : null;
}
