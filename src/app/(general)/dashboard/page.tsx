"use client";

import { columns } from "@/components/list/columns";
import DataTable from "@/components/list/data-table";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import Link from "next/link";

export default function DashboardPage() {
  const {
    data: applications,
    isLoading,
    error,
  } = api.applications.getForCompany.useQuery({});

  if (isLoading) {
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
        <DataTable columns={columns} data={applications ?? []} />
      </div>
    </div>
  );
}
