"use client";

import React, { useState } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import {
  User,
  Building,
  Bell,
  Sparkles,
  Save,
  CheckCircle2,
  Globe,
  Shield,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { AIReplyTone, SupportedLanguage } from "@/services/aiService";

export function SettingsView() {
  const { settings, updateProfile, updateWorkspace, updateNotifications, updateAISettings } =
    useSettingsStore();
  const { user, updateCurrentUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"profile" | "workspace" | "notifications" | "ai">(
    "profile"
  );

  // Profile Form state
  const [profileName, setProfileName] = useState(user?.name || settings.profile.name);
  const [profileEmail, setProfileEmail] = useState(user?.email || settings.profile.email);
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || settings.profile.avatar);
  const [profileTitle, setProfileTitle] = useState(settings.profile.title);

  // Workspace Form state
  const [companyName, setCompanyName] = useState(settings.workspace.companyName);
  const [supportEmail, setSupportEmail] = useState(settings.workspace.supportEmail);
  const [timezone, setTimezone] = useState(settings.workspace.timezone);

  // Notification Form state
  const [emailNotifications, setEmailNotifications] = useState(
    settings.notifications.emailNotifications
  );
  const [newTicketNotifications, setNewTicketNotifications] = useState(
    settings.notifications.newTicketNotifications
  );
  const [newMessageNotifications, setNewMessageNotifications] = useState(
    settings.notifications.newMessageNotifications
  );

  // AI Form state
  const [aiEnabled, setAiEnabled] = useState(settings.ai.enabled);
  const [replyTone, setReplyTone] = useState<AIReplyTone>(
    settings.ai.replyTone as AIReplyTone
  );
  const [defaultLanguage, setDefaultLanguage] = useState<SupportedLanguage>(
    settings.ai.defaultLanguage as SupportedLanguage
  );
  const [autoSuggest, setAutoSuggest] = useState(settings.ai.autoSuggest);

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateProfile({
        name: profileName,
        email: profileEmail,
        avatar: profileAvatar,
        title: profileTitle,
      });
      updateCurrentUser({
        name: profileName,
        email: profileEmail,
        avatar: profileAvatar,
      });
      setIsSaving(false);
      toast.success("Profile preferences saved successfully!");
    }, 400);
  };

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateWorkspace({
        companyName,
        supportEmail,
        timezone,
      });
      setIsSaving(false);
      toast.success("Workspace configuration updated!");
    }, 400);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateNotifications({
        emailNotifications,
        newTicketNotifications,
        newMessageNotifications,
      });
      setIsSaving(false);
      toast.success("Notification preferences updated!");
    }, 400);
  };

  const handleSaveAI = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateAISettings({
        enabled: aiEnabled,
        replyTone,
        defaultLanguage,
        autoSuggest,
      });
      setIsSaving(false);
      toast.success("AI Assistant parameters updated!");
    }, 400);
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          Platform Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your account profile, team workspace, email alerts, and SupportAI reply engine.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-1 sm:space-x-4 overflow-x-auto text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === "profile"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <User className="h-4 w-4" />
          Profile
        </button>

        <button
          onClick={() => setActiveTab("workspace")}
          className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === "workspace"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Building className="h-4 w-4" />
          Workspace
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === "notifications"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Bell className="h-4 w-4" />
          Notifications
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === "ai"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          AI Settings
        </button>
      </div>

      {/* 1. Profile Section */}
      {activeTab === "profile" && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your public support avatar and contact address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="flex items-center gap-4 pb-2">
                <Avatar name={profileName} src={profileAvatar} size="xl" />
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Profile Picture
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Enter image URL or use initials avatar
                  </p>
                </div>
              </div>

              <Input
                label="Full Name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                required
              />

              <Input
                label="Role / Title"
                value={profileTitle}
                onChange={(e) => setProfileTitle(e.target.value)}
              />

              <Input
                label="Avatar URL"
                value={profileAvatar}
                onChange={(e) => setProfileAvatar(e.target.value)}
                placeholder="https://..."
              />

              <div className="pt-2">
                <Button type="submit" size="sm" isLoading={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 2. Workspace Section */}
      {activeTab === "workspace" && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Workspace & Organization</CardTitle>
            <CardDescription>
              Configure company identity, timezone, and inbound support email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveWorkspace} className="space-y-4">
              <Input
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />

              <Input
                label="Support Inbound Email"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Default Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-slate-100"
                >
                  <option value="America/New_York (UTC-5)">America/New_York (UTC-5)</option>
                  <option value="America/Chicago (UTC-6)">America/Chicago (UTC-6)</option>
                  <option value="America/Los_Angeles (UTC-8)">America/Los_Angeles (UTC-8)</option>
                  <option value="Europe/London (UTC+0)">Europe/London (UTC+0)</option>
                  <option value="Europe/Paris (UTC+1)">Europe/Paris (UTC+1)</option>
                  <option value="Asia/Karachi (UTC+5)">Asia/Karachi (UTC+5)</option>
                  <option value="Asia/Dubai (UTC+4)">Asia/Dubai (UTC+4)</option>
                </select>
              </div>

              <div className="pt-2">
                <Button type="submit" size="sm" isLoading={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Workspace
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 3. Notifications Section */}
      {activeTab === "notifications" && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Control alert triggers for incoming tickets, messages, and dispatch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveNotifications} className="space-y-4">
              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Email Notifications
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Receive digest and urgent alerts at your registered email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      New Ticket Notifications
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Instant notification when a new ticket is logged or assigned
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newTicketNotifications}
                    onChange={(e) => setNewTicketNotifications(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      New Customer Message Notifications
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Alert whenever an active customer replies in chat
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newMessageNotifications}
                    onChange={(e) => setNewMessageNotifications(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </label>
              </div>

              <div className="pt-2">
                <Button type="submit" size="sm" isLoading={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Notifications
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 4. AI Settings Section */}
      {activeTab === "ai" && (
        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <CardTitle>AI Assistant Settings</CardTitle>
            </div>
            <CardDescription>
              Configure tone parameters, default output language, and assistance mode.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveAI} className="space-y-5">
              {/* Enable/Disable toggle */}
              <label className="flex items-center justify-between p-3 rounded-xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/30 dark:bg-indigo-950/20 cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    Enable AI Reply Assistant
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Provides one-click contextual draft replies inside conversation views
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={aiEnabled}
                  onChange={(e) => setAiEnabled(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </label>

              {/* Reply Tone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Default Reply Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Professional", "Friendly", "Concise"] as AIReplyTone[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setReplyTone(t)}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                        replyTone === t
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Language (English, Urdu, etc.) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Default Language
                </label>
                <select
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value as SupportedLanguage)}
                  className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-slate-100"
                >
                  <option value="English">English</option>
                  <option value="Urdu">Urdu (اردو)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                </select>
                <p className="text-[11px] text-slate-400">
                  English and Urdu are prioritized with authentic localized responses.
                </p>
              </div>

              {/* Safety notice */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-indigo-500" />
                  Human-in-the-Loop Governance
                </p>
                <p>
                  SupportAI enforces that every generated response must be reviewed and sent by a human agent. No messages are ever sent autonomously to customers.
                </p>
              </div>

              <div className="pt-2">
                <Button type="submit" size="sm" isLoading={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save AI Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
