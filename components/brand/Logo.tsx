import Link from "next/link";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
  className?: string;
}

const sizes = {
  sm: "h-9",
  md: "h-12",
  lg: "h-16",
};

export default function Logo({
  href = "/",
  size = "md",
  onDark = false,
  className = "",
}: LogoProps) {
  return (
    <Link href={href} aria-label="Ir al inicio" className="inline-flex items-center">
      <img
        src="/logo1.png"
        alt="Piscina La Familia"
        className={[
          sizes[size],
          "w-auto object-contain select-none transition-all duration-300",
          onDark ? "" : "brightness-0",
          className,
        ].join(" ")}
        draggable={false}
      />
    </Link>
  );
}
