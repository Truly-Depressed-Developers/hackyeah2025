import z from "zod";

export const volunteerRequestSchema = z.object({
  name: z.string().min(2, "Nazwa jest wymagana"),
  description: z.string().min(10, "Opis jest wymagany"),
  organizerName: z.string().min(2, "Nazwa organizatora jest wymagana"),
  tags: z.array(z.string()),
  thumbnail: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  workload: z.array(z.enum(["Mini", "Lekkie", "Umiarkowane", "Pełne"])),
  form: z.array(
    z.enum([
      "Zostań aktywistą online",
      "Dbaj o potrzeby dzielnicy",
      "Weź udział w akcjach bezpośrednich",
      "Spotkaj się z mieszkańcami",
      "Zaangażuj się w obywatelską kontrolę",
      "Wesprzyj pogotowie obywatelskie",
    ]),
  ),
});

export type VolunteerFormRequestSchema = z.infer<typeof volunteerRequestSchema>;

export const workloadOptions = [
  { value: "Mini", label: "Mini - Zaangażowanie do 1 godziny tygodniowo" },
  { value: "Lekkie", label: "Lekkie - Zaangażowanie 1-4 godziny tygodniowo" },
  {
    value: "Umiarkowane",
    label: "Umiarkowane - Zaangażowanie 4-8 godzin tygodniowo",
  },
  { value: "Pełne", label: "Pełne - Zaangażowanie ponad 8 godzin tygodniowo" },
] as const;

export const formOptions = [
  { value: "Zostań aktywistą online", label: "Zostań aktywistą online" },
  { value: "Dbaj o potrzeby dzielnicy", label: "Dbaj o potrzeby dzielnicy" },
  {
    value: "Weź udział w akcjach bezpośrednich",
    label: "Weź udział w akcjach bezpośrednich",
  },
  { value: "Spotkaj się z mieszkańcami", label: "Spotkaj się z mieszkańcami" },
  {
    value: "Zaangażuj się w obywatelską kontrolę",
    label: "Zaangażuj się w obywatelską kontrolę",
  },
  {
    value: "Wesprzyj pogotowie obywatelskie",
    label: "Wesprzyj pogotowie obywatelskie",
  },
] as const;

export const defaultTags = [
  { id: "rynek-mieszkaniowy", label: "Rynek mieszkaniowy" },
  { id: "zielen-klimat", label: "Zieleń i klimat" },
  { id: "jakosc-powietrza", label: "Jakość powietrza" },
  { id: "potrzeby-kierowcow", label: "Potrzeby kierowców" },
  { id: "potrzeby-rowerzystow", label: "Potrzeby rowerzystów" },
  { id: "potrzeby-pieszych", label: "Potrzeby pieszych" },
  { id: "komunikacja-miejska", label: "Komunikacja miejska" },
  { id: "edukacja", label: "Edukacja" },
  { id: "zdrowie", label: "Zdrowie" },
  {
    id: "oferta-spoleczno-kulturalna",
    label: "Oferta społeczno-kulturalna miasta",
  },
  { id: "zwierzeta", label: "Zwierzęta" },
  { id: "seniorzy", label: "Seniorzy i seniorki" },
  { id: "transparentnosc", label: "Transparentność działań urzędów" },
  { id: "uslugi-komunalne", label: "Usługi komunalne (np. woda, śmieci)" },
];
