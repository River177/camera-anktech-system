import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      position="top-center"
      closeButton
      duration={2400}
      className="toaster group"
      toastOptions={{
        className:
          "pointer-events-auto bg-slate-900/90 text-slate-50 border border-slate-700 shadow-[0_20px_45px_rgba(15,23,42,0.55)] backdrop-blur-xl rounded-lg",
        descriptionClassName: "text-slate-300",
        classNames: {
          toast: "px-4 py-3",
          title: "text-sm font-semibold tracking-wide text-white",
          description: "text-xs text-slate-300",
          actionButton: "bg-cyan-400 text-slate-900 font-semibold px-3 py-1 rounded-md",
          cancelButton: "text-slate-200 hover:text-white",
          closeButton: "text-slate-400 hover:text-white transition-colors",
          success:
            "bg-emerald-600/90 text-white border border-emerald-300 shadow-[0_15px_35px_rgba(16,185,129,0.45)]",
          error:
            "bg-rose-600/90 text-white border border-rose-200 shadow-[0_15px_35px_rgba(244,63,94,0.45)]",
          warning:
            "bg-amber-500/90 text-slate-950 border border-amber-200 shadow-[0_15px_35px_rgba(251,191,36,0.45)]"
        }
      }}
      {...props}
    />
  );
};

export { Toaster };
