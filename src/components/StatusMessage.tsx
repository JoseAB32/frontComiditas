import type { ReactNode } from "react";

interface StatusMessageProps {
  type: "success" | "error" | "info";
  children: ReactNode;
}

export default function StatusMessage({ type, children }: StatusMessageProps) {
  return (
    <div className={`status-message ${type}`} role={type === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}
