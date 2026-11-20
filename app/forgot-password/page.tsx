import React from "react";
import { ForgotPasswordForm } from "@/features/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/70">
      <ForgotPasswordForm />
    </div>
  );
}
