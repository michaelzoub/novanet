"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref")?.trim().toLowerCase() ?? "";

  const copy =
    lang === "fr"
      ? {
          contactInfo: [
            {
              icon: Phone,
              label: "Téléphone",
              value: "514-758-6241",
              href: "tel:+15147586241",
            },
            { icon: Mail, label: "Courriel", value: "novanet.qc@gmail.com" },
            { icon: MapPin, label: "Adresse", value: "Montréal (QC)" },
          ],
          titlePrefix: "Prêt à ",
          titleAccent: "commencer ?",
          description:
            "Contactez-nous dès aujourd'hui pour une soumission gratuite et découvrez comment nous pouvons transformer votre propriété.",
          formTitle: "Demande de soumission",
          formDescription:
            "Remplissez le formulaire ci-dessous et nous vous contacterons rapidement.",
          firstName: "Prénom",
          lastName: "Nom",
          email: "Courriel",
          phone: "Téléphone",
          phoneRequired: "Téléphone",
          message: "Message",
          messagePlaceholder: "Décrivez vos besoins…",
          submit: "Envoyer la demande",
          submitting: "Envoi en cours…",
          success: "Votre demande a été envoyée avec succès !",
          error: "Une erreur est survenue. Veuillez réessayer.",
          phoneMissing: "Veuillez entrer votre numéro de téléphone (obligatoire).",
        }
      : {
          contactInfo: [
            {
              icon: Phone,
              label: "Phone",
              value: "514-758-6241",
              href: "tel:+15147586241",
            },
            { icon: Mail, label: "Email", value: "novanet.qc@gmail.com" },
            { icon: MapPin, label: "Location", value: "Montreal, QC" },
          ],
          titlePrefix: "Ready to ",
          titleAccent: "Get Started?",
          description:
            "Contact us today for a free quote and see how we can transform your property.",
          formTitle: "Request a quote",
          formDescription:
            "Fill out the form below and we will get back to you quickly.",
          firstName: "First Name",
          lastName: "Last Name",
          email: "Email",
          phone: "Phone",
          phoneRequired: "Phone",
          message: "Message",
          messagePlaceholder: "Describe what you need...",
          submit: "Send request",
          submitting: "Sending...",
          success: "Your request was sent successfully!",
          error: "An error occurred. Please try again.",
          phoneMissing: "Please enter your phone number (required).",
        };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      if (!formData.phone.trim()) {
        setSubmitStatus({ type: "error", message: copy.phoneMissing });
        return;
      }

      const response = await fetch("/api/submitContact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          referralCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: data.message || copy.success,
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || copy.error,
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: copy.error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-8 md:px-16">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          <div>
            <h2 className="mb-5 font-display text-4xl font-bold uppercase leading-tight text-[#0f1f4b] md:text-5xl lg:text-6xl">
              {copy.titlePrefix}
              {copy.titleAccent}
            </h2>
            <p className="mb-8 max-w-md text-[15px] leading-relaxed text-gray-600">
              {copy.description}
            </p>
            <div className="space-y-5">
              {copy.contactInfo.map((info, idx) => (
                <div key={idx} className="flex gap-3.5">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm bg-gray-50">
                    <info.icon className="h-4 w-4 text-[#0f1f4b]" />
                  </div>
                  <div>
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      {info.label}
                    </div>
                    <div className="text-sm font-semibold text-[#0f1f4b]">
                      {"href" in info && info.href ? (
                        <a href={info.href} className="hover:underline">
                          {info.value}
                        </a>
                      ) : (
                        info.value
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-sm border border-gray-200 bg-white p-10 shadow-sm md:p-12">
            <h3 className="mb-3 font-display text-2xl font-bold uppercase text-[#0f1f4b]">
              {copy.formTitle}
            </h3>
            <p className="mb-6 text-[13px] leading-relaxed text-gray-600">
              {copy.formDescription}
            </p>
            {submitStatus.type && (
              <div
                className={`mb-4 rounded-sm p-3 text-sm ${
                  submitStatus.type === "success"
                    ? "border border-green-200 bg-green-50 text-green-700"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {submitStatus.message}
              </div>
            )}
            {referralCode && (
              <div className="mb-4 rounded-sm border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                {t("contact.referralActive")}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                    {copy.firstName} *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-sm border border-gray-200 px-3.5 py-2.5 text-sm focus:border-[#0f1f4b] focus:outline-none"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                    {copy.lastName} *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-sm border border-gray-200 px-3.5 py-2.5 text-sm focus:border-[#0f1f4b] focus:outline-none"
                    placeholder="Dupont"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                  {copy.email} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-sm border border-gray-200 px-3.5 py-2.5 text-sm focus:border-[#0f1f4b] focus:outline-none"
                  placeholder="jean.dupont@email.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                  {copy.phoneRequired} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
            required
                  className="w-full rounded-sm border border-gray-200 px-3.5 py-2.5 text-sm focus:border-[#0f1f4b] focus:outline-none"
                  placeholder="514-758-6241"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b]">
                  {copy.message}
                </label>
                <textarea
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-sm border border-gray-200 px-3.5 py-2.5 text-sm focus:border-[#0f1f4b] focus:outline-none"
                  placeholder={copy.messagePlaceholder}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-institutional-primary w-full"
              >
                {isSubmitting ? copy.submitting : copy.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
