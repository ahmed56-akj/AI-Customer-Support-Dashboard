import { Message } from "@/types";

export type AIReplyTone = "Professional" | "Friendly" | "Concise";
export type SupportedLanguage = "English" | "Urdu" | "Spanish" | "French" | "German";

export interface GenerateReplyOptions {
  messages: Message[];
  customerName: string;
  tone?: AIReplyTone;
  language?: SupportedLanguage;
}

export interface AISummaryResult {
  summary: string;
  sentiment: "Positive" | "Neutral" | "Frustrated" | "Urgent";
  keyPoints: string[];
  recommendedAction: string;
}

class AIService {
  private apiKey: string | null = null;
  private provider: "mock" | "gemini" | "openai" = "mock";

  constructor() {
    if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_AI_PROVIDER) {
      this.provider = process.env.NEXT_PUBLIC_AI_PROVIDER as any;
    }
    if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_AI_API_KEY) {
      this.apiKey = process.env.NEXT_PUBLIC_AI_API_KEY;
    }
  }

  public setProvider(provider: "mock" | "gemini" | "openai", apiKey?: string) {
    this.provider = provider;
    if (apiKey) this.apiKey = apiKey;
  }

  /**
   * Generates a context-aware customer support reply based on the message thread.
   */
  public async generateReply({
    messages,
    customerName,
    tone = "Professional",
    language = "English",
  }: GenerateReplyOptions): Promise<string> {
    // Simulate real AI processing latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lastCustomerMsg = [...messages].reverse().find((m) => m.senderType === "customer")?.content || "";
    const lowerMsg = lastCustomerMsg.toLowerCase();

    let baseReply = "";

    // Specific password reset scenario
    if (lowerMsg.includes("forgot my password") || lowerMsg.includes("password") || lowerMsg.includes("cannot access my account") || lowerMsg.includes("login")) {
      if (tone === "Professional") {
        baseReply = `Hi ${customerName}, no problem. You can reset your password using the Forgot Password option on the login page. If you continue to experience issues, please let us know and we'll be happy to help.`;
      } else if (tone === "Friendly") {
        baseReply = `Hey ${customerName}! Don't worry at all, we've got you covered. You can easily reset your password by clicking "Forgot Password" on our sign-in page. Let me know if you run into any trouble and I'll jump right in to help! 😊`;
      } else {
        baseReply = `Hi ${customerName}, please reset your credentials via the "Forgot Password" link on the login page. Let us know if you need further assistance.`;
      }
    }
    // Billing / refund / invoice scenario
    else if (lowerMsg.includes("invoice") || lowerMsg.includes("billing") || lowerMsg.includes("refund") || lowerMsg.includes("downgrade") || lowerMsg.includes("seat")) {
      if (tone === "Professional") {
        baseReply = `Hi ${customerName}, thank you for reaching out regarding your account billing. I've reviewed your recent subscription adjustments and will ensure any prorated credits or updated invoices are properly applied to your account immediately.`;
      } else if (tone === "Friendly") {
        baseReply = `Hi ${customerName}! Thanks so much for flagging this. I'm looking into your billing details right now and will make sure all charges and seat credits are squared away for you! ✨`;
      } else {
        baseReply = `Hi ${customerName}, I'm reviewing your invoice details and will process the appropriate adjustment or credit directly.`;
      }
    }
    // Webhook / API / Technical bug scenario
    else if (lowerMsg.includes("webhook") || lowerMsg.includes("signature") || lowerMsg.includes("sha256") || lowerMsg.includes("api") || lowerMsg.includes("timeout") || lowerMsg.includes("export")) {
      if (tone === "Professional") {
        baseReply = `Hi ${customerName}, thanks for providing the debug details. Our technical team is inspecting the payload verification and signature headers. We will provide an update with reproduction steps shortly.`;
      } else if (tone === "Friendly") {
        baseReply = `Hey ${customerName}! Great catch on the technical telemetry. I've pulled the server logs and shared them with our API team. We'll have this sorted out for you as quickly as possible! 🚀`;
      } else {
        baseReply = `Hi ${customerName}, our engineering team is investigating the payload headers. We will follow up with a fix shortly.`;
      }
    }
    // General / SOC2 / Compliance
    else if (lowerMsg.includes("soc2") || lowerMsg.includes("compliance") || lowerMsg.includes("report") || lowerMsg.includes("gdpr")) {
      if (tone === "Professional") {
        baseReply = `Hi ${customerName}, thank you for your inquiry. I'd be glad to share our latest SOC2 Type II compliance report and security overview under our standard confidentiality terms.`;
      } else if (tone === "Friendly") {
        baseReply = `Hello ${customerName}! Absolutely, we take compliance seriously and have all the documentation ready. I'll get that security packet over to your team right away!`;
      } else {
        baseReply = `Hi ${customerName}, our latest compliance packet and security documents are available. I will deliver them shortly.`;
      }
    }
    // Fallback contextual reply
    else {
      if (tone === "Professional") {
        baseReply = `Hi ${customerName}, thank you for reaching out to SupportAI. I am currently looking into this matter and will assist you with the next steps immediately.`;
      } else if (tone === "Friendly") {
        baseReply = `Hi ${customerName}! Thanks for messaging us today. I'm on it and will be more than happy to help you get this resolved! 😊`;
      } else {
        baseReply = `Hi ${customerName}, received your message. Investigating and following up promptly.`;
      }
    }

    if (language !== "English") {
      return this.translateText(baseReply, language);
    }

    return baseReply;
  }

  /**
   * Adjusts the tone of an existing drafted reply.
   */
  public async adjustTone(
    currentText: string,
    targetTone: AIReplyTone,
    customerName: string = "Customer"
  ): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (targetTone === "Professional") {
      if (currentText.toLowerCase().includes("password")) {
        return `Hi ${customerName}, no problem. You can reset your password using the Forgot Password option on the login page. If you continue to experience issues, please let us know and we'll be happy to help.`;
      }
      return `Dear ${customerName},\n\nThank you for bringing this to our attention. We have reviewed your request and are taking the necessary steps to resolve this promptly. Please let us know if you require any additional information.\n\nBest regards,\nCustomer Support Team`;
    }

    if (targetTone === "Friendly") {
      if (currentText.toLowerCase().includes("password")) {
        return `Hey ${customerName}! Don't worry at all, we've got you covered. You can easily reset your password by clicking "Forgot Password" on our sign-in page. Let me know if you run into any trouble and I'll jump right in to help! 😊`;
      }
      return `Hey ${customerName}! 😊 Thanks for reaching out to us today. We're on top of this and will make sure everything is taken care of for you in no time! Let us know if you need anything else!`;
    }

    if (targetTone === "Concise") {
      if (currentText.toLowerCase().includes("password")) {
        return `Hi ${customerName}, please reset your credentials via the "Forgot Password" link on the login page. Let us know if you need further assistance.`;
      }
      return `Hi ${customerName}, we received your request and are actively processing it. We will notify you once completed.`;
    }

    return currentText;
  }

  /**
   * Summarizes the entire conversation into key takeaways and next steps.
   */
  public async summarizeConversation(messages: Message[]): Promise<AISummaryResult> {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const totalCount = messages.length;
    const textJoined = messages.map((m) => `${m.senderName}: ${m.content}`).join("\n");
    const lower = textJoined.toLowerCase();

    let sentiment: AISummaryResult["sentiment"] = "Neutral";
    if (lower.includes("urgent") || lower.includes("cannot access") || lower.includes("fails") || lower.includes("error")) {
      sentiment = "Urgent";
    } else if (lower.includes("thank") || lower.includes("great") || lower.includes("resolved") || lower.includes("awesome")) {
      sentiment = "Positive";
    } else if (lower.includes("frustrated") || lower.includes("slow") || lower.includes("wrong")) {
      sentiment = "Frustrated";
    }

    const keyPoints: string[] = [];
    if (lower.includes("password") || lower.includes("login")) {
      keyPoints.push("Customer locked out or requested credentials reset assistance.");
      keyPoints.push("Advised self-service password reset procedure via portal.");
    } else if (lower.includes("billing") || lower.includes("invoice")) {
      keyPoints.push("Seat count adjustment and prorated invoice discrepancy.");
      keyPoints.push("Finance credit verified and applied.");
    } else if (lower.includes("api") || lower.includes("webhook") || lower.includes("audit")) {
      keyPoints.push("Technical integration issue reported with payload or rate-limiting.");
      keyPoints.push("Internal engineering ticket and diagnostic trace referenced.");
    } else {
      keyPoints.push(`Thread contains ${totalCount} messages between customer and agent.`);
      keyPoints.push("Inquiry is currently under active triage.");
    }

    return {
      summary: `Conversation covers ${totalCount} exchanged messages regarding customer account operations and active resolution status.`,
      sentiment,
      keyPoints,
      recommendedAction: sentiment === "Urgent" ? "High Priority: Follow up within 30 minutes to verify resolution." : "Normal: Monitor customer confirmation.",
    };
  }

  /**
   * Translates reply to another supported language.
   */
  public async translateText(text: string, targetLanguage: SupportedLanguage): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (targetLanguage === "English") {
      return text;
    }

    if (targetLanguage === "Urdu") {
      if (text.toLowerCase().includes("password") || text.toLowerCase().includes("forgot")) {
        return "السلام علیکم، کوئی مسئلہ نہیں۔ آپ لاگ ان صفحے پر 'پاس ورڈ بھول گئے' (Forgot Password) کا آپشن استعمال کر کے اپنا پاس ورڈ ری سیٹ کر سکتے ہیں۔ اگر آپ کو مزید کوئی دشواری پیش آئے تو برائے مہربانی ہمیں مطلع کریں، ہم بخوشی مدد کریں گے۔";
      }
      return `السلام علیکم، آپ کے پیغام کا شکریہ۔ ہم اس معاملے کا جائزہ لے رہے ہیں اور جلد از جلد آپ کی مکمل رہنمائی کریں گے۔ اگر آپ کا کوئی مزید سوال ہے تو بلا جھجھک بتائیں۔`;
    }

    if (targetLanguage === "Spanish") {
      if (text.toLowerCase().includes("password") || text.toLowerCase().includes("forgot")) {
        return "Hola, no hay problema. Puedes restablecer tu contraseña usando la opción 'Olvidé mi contraseña' en la página de inicio de sesión. Si continúas teniendo problemas, avísanos y estaremos encantados de ayudarte.";
      }
      return "Hola, gracias por ponerte en contacto. Estamos revisando tu solicitud y te daremos una respuesta enseguida.";
    }

    if (targetLanguage === "French") {
      if (text.toLowerCase().includes("password") || text.toLowerCase().includes("forgot")) {
        return "Bonjour, aucun problème. Vous pouvez réinitialiser votre mot de passe en utilisant l'option 'Mot de passe oublié' sur la page de connexion. Si vous continuez à rencontrer des difficultés, prévenez-nous et nous serons ravis de vous aider.";
      }
      return "Bonjour, merci de nous avoir contactés. Nous examinons votre demande et reviendrons vers vous dans les plus brefs délais.";
    }

    if (targetLanguage === "German") {
      if (text.toLowerCase().includes("password") || text.toLowerCase().includes("forgot")) {
        return "Hallo, kein Problem. Sie können Ihr Passwort über die Option 'Passwort vergessen' auf der Anmeldeseite zurücksetzen. Falls weiterhin Probleme auftreten, lassen Sie es uns wissen – wir helfen gerne.";
      }
      return "Hallo, vielen Dank für Ihre Kontaktaufnahme. Wir prüfen Ihr Anliegen und melden uns in Kürze bei Ihnen.";
    }

    return text;
  }
}

export const aiService = new AIService();
