"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

type Props = {
  fullName: string;
  onBack: () => void;
};

export function CertificateTemplate({ fullName, onBack }: Props) {
  const certRef = useRef<HTMLDivElement>(null);

  const [eventName, setEventName] = useState("Nowoczesnych technologii");
  const [signature, setSignature] = useState<string>("");

  // Generowanie sztucznego podpisu
  useEffect(() => {
    const generateSignature = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "italic 28px Pacifico, cursive";
      ctx.fillStyle = "#000000";
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.fillText(fullName, 10, 50);
      setSignature(canvas.toDataURL("image/png"));
    };

    generateSignature();
  }, [fullName]);

  const handleDownloadPDF = async () => {
    if (!certRef.current) return;

    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "-9999px";
    iframe.style.width = `${certRef.current.offsetWidth}px`;
    iframe.style.height = `${certRef.current.offsetHeight}px`;
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    if (!doc) {
      console.error("Brak dostępu do dokumentu iframe");
      document.body.removeChild(iframe);
      return;
    }

    doc.open();
    doc.write(`<!doctype html><html><head><meta charset="utf-8" />
      <style>
        html, body { margin:0; padding:0; background: #ffffff; }
        * { color: #222222 !important; background-color: transparent !important; border-color: #cccccc !important; box-shadow: none !important; }
        *::before, *::after { content: none !important; display: none !important; }
        .cert-root { box-sizing: border-box; width: ${certRef.current.offsetWidth}px; height: ${certRef.current.offsetHeight}px; background: #ffffff; color: #222222; }
        body, .cert-root { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
      </style>
    </head><body></body></html>`);
    doc.close();

    try {
      const clone = certRef.current.cloneNode(true) as HTMLElement;
      clone.classList.add("cert-root");
      doc.body.appendChild(clone);

      await new Promise((res) => setTimeout(res, 50));

      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`certyfikat-${fullName}.pdf`);
    } catch (err) {
      console.error("Błąd podczas generowania PDF:", err);
      alert("Wystąpił błąd podczas generowania PDF — sprawdź konsolę.");
    } finally {
      document.body.removeChild(iframe);
    }
  };

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}.${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}.${today.getFullYear()}`;

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={certRef}
        className="relative h-[794px] w-[1123px] border-4 border-[#cccccc] bg-[#ffffff] p-16 text-center"
        style={{ boxShadow: "none" }}
      >
        <div className="absolute inset-8 rounded-xl border-2 border-[#e5e5e5]" />

        <h1 className="mt-16 text-4xl font-bold text-[#222222]">
          CERTYFIKAT UCZESTNICTWA
        </h1>

        <p className="mt-10 text-lg text-[#444444]">
          Niniejszym zaświadcza się, że
        </p>

        <h2 className="mt-4 text-3xl font-semibold text-[#000000]">
          {fullName}
        </h2>

        <p className="mt-6 text-lg text-[#444444]">
          Wziął(a) udział w inicjatywie:
        </p>

        <h3 className="mt-2 text-2xl font-medium text-[#333333]">
          {eventName}
        </h3>

        <div className="mt-32 flex items-center justify-between px-24 text-sm text-[#555555]">
          <div>
            <p className="text-base font-semibold">{formattedDate}</p>
            <p>Data</p>
          </div>
          <div className="flex flex-col items-center">
            {signature && (
              <img
                src={signature}
                alt="Podpis cyfrowy"
                className="h-16 w-auto"
              />
            )}
            <p>Podpis</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex w-full items-center justify-start">
        <Button
          onClick={handleDownloadPDF}
          className="bg-[#2563eb] text-white hover:bg-[#1e40af]"
        >
          Pobierz jako PDF
        </Button>
        <Button
          type="submit"
          variant="outline"
          className="ml-2"
          onClick={onBack}
        >
          Wróć
        </Button>
      </div>
    </div>
  );
}
