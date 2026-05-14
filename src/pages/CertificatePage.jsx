// src/pages/CertificatePage.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  FaDownload, FaShare, FaArrowLeft, FaPrint,
  FaCheckCircle, FaSpinner,
} from "react-icons/fa";
import { verifyCertificate } from "../services/enrollmentService";
import { COMPANY_INFO } from "../../utils/constants";
import Loader from "../components/common/Loader";

const CertificatePage = () => {
  const { certificateNumber } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const certificateRef = useRef(null);

  useEffect(() => {
    loadCertificate();
  }, [certificateNumber]);

  const loadCertificate = async () => {
    try {
      const { data } = await verifyCertificate(certificateNumber);
      setCertificate(data.certificate);
    } catch (err) {
      toast.error("Certificate not found or invalid");
    } finally {
      setLoading(false);
    }
  };

  // ===== DOWNLOAD AS PDF (server-generated) =====
  // Avoid html2canvas entirely because Tailwind v4 emits modern CSS colors (e.g. oklch)
  // which your html2canvas build can't parse.
  const handleDownloadPDF = async () => {
    try {
      if (!certificateNumber) {
        toast.error("Certificate number missing");
        return;
      }
      setDownloading(true);

      const { downloadCertificatePDF } = await import(
        "../services/enrollmentService"
      );
      const response = await downloadCertificatePDF(certificateNumber);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Certificate_${certificateNumber}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Certificate downloaded! 🎉");
    } catch (err) {
      console.error("handleDownloadPDF error:", err);
      toast.error("Failed to download certificate PDF");
    } finally {
      setDownloading(false);
    }
  };

  // ===== DOWNLOAD AS PNG IMAGE =====
  const handleDownloadImage = async () => {
    if (!certificateRef.current) {
      toast.error("Certificate is not ready yet");
      return;
    }
    setDownloading(true);

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        foreignObjectRendering: false,
      });

      const link = document.createElement("a");
      link.download = `${COMPANY_INFO.name}_Certificate_${certificate.studentName.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("Image downloaded!");
    } catch (err) {
      console.error("handleDownloadImage error:", err);
      toast.error(
        err?.message?.includes("CORS")
          ? "Download blocked by image CORS (check logo/signature URLs)"
          : "Failed to download image"
      );
    } finally {
      setDownloading(false);
    }
  };

  // ===== PRINT =====
  const handlePrint = () => {
    window.print();
  };

  // ===== SHARE =====
  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${certificate.studentName}'s Certificate`,
          text: `I completed ${certificate.courseName} at ${COMPANY_INFO.name}!`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      toast.success("Verification link copied to clipboard!");
    }
  };

  if (loading) return <Loader fullScreen />;

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-xl border p-10 max-w-md">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Certificate Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The certificate number is invalid or doesn't exist.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <FaArrowLeft /> Go Home
          </Link>
        </div>
      </div>
    );
  }

  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 print:bg-white print:py-0">
      <div className="max-w-6xl mx-auto px-4">

        {/* ===== ACTION BUTTONS (Hidden when printing) ===== */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 print:hidden">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-60"
            >
              {downloading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaDownload size={14} />
              )}
              Download PDF
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={downloading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-60"
            >
              <FaDownload size={14} />
              Download Image
            </button>

            <button
              onClick={handlePrint}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <FaPrint size={14} />
              Print
            </button>

            <button
              onClick={handleShare}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <FaShare size={14} />
              Share
            </button>
          </div>
        </div>

        {/* ===== CERTIFICATE ===== */}
        <div
          ref={certificateRef}
          className="bg-white shadow-2xl mx-auto print:shadow-none"
          style={{
            width: "100%",
            maxWidth: "1100px",
            aspectRatio: "1.414 / 1", // A4 landscape ratio
          }}
        >
          {/* Certificate Border Wrapper */}
          <div className="w-full h-full p-3 bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
            <div className="w-full h-full border-4 border-double border-yellow-600 p-3">
              <div className="w-full h-full border border-yellow-500 relative bg-white">

                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-primary-600 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-primary-600 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-primary-600 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-primary-600 rounded-br-lg"></div>

                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
                  <div className="text-9xl font-black text-primary-900 transform rotate-[-30deg]">
                    {COMPANY_INFO.name.split(" ")[0].toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-between py-10 px-12 text-center">

                  {/* ===== HEADER: Logo + Company Name ===== */}
                  <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center text-white shadow-lg">
                      {COMPANY_INFO.logo ? (
                        <img
                          src={COMPANY_INFO.logo}
                          alt="Logo"
                          className="w-12 h-12 object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <span className="text-2xl font-black hidden">
                        {COMPANY_INFO.name[0]}
                      </span>
                    </div>
                    
                    <div className="text-left">
                      <h1 className="text-2xl font-black text-primary-800 tracking-wide">
                        {COMPANY_INFO.name.toUpperCase()}
                      </h1>
                      <p className="text-xs text-gray-500 italic">
                        {COMPANY_INFO.tagline}
                      </p>
                    </div>
                  </div>

                  {/* ===== TITLE ===== */}
                  <div className="mt-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-2">
                      This is to certify that
                    </p>
                    <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 to-transparent mx-auto"></div>
                  </div>

                  {/* ===== STUDENT NAME ===== */}
                  <div>
                    <h2 className="text-5xl font-bold text-gray-800 mb-2"
                        style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                      {certificate.studentName}
                    </h2>
                    <div className="w-96 h-px bg-gray-300 mx-auto mb-1"></div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                      Student Name
                    </p>
                  </div>

                  {/* ===== ACHIEVEMENT TEXT ===== */}
                  <div className="max-w-2xl">
                    <p className="text-base text-gray-700 leading-relaxed">
                      has successfully completed the course
                    </p>
                    <h3 className="text-2xl font-bold text-primary-700 my-3 italic">
                      "{certificate.courseName}"
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      and has demonstrated proficiency in all required modules,
                      meeting the standards set by {COMPANY_INFO.name}.
                    </p>
                  </div>

                  {/* ===== CERTIFICATE BADGE ===== */}
                  <div className="my-2">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                        <FaCheckCircle className="text-white" size={28} />
                      </div>
                      <div className="absolute -inset-2 border-2 border-yellow-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* ===== FOOTER: Date, Signature, Cert Number ===== */}
                  <div className="w-full items-center grid grid-cols-3 gap-8 mt-2">
                    
                    {/* Date */}
                    <div className="text-center">
                      <div className="border-b-2 border-gray-400 pb-1 mb-1">
                        <p className="text-sm font-semibold text-gray-700">
                          {issuedDate}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">
                        Date Issued
                      </p>
                    </div>

                    {/* Certificate Number */}
                    <div className="text-center">
                      <div className="border-b-2 border-gray-400 pb-1 mb-1">
                        <p className="text-xs font-mono font-semibold text-gray-700">
                          {certificate.certificateNumber}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">
                        Certificate ID
                      </p>
                    </div>

                    {/* Signature */}
                    <div className="text-center">
                      <div className="border-b-2 border-gray-400 pb-1 mb-1">
                        {COMPANY_INFO.signature ? (
                          <img
                            src={COMPANY_INFO.signature}
                            alt="Signature"
                            className="h-16 mx-auto object-contain"
                          />
                        ) : (
                          <p className="text-sm font-bold text-primary-700 italic"
                             style={{ fontFamily: '"Brush Script MT", cursive' }}>
                            {COMPANY_INFO.director}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">
                        {COMPANY_INFO.directorTitle}
                      </p>
                    </div>
                  </div>

                  {/* ===== VERIFICATION ===== */}
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-400">
                      Verify this certificate at: {COMPANY_INFO.website}/verify/{certificate.certificateNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== VERIFICATION INFO (Hidden in print) ===== */}
        <div className="mt-8 bg-white rounded-xl border p-6 max-w-2xl mx-auto print:hidden">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            Verified Authentic Certificate
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Certificate Number:</span>
              <span className="font-mono font-semibold text-gray-800">
                {certificate.certificateNumber}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Recipient:</span>
              <span className="font-semibold text-gray-800">
                {certificate.studentName}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Course:</span>
              <span className="font-semibold text-gray-800">
                {certificate.courseName}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Issued On:</span>
              <span className="font-semibold text-gray-800">{issuedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Verification URL:</span>
              <a
                href={window.location.href}
                className="text-primary-600 hover:underline font-semibold truncate ml-2"
              >
                Verify Here
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PRINT STYLES ===== */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CertificatePage;