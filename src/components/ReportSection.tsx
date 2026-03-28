import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_ct9pj8n";
const EMAILJS_TEMPLATE_ID = "template_wxlnw6a";
const EMAILJS_PUBLIC_KEY = "Qk1xZVDwMNEmG_K4Y";

interface ReportSectionProps {
  pdfUrl: string | null;
  pdfBlob: Blob | null;
}

const ReportSection = ({ pdfUrl, pdfBlob }: ReportSectionProps) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (!pdfBlob) {
      toast.error("PDF not available.");
      return;
    }
    setDownloading(true);
    try {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "match_report.pdf";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report download started!");
    } catch {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          pdf_link: pdfUrl ?? "",
        },
        EMAILJS_PUBLIC_KEY
      );
      setSent(true);
      toast.success("Report sent to your email!", {
        description: `We've sent the analysis link to ${email}`,
      });
    } catch (err: any) {
      console.error("EmailJS error:", err);
      toast.error(`Email error: ${err?.text || err?.message || JSON.stringify(err)}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            <FileText className="w-8 h-8 text-primary" />
          </motion.div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Your Report is Ready
          </h2>
          <p className="text-muted-foreground font-body">
            Download it or get it delivered to your inbox.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Download Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass-card rounded-2xl p-6 flex flex-col items-center text-center hover:card-shadow-hover transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl accent-gradient flex items-center justify-center mb-4">
              <Download className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              Download PDF
            </h3>
            <p className="text-muted-foreground text-sm font-body mb-5">
              Get the full analysis report as a downloadable PDF file.
            </p>
            <Button
              onClick={handleDownload}
              disabled={!pdfBlob || downloading}
              className="w-full accent-gradient text-accent-foreground hover:opacity-90 transition-opacity font-display"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {downloading ? "Downloading..." : "Download Report"}
            </Button>
          </motion.div>

          {/* Email Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="glass-card rounded-2xl p-6 flex flex-col items-center text-center hover:card-shadow-hover transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              Email Report
            </h3>
            <p className="text-muted-foreground text-sm font-body mb-5">
              We'll send the PDF report directly to your email address.
            </p>
            <form onSubmit={handleEmailSubmit} className="w-full space-y-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={sent}
                className="font-body"
              />
              <Button
                type="submit"
                variant="outline"
                disabled={!email.trim() || sending || sent}
                className="w-full font-display border-primary/30 hover:bg-primary/5 text-foreground"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : sent ? (
                  <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                {sent ? "Sent!" : sending ? "Sending..." : "Send to Email"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReportSection;