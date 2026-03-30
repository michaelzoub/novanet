"use client";

import { useState } from "react";
import { Upload, FileText, Check, Sparkles, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";

interface HiringDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HiringDialog({ isOpen, onClose }: HiringDialogProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [whyJoinOpen, setWhyJoinOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitStatus({
          type: "error",
          message: t("hiring.cvTooLarge"),
        });
        return;
      }
      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setSubmitStatus({
          type: "error",
          message: t("hiring.cvInvalidFormat"),
        });
        return;
      }
      setCvFile(file);
      setSubmitStatus({ type: null, message: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    if (!cvFile) {
      setSubmitStatus({
        type: "error",
        message: t("hiring.cvRequired"),
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(cvFile);
      reader.onload = async () => {
        const base64File = reader.result as string;

        const response = await fetch("/api/submitApplication", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            position: "",
            message: formData.message,
            cvFileName: cvFile.name,
            cvFileType: cvFile.type,
            cvFileData: base64File,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSubmitStatus({
            type: "success",
            message: data.message || t("hiring.success"),
          });
          // Reset form
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            message: "",
          });
          setCvFile(null);
          // Close dialog after 2 seconds
          setTimeout(() => {
            onClose();
            setSubmitStatus({ type: null, message: "" });
          }, 2000);
        } else {
          setSubmitStatus({
            type: "error",
            message: data.error || t("hiring.error"),
          });
        }
        setIsSubmitting(false);
      };
      reader.onerror = () => {
        setSubmitStatus({
          type: "error",
          message: t("hiring.fileReadError"),
        });
        setIsSubmitting(false);
      };
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: t("hiring.error"),
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setWhyJoinOpen(false);
          onClose();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto px-8 pb-8 pt-2">
        <DialogHeader className="space-y-0">
          <DialogTitle className="font-display text-2xl font-bold uppercase text-[#0f1f4b]">
            {t("hiring.title")}
          </DialogTitle>
          <DialogDescription className="text-[13px] text-gray-600">
            {t("hiring.description")}
          </DialogDescription>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setWhyJoinOpen((o) => !o)}
              className="flex w-full max-w-md items-center gap-2 rounded-sm border border-[#0f1f4b]/10 bg-[#0f1f4b]/[0.03] px-2.5 py-1.5 text-left transition-colors hover:border-[#0f1f4b]/20 hover:bg-[#0f1f4b]/[0.06] sm:max-w-lg"
              aria-expanded={whyJoinOpen}
              aria-controls="hiring-why-join-list"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#0f1f4b]" aria-hidden />
              <span className="min-w-0 flex-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0f1f4b]">
                {t("hiring.whyJoin")}
              </span>
              <span className="hidden shrink-0 text-[10px] font-normal normal-case tracking-normal text-gray-500 sm:inline">
                · {t("hiring.whyJoinHint")}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 shrink-0 text-[#0f1f4b] transition-transform duration-200 ${
                  whyJoinOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
            </button>
            {whyJoinOpen ? (
              <ul
                id="hiring-why-join-list"
                className="mt-2 max-w-lg space-y-1 border-l-2 border-[#0f1f4b]/20 pl-3 text-[11px] leading-snug text-[#0f1f4b]"
              >
                {(
                  [
                    "hiring.whyJoin1",
                    "hiring.whyJoin2",
                    "hiring.whyJoin3",
                    "hiring.whyJoin4",
                  ] as const
                ).map((key) => (
                  <li key={key} className="flex gap-2">
                    <Check
                      className="mt-0.5 h-3 w-3 shrink-0 text-[#0f1f4b]"
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </DialogHeader>

        {submitStatus.type && (
          <div
            className={`p-3 rounded text-sm ${
              submitStatus.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b] mb-1.5">
                {t("hiring.firstName")} *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-[#0f1f4b] text-sm"
                placeholder="Jean"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b] mb-1.5">
                {t("hiring.lastName")} *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-[#0f1f4b] text-sm"
                placeholder="Dupont"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b] mb-1.5">
                {t("hiring.email")} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-[#0f1f4b] text-sm"
                placeholder="jean.dupont@email.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b] mb-1.5">
                {t("hiring.phone")} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-[#0f1f4b] text-sm"
                placeholder="(514) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b] mb-1.5">
              {t("hiring.cv")} *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0f1f4b] transition-colors">
              <input
                type="file"
                id="cv-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <label
                htmlFor="cv-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {cvFile ? (
                  <>
                    <FileText className="w-8 h-8 text-[#0f1f4b] mb-2" />
                    <span className="text-sm font-medium text-[#0f1f4b]">
                      {cvFile.name}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {t("hiring.cvChange")}
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {t("hiring.cvUpload")}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {t("hiring.cvMaxSize")}
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#0f1f4b] mb-1.5">
              {t("hiring.message")}
            </label>
            <textarea
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded focus:outline-none focus:border-[#0f1f4b] text-sm"
              placeholder={t("hiring.messagePlaceholder")}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-institutional-ghost flex-1"
            >
              {t("hiring.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-institutional-primary flex-1"
            >
              {isSubmitting ? t("hiring.submitting") : t("hiring.submit")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
