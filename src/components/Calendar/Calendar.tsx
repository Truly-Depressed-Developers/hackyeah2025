"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarDialog } from "./CalendarDialog";
import { set } from "zod";

export const events = [
  {
    id: 1,
    name: "Sprzątanie Parku Skaryszewskiego",
    description:
      "Dołącz do lokalnej inicjatywy sprzątania parku. Wspólnie zadbamy o naszą przestrzeń publiczną i poznamy sąsiadów.",
    organizerName: "Fundacja Czysta Warszawa",
    tags: ["ekologia", "społeczność", "sprzątanie"],
    thumbnail:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800",
    latitude: 52.2447,
    longitude: 21.0603,
    startDate: new Date("2025-10-12T10:00:00Z"),
    endDate: new Date("2025-10-12T13:00:00Z"),
    workload: ["Lekkie", "Umiarkowane"],
    form: ["Weź udział w akcjach bezpośrednich", "Spotkaj się z mieszkańcami"],
    createdById: "user_123",
    createdAt: new Date("2025-09-20T12:00:00Z"),
    updatedAt: new Date("2025-09-25T14:30:00Z"),
  },
  {
    id: 2,
    name: "Warsztaty cyfrowego aktywizmu",
    description:
      "Dowiedz się, jak skutecznie prowadzić kampanie społeczne online. Warsztaty prowadzone przez doświadczonych aktywistów.",
    organizerName: "Tech4Good Polska",
    tags: ["technologia", "aktywizm", "online"],
    thumbnail:
      "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=800",
    latitude: 52.2297,
    longitude: 21.0122,
    startDate: new Date("2025-10-15T17:00:00Z"),
    endDate: new Date("2025-10-15T19:30:00Z"),
    workload: ["Mini", "Lekkie"],
    form: ["Zostań aktywistą online"],
    createdById: "user_124",
    createdAt: new Date("2025-09-23T09:00:00Z"),
    updatedAt: new Date("2025-09-23T09:00:00Z"),
  },
  {
    id: 3,
    name: "Spotkanie mieszkańców Pragi",
    description:
      "Nieformalne spotkanie mieszkańców dzielnicy w kawiarni, poświęcone poprawie bezpieczeństwa i integracji społecznej.",
    organizerName: "Rada Osiedla Praga-Południe",
    tags: ["społeczność", "bezpieczeństwo", "dyskusja"],
    thumbnail:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800",
    latitude: 52.2439,
    longitude: 21.0676,
    startDate: new Date("2025-10-09T18:00:00Z"),
    endDate: new Date("2025-10-09T20:00:00Z"),
    workload: ["Mini"],
    form: ["Spotkaj się z mieszkańcami", "Dbaj o potrzeby dzielnicy"],
    createdById: "user_125",
    createdAt: new Date("2025-09-22T11:15:00Z"),
    updatedAt: new Date("2025-09-27T10:00:00Z"),
  },
  {
    id: 4,
    name: "Kontrola obywatelska – monitoring budżetu miasta",
    description:
      "Szkolenie z analizy dokumentów finansowych miasta oraz metod monitorowania wydatków publicznych.",
    organizerName: "Watchdog Polska",
    tags: ["transparentność", "obywatelskość", "prawo"],
    thumbnail:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800",
    latitude: 52.4064,
    longitude: 16.9252,
    startDate: new Date("2025-10-20T16:00:00Z"),
    endDate: new Date("2025-10-20T19:00:00Z"),
    workload: ["Pełne"],
    form: ["Zaangażuj się w obywatelską kontrolę"],
    createdById: "user_126",
    createdAt: new Date("2025-09-28T14:00:00Z"),
    updatedAt: new Date("2025-09-28T14:00:00Z"),
  },
  {
    id: 5,
    name: "Pogotowie obywatelskie – konsultacje prawne",
    description:
      "Bezpłatne konsultacje z prawnikami dla mieszkańców w sprawach obywatelskich i społecznych.",
    organizerName: "Fundacja Obywatelska Pomoc",
    tags: ["prawo", "pomoc", "obywatelskość"],
    thumbnail:
      "https://images.unsplash.com/photo-1588776814546-ec7d3b2f95c0?q=80&w=800",
    latitude: 50.0614,
    longitude: 19.9366,
    startDate: new Date("2025-10-25T10:00:00Z"),
    endDate: new Date("2025-10-25T15:00:00Z"),
    workload: ["Umiarkowane", "Pełne"],
    form: ["Wesprzyj pogotowie obywatelskie"],
    createdById: "user_127",
    createdAt: new Date("2025-09-29T10:00:00Z"),
    updatedAt: new Date("2025-10-01T09:00:00Z"),
  },
];

type EventType = {
  dateStr: string;
};

export default function Calendar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventData, setEventData] = useState<{
    eventName: string;
    description: string;
  } | null>(null);

  //@ts-ignore
  const handleDateClick = (info) => {
    setEventData({
      eventName: info.event.title,
      description: info.event.extendedProps.description,
    });
    setIsDialogOpen(true);
  };
  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          id: String(event.id),
          title: event.name,
          description: event.description,
          start: event.startDate,
          end: event.endDate,
          resourceId: event.id,
        }))}
        height="auto"
        eventClick={handleDateClick}
      />
      <CalendarDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        eventName={eventData?.eventName || ""}
        description={eventData?.description || ""}
      />
    </>
  );
}
