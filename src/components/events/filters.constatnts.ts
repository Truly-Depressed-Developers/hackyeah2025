import type { FilterOption } from "./MultiSelectFilter";

export const WORKLOAD_OPTIONS: FilterOption[] = [
  {
    value: "Mini - Zaangażowanie do 1 godziny tygodniowo",
    label: "Mini (do 4h/msc)",
  },
  {
    value: "Lekkie - Zaangażowanie 1-4 godziny tygodniowo",
    label: "Lekkie (4-8h/msc)",
  },
  {
    value: "Umiarkowane - Zaangażowanie 4-8 godzin tygodniowo",
    label: "Umiarkowane (8-16h/msc)",
  },
  {
    value: "Pełne - Zaangażowanie ponad 8 godzin tygodniowo",
    label: "Pełne (16h+/msc)",
  },
];

export const FORM_OPTIONS: FilterOption[] = [
  { value: "Zostań aktywistą online", label: "Aktywizm online" },
  { value: "Dbaj o potrzeby dzielnicy", label: "Potrzeby dzielnicy" },
  { value: "Weź udział w akcjach bezpośrednich", label: "Akcje bezpośrednie" },
  { value: "Spotkaj się z mieszkańcami", label: "Spotkania z mieszkańcami" },
  {
    value: "Zaangażuj się w obywatelską kontrolę",
    label: "Kontrola obywatelska",
  },
  { value: "Wesprzyj pogotowie obywatelskie", label: "Pogotowie obywatelskie" },
];

export const LOCATION_OPTIONS: FilterOption[] = [
  { value: "Warszawa", label: "Warszawa" },
  { value: "Kraków", label: "Kraków" },
  { value: "Łódź", label: "Łódź" },
  { value: "Wrocław", label: "Wrocław" },
  { value: "Poznań", label: "Poznań" },
  { value: "Gdańsk", label: "Gdańsk" },
  { value: "Szczecin", label: "Szczecin" },
  { value: "Bydgoszcz", label: "Bydgoszcz" },
  { value: "Lublin", label: "Lublin" },
  { value: "Katowice", label: "Katowice" },
];
