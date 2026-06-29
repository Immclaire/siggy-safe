import { useRef, useImperativeHandle, forwardRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";

export type SignaturePadHandle = {
  getDataUrl: () => string | null;
  clear: () => void;
  isEmpty: () => boolean;
};

export const SignaturePad = forwardRef<SignaturePadHandle, { label?: string }>(
  ({ label = "Sign here" }, ref) => {
    const sigRef = useRef<SignatureCanvas>(null);

    useImperativeHandle(ref, () => ({
      getDataUrl: () => {
        if (!sigRef.current || sigRef.current.isEmpty()) return null;
        return sigRef.current.getCanvas().toDataURL("image/png");
      },
      clear: () => sigRef.current?.clear(),
      isEmpty: () => sigRef.current?.isEmpty() ?? true,
    }));

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => sigRef.current?.clear()}
            className="h-7 text-xs"
          >
            Clear
          </Button>
        </div>
        <div className="rounded-md border border-dashed border-border bg-card shadow-paper">
          <SignatureCanvas
            ref={sigRef}
            penColor="#0a1f3a"
            canvasProps={{
              className: "w-full h-40 rounded-md",
            }}
          />
        </div>
        <div className="border-t border-foreground/40 pt-1">
          <span className="text-xs text-muted-foreground italic">x — signature</span>
        </div>
      </div>
    );
  }
);
SignaturePad.displayName = "SignaturePad";
