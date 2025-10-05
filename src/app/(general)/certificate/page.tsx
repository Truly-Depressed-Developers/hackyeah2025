"use client";

import { useState } from "react";
import CertificateForm from "@/components/Certificate/CertificateForm";
import { CertificateTemplate } from "@/components/Certificate/CertificateTemplate";

export default function CertificatePage() {
  const [formData, setFormData] = useState<{ fullName: string } | null>(null);

  if (!formData) {
    // 👇 widok formularza
    return (
      <div className="flex p-10">
        <CertificateForm onSubmit={(data) => setFormData(data)} />
      </div>
    );
  }

  // 👇 po wypełnieniu i wysłaniu formularza pokazujemy certyfikat
  return (
    <div className="flex min-h-screen p-10">
      <CertificateTemplate
        fullName={formData.fullName}
        onBack={() => setFormData(null)} // wracamy do formularza
      />
    </div>
  );
}
