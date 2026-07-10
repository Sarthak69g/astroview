// src/components/OnRequestPujaForm.tsx
//
// Shown on /puja when the "On Request Puja" filter is selected. Modeled on
// astropanditom.com's "On Request Special Puja" page: a short brief on what
// an on-request puja covers, followed by a single contact form — no package
// picker, since these are custom requests (urgent-basis Ghar Pe puja, puja
// performed at a holy place of the customer's choice, extra pandits, etc.)
// that need a human to scope and quote.

import { FormEvent, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { sendContactEmail } from "@/lib/emailjs-config";

export default function OnRequestPujaForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    city: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) { toast.error("Please enter your name"); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) { toast.error("Please enter a valid email address"); return; }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) { toast.error("Please enter a valid 10-digit mobile number"); return; }
    if (!formData.city.trim()) { toast.error("Please enter your city"); return; }
    if (!formData.message.trim()) { toast.error("Tell us a little about the puja you have in mind"); return; }
    const wordCount = formData.message.trim().split(/\s+/).length;
    if (wordCount > 200) { toast.error("Please keep your message under 200 words"); return; }

    try {
      setLoading(true);
      await sendContactEmail({
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        location: formData.location,
        city: formData.city,
        service: "On Request Puja",
        message: formData.message,
        source: "On Request Puja Form",
        time: new Date().toLocaleString(),
      });
      toast.success("Request sent! Our team will reach out within 24 hours to scope your puja.");
      setFormData({ name: "", email: "", phone: "", location: "", city: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Unable to submit your request. Please try again in a few moments.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-14 rounded-xl border border-border bg-background px-4 outline-none focus:border-primary transition-colors";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Intro card */}
      <div className="rounded-3xl border border-border bg-card p-7 md:p-9 shadow-card mb-6">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs uppercase tracking-[0.18em] font-medium">On Request Special Puja</span>
        </div>
        <h2 className="mt-3 font-display text-2xl md:text-3xl font-semibold">
          A puja customized entirely around you.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Ghar Pe premium puja customized by you, a Ghar Pe puja on an urgent basis, or a puja
          performed from a holy place of your choice — along sacred river banks, temples and
          dhams across India.
        </p>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          If you'd like a puja performed specially with more pandits, or from a holy place of
          your choosing, share the details below and our team will get back to you with a plan
          and a quote.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-border bg-card p-5 md:p-10 shadow-card"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-primary-deep">Name</label>
            <input
              disabled={loading}
              type="text"
              placeholder="Enter Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value.replace(/[^A-Za-z\s]/g, "") })}
              className={`mt-2 ${inputClass}`}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-primary-deep">Email</label>
            <input
              disabled={loading}
              type="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`mt-2 ${inputClass}`}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-primary-deep">Mobile Number</label>
            <input
              disabled={loading}
              type="tel"
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              className={`mt-2 ${inputClass}`}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-primary-deep">Location</label>
            <input
              disabled={loading}
              type="text"
              placeholder="e.g. home address, or holy place of choice"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`mt-2 ${inputClass}`}
            />
          </div>
          <div className="md:col-span-2 md:max-w-[calc(50%-0.75rem)]">
            <label className="text-xs font-medium text-primary-deep">Enter City</label>
            <input
              disabled={loading}
              type="text"
              placeholder="Enter City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className={`mt-2 ${inputClass}`}
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-xs font-medium text-primary-deep">
            Your Message <span className="text-muted-foreground font-normal">(Maximum 200 Words)</span>
          </label>
          <textarea
            disabled={loading}
            rows={6}
            placeholder="Tell us which puja you have in mind, preferred dates, and any special requests…"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="mt-2 w-full rounded-xl border border-border bg-background p-4 outline-none focus:border-primary transition-colors resize-none"
            required
          />
        </div>

        <div className="mt-7 text-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-95 hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? "Sending…" : <><span>Send</span><ArrowRight className="h-4 w-4" /></>}
          </button>
        </div>
      </form>
    </div>
  );
}