export type Tag =
  | "Rynek mieszkaniowy"
  | "Zieleń i klimat"
  | "Jakość powietrza"
  | "Potrzeby kierowców"
  | "Potrzeby rowerzystów"
  | "Potrzeby pieszych"
  | "Komunikacja miejska"
  | "Edukacja"
  | "Zdrowie"
  | "Oferta społeczno-kulturalna miasta"
  | "Zwierzęta"
  | "Seniorzy i seniorki"
  | "Transparentność działań urzędów"
  | "Usługi komunalne (np. woda, śmieci)";

export type Workload =
  | "Mini - Zaangażowanie do 1 godziny tygodniowo"
  | "Lekkie - Zaangażowanie 1-4 godziny tygodniowo"
  | "Umiarkowane - Zaangażowanie 4-8 godzin tygodniowo"
  | "Pełne - Zaangażowanie ponad 8 godzin tygodniowo";

export type Form =
  | "Zostań aktywistą online"
  | "Dbaj o potrzeby dzielnicy"
  | "Weź udział w akcjach bezpośrednich"
  | "Spotkaj się z mieszkańcami"
  | "Zaangażuj się w obywatelską kontrolę"
  | "Wesprzyj pogotowie obywatelskie";

export interface ApiEvent {
  id: string;
  document: string;
  metadata: {
    Data_rozpoczecia: string;
    Data_zakonczenia: string;
    Lat: string;
    Lokalizacja: string;
    Lon: string;
    Nazwa: string;
    Nazwa_organizatora: string;
    Preferowana_forma_dzialalnosci: string;
    Tags: string;
    Thumbnail: string;
    Wymagania_nakladu_pracy: string;
  };
}

export interface ApiResponse {
  count: number;
  results: ApiEvent[];
}
