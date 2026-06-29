import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SignaturePad, type SignaturePadHandle } from "@/components/SignaturePad";
import { SplashScreen } from "@/components/SplashScreen";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

const DEFAULT_CONTRACT = `This Agreement is entered into on ${new Date().toLocaleDateString()} between the parties listed below.

1. Purpose. The parties agree to the terms and conditions described herein in good faith.

2. Obligations. Each party shall perform its respective obligations diligently and in accordance with applicable laws.

3. Term. This Agreement shall remain in effect until both parties have fulfilled their obligations or the Agreement is terminated by mutual written consent.

4. Confidentiality. Each party agrees to keep confidential all non-public information shared during the course of this Agreement.

5. Governing Law. This Agreement shall be governed by and construed in accordance with the applicable jurisdiction.

By signing below, the parties acknowledge they have read, understood, and agreed to the terms of this Agreement.`;

function Index() {
  const [title, setTitle] = useState("Service Agreement");
  const [body, setBody] = useState(DEFAULT_CONTRACT);
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("signify-splash");
    if (seen) setShowSplash(false);
    else sessionStorage.setItem("signify-splash", "1");
  }, []);

  const sigA = useRef<SignaturePadHandle>(null);
  const sigB = useRef<SignaturePadHandle>(null);

  const handleSave = () => {
    const sigAData = sigA.current?.getDataUrl();
    const sigBData = sigB.current?.getDataUrl();

    if (!sigAData || !sigBData) {
      toast.error("Both parties must sign before saving.");
      return;
    }
    if (!partyA.trim() || !partyB.trim()) {
      toast.error("Please enter both party names.");
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 56;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;

    // Title
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text(title || "Agreement", pageWidth / 2, margin + 10, { align: "center" });

    doc.setDrawColor(180);
    doc.line(margin, margin + 24, pageWidth - margin, margin + 24);

    // Body
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(body, contentWidth);
    let y = margin + 50;
    const lineHeight = 16;
    lines.forEach((ln: string) => {
      if (y > pageHeight - 220) {
        doc.addPage();
        y = margin;
      }
      doc.text(ln, margin, y);
      y += lineHeight;
    });

    // Signatures section
    if (y > pageHeight - 200) {
      doc.addPage();
      y = margin;
    }
    y += 30;
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text("Signatures", margin, y);
    y += 20;

    const sigBoxW = (contentWidth - 30) / 2;
    const sigBoxH = 80;

    const drawSig = (x: number, name: string, dataUrl: string) => {
      doc.addImage(dataUrl, "PNG", x, y, sigBoxW, sigBoxH);
      doc.setDrawColor(40);
      doc.line(x, y + sigBoxH + 4, x + sigBoxW, y + sigBoxH + 4);
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.text(name, x, y + sigBoxH + 18);
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Signed on ${new Date().toLocaleDateString()}`, x, y + sigBoxH + 32);
      doc.setTextColor(0);
    };

    drawSig(margin, partyA, sigAData);
    drawSig(margin + sigBoxW + 30, partyB, sigBData);

    const filename = `${(title || "agreement").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`;
    doc.save(filename);
    toast.success("Contract saved as PDF");
  };

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <div className="min-h-screen bg-background">
        <Toaster position="top-center" richColors />

        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-serif text-xl">
                S
              </div>
              <div>
                <h1 className="text-base sm:text-lg leading-none font-serif">Signify</h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Contracts, signed.</p>
              </div>
            </div>
            <Button onClick={handleSave} size="sm" className="gap-2">
              Save PDF
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl font-serif">Draft your agreement</h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Write your contract, have both parties sign, then export a clean PDF.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 sm:p-8 shadow-paper">
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 border-0 border-b border-border rounded-none px-0 text-xl sm:text-2xl font-serif shadow-none focus-visible:ring-0 focus-visible:border-foreground"
                  placeholder="Agreement title"
                />
              </div>

              <div>
                <Label htmlFor="body" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Contract terms
                </Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="mt-2 min-h-[260px] sm:min-h-[340px] font-serif text-sm sm:text-base leading-relaxed"
                  placeholder="Write the contract terms..."
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-border">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="partyA" className="text-xs uppercase tracking-wider text-muted-foreground">
                      Party A — Full name
                    </Label>
                    <Input
                      id="partyA"
                      value={partyA}
                      onChange={(e) => setPartyA(e.target.value)}
                      className="mt-2"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <SignaturePad ref={sigA} label="Party A signature" />
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="partyB" className="text-xs uppercase tracking-wider text-muted-foreground">
                      Party B — Full name
                    </Label>
                    <Input
                      id="partyB"
                      value={partyB}
                      onChange={(e) => setPartyB(e.target.value)}
                      className="mt-2"
                      placeholder="John Smith"
                    />
                  </div>
                  <SignaturePad ref={sigB} label="Party B signature" />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                <Button size="lg" onClick={handleSave} className="w-full sm:w-auto">
                  Save signed contract as PDF
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Signatures are captured on your device and embedded directly into the exported PDF.
          </p>

          <footer className="mt-10 border-t border-border pt-6 pb-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Created by <span className="font-semibold text-foreground">IMMINENTX STUDIOS</span>
            </p>
            <a
              href="mailto:Victorbautala@gmail.com"
              className="mt-2 inline-block text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Victorbautala@gmail.com
            </a>
          </footer>
        </main>
      </div>
    </>
  );
}
