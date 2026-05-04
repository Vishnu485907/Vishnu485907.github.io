import { cn } from "@/lib/utils";

type CredfixLogoProps = {
  className?: string;
};

export default function CredfixLogo({ className }: CredfixLogoProps) {
  return (
    <img
      src="/credfix-logo.svg"
      alt="Credfix"
      className={cn("h-8 w-auto shrink-0", className)}
    />
  );
}
