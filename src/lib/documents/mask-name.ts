export type VisibilityMode = "full" | "masked" | "hidden";

export function maskClientName(name: string, mode: VisibilityMode): string {
  if (mode === "full") return name;
  if (mode === "hidden") return "Client";

  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.slice(0, 20) ?? "";
  const lastInitial = parts[1]?.slice(0, 1);
  return lastInitial ? `${first} ${lastInitial}.` : first;
}
