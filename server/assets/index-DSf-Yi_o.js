import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { forwardRef, useRef, useImperativeHandle, useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LabelPrimitive from "@radix-ui/react-label";
import SignatureCanvas from "react-signature-canvas";
import { Toaster, toast } from "sonner";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = LabelPrimitive.Root.displayName;
const SignaturePad = forwardRef(
  ({ label = "Sign here" }, ref) => {
    const sigRef = useRef(null);
    useImperativeHandle(ref, () => ({
      getDataUrl: () => {
        if (!sigRef.current || sigRef.current.isEmpty()) return null;
        return sigRef.current.getCanvas().toDataURL("image/png");
      },
      clear: () => sigRef.current?.clear(),
      isEmpty: () => sigRef.current?.isEmpty() ?? true
    }));
    return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            onClick: () => sigRef.current?.clear(),
            className: "h-7 text-xs",
            children: "Clear"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "rounded-md border border-dashed border-border bg-card shadow-paper", children: /* @__PURE__ */ jsx(
        SignatureCanvas,
        {
          ref: sigRef,
          penColor: "#0a1f3a",
          canvasProps: {
            className: "w-full h-40 rounded-md"
          }
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "border-t border-foreground/40 pt-1", children: /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground italic", children: "x — signature" }) })
    ] });
  }
);
SignaturePad.displayName = "SignaturePad";
const NAME = "Signify";
function SplashScreen({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 4400);
    const t2 = setTimeout(onDone, 5e3);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${leaving ? "opacity-0" : "opacity-100"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--accent)_0%,_transparent_60%)] opacity-40" }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex font-serif text-7xl md:text-9xl tracking-tight text-foreground", children: NAME.split("").map((ch, i) => /* @__PURE__ */ jsx(
            "span",
            {
              className: "inline-block opacity-0 animate-[splash-letter_700ms_ease-out_forwards]",
              style: { animationDelay: `${i * 180}ms` },
              children: ch
            },
            i
          )) }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "mt-6 h-px w-0 bg-foreground/40 animate-[splash-line_900ms_ease-out_forwards]",
              style: { animationDelay: `${NAME.length * 180 + 200}ms` }
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "mt-4 text-xs uppercase tracking-[0.4em] text-muted-foreground opacity-0 animate-[splash-fade_600ms_ease-out_forwards]",
              style: { animationDelay: `${NAME.length * 180 + 400}ms` },
              children: "Contracts, signed."
            }
          )
        ] })
      ]
    }
  );
}
const DEFAULT_CONTRACT = `This Agreement is entered into on ${(/* @__PURE__ */ new Date()).toLocaleDateString()} between the parties listed below.

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
  const sigA = useRef(null);
  const sigB = useRef(null);
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
    const doc = new jsPDF({
      unit: "pt",
      format: "letter"
    });
    const margin = 56;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - margin * 2;
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text(title || "Agreement", pageWidth / 2, margin + 10, {
      align: "center"
    });
    doc.setDrawColor(180);
    doc.line(margin, margin + 24, pageWidth - margin, margin + 24);
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(body, contentWidth);
    let y = margin + 50;
    const lineHeight = 16;
    lines.forEach((ln) => {
      if (y > pageHeight - 220) {
        doc.addPage();
        y = margin;
      }
      doc.text(ln, margin, y);
      y += lineHeight;
    });
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
    const drawSig = (x, name, dataUrl) => {
      doc.addImage(dataUrl, "PNG", x, y, sigBoxW, sigBoxH);
      doc.setDrawColor(40);
      doc.line(x, y + sigBoxH + 4, x + sigBoxW, y + sigBoxH + 4);
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.text(name, x, y + sigBoxH + 18);
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Signed on ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`, x, y + sigBoxH + 32);
      doc.setTextColor(0);
    };
    drawSig(margin, partyA, sigAData);
    drawSig(margin + sigBoxW + 30, partyB, sigBData);
    const filename = `${(title || "agreement").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`;
    doc.save(filename);
    toast.success("Contract saved as PDF");
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    showSplash && /* @__PURE__ */ jsx(SplashScreen, { onDone: () => setShowSplash(false) }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx(Toaster, { position: "top-center", richColors: true }),
      /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-serif text-xl", children: "S" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-base sm:text-lg leading-none font-serif", children: "Signify" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "Contracts, signed." })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Button, { onClick: handleSave, size: "sm", className: "gap-2", children: "Save PDF" })
      ] }) }),
      /* @__PURE__ */ jsxs("main", { className: "mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-6 sm:mb-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-serif", children: "Draft your agreement" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm sm:text-base text-muted-foreground", children: "Write your contract, have both parties sign, then export a clean PDF." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-border bg-card p-4 sm:p-8 shadow-paper", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "title", className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Title" }),
            /* @__PURE__ */ jsx(Input, { id: "title", value: title, onChange: (e) => setTitle(e.target.value), className: "mt-2 border-0 border-b border-border rounded-none px-0 text-xl sm:text-2xl font-serif shadow-none focus-visible:ring-0 focus-visible:border-foreground", placeholder: "Agreement title" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "body", className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Contract terms" }),
            /* @__PURE__ */ jsx(Textarea, { id: "body", value: body, onChange: (e) => setBody(e.target.value), className: "mt-2 min-h-[260px] sm:min-h-[340px] font-serif text-sm sm:text-base leading-relaxed", placeholder: "Write the contract terms..." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-2 pt-4 border-t border-border", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "partyA", className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Party A — Full name" }),
                /* @__PURE__ */ jsx(Input, { id: "partyA", value: partyA, onChange: (e) => setPartyA(e.target.value), className: "mt-2", placeholder: "Jane Doe" })
              ] }),
              /* @__PURE__ */ jsx(SignaturePad, { ref: sigA, label: "Party A signature" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "partyB", className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Party B — Full name" }),
                /* @__PURE__ */ jsx(Input, { id: "partyB", value: partyB, onChange: (e) => setPartyB(e.target.value), className: "mt-2", placeholder: "John Smith" })
              ] }),
              /* @__PURE__ */ jsx(SignaturePad, { ref: sigB, label: "Party B signature" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4", children: /* @__PURE__ */ jsx(Button, { size: "lg", onClick: handleSave, className: "w-full sm:w-auto", children: "Save signed contract as PDF" }) })
        ] }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-center text-xs text-muted-foreground", children: "Signatures are captured on your device and embedded directly into the exported PDF." }),
        /* @__PURE__ */ jsxs("footer", { className: "mt-10 border-t border-border pt-6 pb-4 text-center", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-xs uppercase tracking-[0.3em] text-muted-foreground", children: [
            "Created by ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: "IMMINENTX STUDIOS" })
          ] }),
          /* @__PURE__ */ jsx("a", { href: "mailto:Victorbautala@gmail.com", className: "mt-2 inline-block text-xs text-muted-foreground hover:text-foreground transition-colors", children: "Victorbautala@gmail.com" })
        ] })
      ] })
    ] })
  ] });
}
export {
  Index as component
};
