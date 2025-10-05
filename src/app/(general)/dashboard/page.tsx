"use client";

import type { EventFiltersState } from "@/components/events/EventsFilters";
import { columns, type ApplicationInfo } from "@/components/list/columns";
import DataTable from "@/components/list/data-table";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { getApiEvents } from "@/services/eventApi";
import type { ApiEvent } from "@/types/event";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const {
    data: applications,
    isLoading,
    error,
  } = api.applications.getForCompany.useQuery();

  console.log("Apps:", applications);

  const [filters, setFilters] = useState<EventFiltersState>({
    workload: [],
    form: [],
    location: [],
    dateFrom: undefined,
    dateTo: undefined,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [applicationInfos, setApplicationInfos] = useState<ApplicationInfo[]>(
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const apiEvents = await getApiEvents(filters, "");

      console.log(apiEvents, applications);

      if (applications && apiEvents) {
        // Tworzymy mapę eventów po ID dla szybkiego dostępu
        const eventMap = new Map(apiEvents.map((e) => [e.id, e]));

        // Mapujemy aplikacje na ApplicationInfo
        const enrichedApplications: ApplicationInfo[] = applications.map(
          (app) => {
            const event = eventMap.get(app.externalEventId);
            return {
              ...app,
              volunteerName: (app.volunteerName as string) ?? null,
              eventName: event?.metadata.Nazwa ?? app.eventTitle ?? null,
              eventTitle: event?.metadata.Nazwa ?? app.eventTitle ?? null,
              eventDate: new Date(event?.metadata.Data_rozpoczecia!) ?? null,
              eventSyncStatus: event ? "synced" : "error",
            };
          },
        );

        console.log(enrichedApplications);

        setApplicationInfos(enrichedApplications);
      } else {
        setApplicationInfos([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [filters, applications]);

  if (isLoading || loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="flex min-h-[400px] items-center justify-center text-center text-red-600">
          <p>Błąd podczas ładowania aplikacji: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full px-4 py-10 sm:max-w-2xl md:max-w-3xl lg:max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">
            Panel zarządzania aplikacjami
          </h1>
          <Link
            href="/dashboard/events/new"
            className="inline-block hover:cursor-pointer"
          >
            <Button>Utwórz nowe wydarzenie</Button>
          </Link>
        </div>
        <p className="text-muted-foreground mt-2">
          Zarządzaj aplikacjami wolontariuszy na Twoje wydarzenia
        </p>
      </div>
      <div className="w-full">
        <DataTable columns={columns} data={applicationInfos ?? []} />
      </div>
    </div>
  );
}
