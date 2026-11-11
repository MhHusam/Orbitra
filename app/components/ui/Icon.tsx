const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export type IconName = "alert" | "chevron-down" | "check" | "calendar" | "refresh" | "wifi-off" | "x" | "arrow-left" | "arrow-right" | "zap" | "users" | "gauge" | "bell" | "database" | "clock";

export function Icon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  const url = `url(${basePath}/icons/${name}.svg)`;
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: size,
        height: size,
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
