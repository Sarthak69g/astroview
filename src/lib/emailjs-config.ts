import emailjs from "@emailjs/browser";

type EmailJSConfig = {
  serviceId: string;
  templateId: string;
  publicKey: string;
  isConfigured: boolean;
};

function readEnv(key: string): string | undefined {
  try {
    const value = import.meta.env[key];
    return typeof value === "string" && value.trim().length > 0
      ? value.trim()
      : undefined;
  } catch {
    return undefined;
  }
}

function buildConfig(): EmailJSConfig {
  const serviceId = readEnv("VITE_EMAILJS_SERVICE_ID");
  const templateId = readEnv("VITE_EMAILJS_TEMPLATE_ID");
  const publicKey = readEnv("VITE_EMAILJS_PUBLIC_KEY");

  const isConfigured =
    Boolean(serviceId) && Boolean(templateId) && Boolean(publicKey);

  if (!isConfigured && typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.warn(
      "[AstroView] EmailJS is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY to enable the contact form."
    );
  }

  return {
    serviceId: serviceId ?? "",
    templateId: templateId ?? "",
    publicKey: publicKey ?? "",
    isConfigured,
  };
}

export const emailjsConfig = buildConfig();

/**
 * Send a contact form via EmailJS.
 * Throws if EmailJS is not configured so callers can show a friendly message.
 */
export async function sendContactEmail(params: Record<string, unknown>) {
  if (!emailjsConfig.isConfigured) {
    throw new Error(
      "EmailJS is not configured. Please set the EmailJS environment variables."
    );
  }

  return emailjs.send(
    emailjsConfig.serviceId,
    emailjsConfig.templateId,
    params,
    emailjsConfig.publicKey
  );
}
