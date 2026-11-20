"use client";

import React, { useState } from "react";
import {
  Sparkles,
  RefreshCw,
  Briefcase,
  Smile,
  Minimize2,
  FileText,
  Languages,
  Check,
  Edit3,
  Send,
  AlertCircle,
  Copy,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { aiService, AIReplyTone, SupportedLanguage, AISummaryResult } from "@/services/aiService";
import { Message, Conversation } from "@/types";
import { toast } from "sonner";

interface AIReplyAssistantProps {
  conversation: Conversation;
  messages: Message[];
  onUseReply: (text: string) => void;
  isOpen?: boolean;
}

export function AIReplyAssistant({
  conversation,
  messages,
  onUseReply,
}: AIReplyAssistantProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState<AISummaryResult | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("English");
  const [selectedTone, setSelectedTone] = useState<AIReplyTone>("Professional");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const handleGenerate = async (tone: AIReplyTone = selectedTone) => {
    setIsGenerating(true);
    setSummary(null);
    try {
      const reply = await aiService.generateReply({
        messages,
        customerName: conversation.customerName,
        tone,
        language: selectedLanguage,
      });
      setGeneratedText(reply);
      setSelectedTone(tone);
      toast.success("AI draft generated based on conversation context");
    } catch {
      toast.error("Failed to generate AI response");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToneChange = async (tone: AIReplyTone) => {
    if (!generatedText) {
      await handleGenerate(tone);
      return;
    }
    setIsGenerating(true);
    try {
      const adjusted = await aiService.adjustTone(generatedText, tone, conversation.customerName);
      setGeneratedText(adjusted);
      setSelectedTone(tone);
      toast.success(`Tone adjusted to ${tone}`);
    } catch {
      toast.error("Failed to adjust tone");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSummarize = async () => {
    setIsGenerating(true);
    try {
      const res = await aiService.summarizeConversation(messages);
      setSummary(res);
      toast.success("Conversation summarized");
    } catch {
      toast.error("Failed to summarize conversation");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTranslate = async (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    setShowLanguageDropdown(false);
    if (!generatedText) {
      setIsGenerating(true);
      try {
        const reply = await aiService.generateReply({
          messages,
          customerName: conversation.customerName,
          tone: selectedTone,
          language: lang,
        });
        setGeneratedText(reply);
        toast.success(`Generated in ${lang}`);
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    setIsGenerating(true);
    try {
      const translated = await aiService.translateText(generatedText, lang);
      setGeneratedText(translated);
      toast.success(`Translated to ${lang}`);
    } catch {
      toast.error("Translation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    toast.success("Copied to clipboard");
  };

  const handleApply = () => {
    if (!generatedText) return;
    onUseReply(generatedText);
    toast.success("Applied to message composer! Review before sending.");
  };

  return (
    <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-900/50 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900 shadow-sm p-4 space-y-3">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-indigo-100 dark:border-indigo-900/40">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                SupportAI Copilot
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                Smart Context
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Generates drafts for agent review. Never sent automatically.
            </p>
          </div>
        </div>

        {/* Primary Generate Trigger */}
        <Button
          size="xs"
          onClick={() => handleGenerate()}
          isLoading={isGenerating}
          className="gap-1.5 shadow-xs"
        >
          <Sparkles className="h-3 w-3" />
          {generatedText ? "Regenerate" : "Generate Reply"}
        </Button>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <button
          onClick={() => handleToneChange("Professional")}
          disabled={isGenerating}
          className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
            selectedTone === "Professional"
              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
          }`}
        >
          <Briefcase className="h-3 w-3" />
          Make Professional
        </button>

        <button
          onClick={() => handleToneChange("Friendly")}
          disabled={isGenerating}
          className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
            selectedTone === "Friendly"
              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
          }`}
        >
          <Smile className="h-3 w-3" />
          Make Friendly
        </button>

        <button
          onClick={() => handleToneChange("Concise")}
          disabled={isGenerating}
          className={`px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
            selectedTone === "Concise"
              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
          }`}
        >
          <Minimize2 className="h-3 w-3" />
          Make Shorter
        </button>

        <button
          onClick={handleSummarize}
          disabled={isGenerating}
          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium flex items-center gap-1.5 transition-colors"
        >
          <FileText className="h-3 w-3 text-indigo-500" />
          Summarize Conversation
        </button>

        {/* Translation dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium flex items-center gap-1.5 transition-colors"
          >
            <Languages className="h-3 w-3 text-emerald-500" />
            <span>{selectedLanguage === "English" ? "Translate" : selectedLanguage}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>

          {showLanguageDropdown && (
            <div className="absolute left-0 mt-1.5 w-36 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-30">
              {(["English", "Urdu", "Spanish", "French", "German"] as SupportedLanguage[]).map(
                (lang) => (
                  <button
                    key={lang}
                    onClick={() => handleTranslate(lang)}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-between"
                  >
                    <span>{lang}</span>
                    {selectedLanguage === lang && <Check className="h-3 w-3 text-indigo-600" />}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Box if triggered */}
      {summary && (
        <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Conversation Summary & Sentiment
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                summary.sentiment === "Urgent"
                  ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                  : summary.sentiment === "Positive"
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
              }`}
            >
              {summary.sentiment}
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {summary.summary}
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
            {summary.keyPoints.map((kp, idx) => (
              <li key={idx}>{kp}</li>
            ))}
          </ul>
          <p className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300">
            Action: {summary.recommendedAction}
          </p>
        </div>
      )}

      {/* Generated Response Area */}
      {generatedText && (
        <div className="space-y-2 pt-1 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Edit3 className="h-3 w-3 text-indigo-500" />
              AI Draft (Review & Edit):
            </span>
            <span className="text-[11px] text-slate-400">
              {generatedText.length} characters
            </span>
          </div>

          <textarea
            value={generatedText}
            onChange={(e) => setGeneratedText(e.target.value)}
            rows={3}
            dir={selectedLanguage === "Urdu" ? "rtl" : "ltr"}
            className="w-full rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-slate-900 p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-inner"
            placeholder="AI response draft appears here. You can freely edit before using..."
          />

          {/* Action Confirmation Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={handleApply}
                className="gap-1.5 shadow-sm"
              >
                <Check className="h-3.5 w-3.5" />
                Use Reply
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleGenerate(selectedTone)}
                disabled={isGenerating}
                className="gap-1.5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                Regenerate
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="gap-1.5 text-slate-500"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>

            <p className="text-[11px] text-slate-400 italic flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Requires agent confirmation
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
