export interface PaletteColor {
  key: string;
  label: string;
  hex: string;
}

export const COLOR_PALETTE: PaletteColor[] = [
  { key: "bronze", label: "Bronce (por defecto)", hex: "#C89B5C" },
  { key: "sage", label: "Sage", hex: "#4FA88F" },
  { key: "amber", label: "Ámbar", hex: "#F0A94E" },
  { key: "rose", label: "Rosa", hex: "#E08B9E" },
  { key: "sky", label: "Celeste", hex: "#5EA8D9" },
  { key: "violet", label: "Violeta", hex: "#9C8CE0" },
  { key: "emerald", label: "Esmeralda", hex: "#4FBE85" },
  { key: "coral", label: "Coral", hex: "#E88B6D" },
  { key: "slate", label: "Grafito", hex: "#8B94A3" },
  { key: "gold", label: "Dorado", hex: "#D4B45A" },
];

export function colorHex(key: string): string {
  return COLOR_PALETTE.find((c) => c.key === key)?.hex ?? COLOR_PALETTE[0]!.hex;
}
