"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Headphones, Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const { resetPassword } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const ok = await resetPassword(values.email);
      if (ok) {
        setIsSuccess(true);
        toast.success("Password reset instructions sent to your email.");
      } else {
        setErrorMessage("Could not locate account with that email address.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25">
          <Headphones className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Reset Password
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          We&apos;ll send a verification link to regain access to your account
        </p>
      </div>

      {isSuccess ? (
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center space-y-3">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
            Reset Link Delivered
          </h3>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            Check your inbox for step-by-step instructions to create a new password.
          </p>
          <Link href="/login" className="block pt-2">
            <Button size="sm" variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Registered Email Address"
              type="email"
              placeholder="agent@company.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <Button
              type="submit"
              className="w-full h-10 font-semibold shadow-md shadow-indigo-600/20"
              isLoading={isSubmitting}
            >
              Send Reset Instructions
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Sign In
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
