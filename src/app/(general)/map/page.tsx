"use client";

import Map from "@/components/Map/Map";
import { useEffect, useState } from "react";
import { getApiEvents } from "@/services/eventApi";
import type { ApiEvent } from "@/types/event";

export default function MapView() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getApiEvents(
        {
          workload: [],
          form: [],
          location: [],
          dateFrom: undefined,
          dateTo: undefined,
        },
        "",
      );
      setEvents(data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Ładowanie mapy...</div>;
  }

  console.log(events);

  return (
    <div className="flex min-h-screen items-center justify-center p-10">
      {events.length > 0 && (
        <div className="h-[500px] w-full max-w-7xl rounded-lg border">
          <Map
            long={19.94}
            lat={50.05}
            markers={events.map((event: any) => ({
              long: event.metadata.Lon,
              lat: event.metadata.Lat,
              clickable: true,
              content: {
                name: event.metadata.Nazwa,
                date: event.metadata.data_rozpoczecia,
              },
              eventId: event.metadata.id,
            }))}
          />
        </div>
      )}
    </div>
  );
}
