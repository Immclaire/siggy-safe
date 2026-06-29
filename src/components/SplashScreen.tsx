import { useEffect, useState } from "react";

const NAME = "Signify";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 4400);
    const t2 = setTimeout(onDone, 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--accent)_0%,_transparent_60%)] opacity-40" />
      <div className="relative flex flex-col items-center">
        <div className="flex font-serif text-7xl md:text-9xl tracking-tight text-foreground">
          {NAME.split("").map((ch, i) => (
            <span
              key={i}
              className="inline-block opacity-0 animate-[splash-letter_700ms_ease-out_forwards]"
              style={{ animationDelay: `${i * 180}ms` }}
            >
              {ch}
            </span>
          ))}
        </div>
        <div
          className="mt-6 h-px w-0 bg-foreground/40 animate-[splash-line_900ms_ease-out_forwards]"
          style={{ animationDelay: `${NAME.length * 180 + 200}ms` }}
        />
        <p
          className="mt-4 text-xs uppercase tracking-[0.4em] text-muted-foreground opacity-0 animate-[splash-fade_600ms_ease-out_forwards]"
          style={{ animationDelay: `${NAME.length * 180 + 400}ms` }}
        >
          Contracts, signed.
        </p>
      </div>
    </div>
  );
}
