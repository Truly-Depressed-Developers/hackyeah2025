"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Ban, Check, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { api } from "@/trpc/react";

export type ApplicationInfo = {
  id: number;
  volunteerId: number;
  eventId: number | null;
  externalEventId: string;
  eventTitle: string | null;
  companyName: string | null;
  message: string | null;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  volunteerName: string | null;
  volunteerEmail: string | null;
  // From JOIN with events table
  eventName: string | null;
  eventDate: Date | null;
  eventSyncStatus: "pending" | "synced" | "error" | null;
};

export const columns: ColumnDef<ApplicationInfo>[] = [
  {
    accessorKey: "volunteerName",
    header: "Imię i Nazwisko",
    cell: ({ row }) => {
      const name = row.getValue("volunteerName");
      return name ?? "Nieznany";
    },
  },
  {
    accessorKey: "volunteerEmail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "eventName", // Add eventName as accessor
    id: "event",
    header: "Wydarzenie",
    cell: ({ row }) => {
      const localEventName = row.getValue("eventName");
      const storedTitle = row.original.eventTitle;
      const syncStatus = row.original.eventSyncStatus;

      const eventName =
        (typeof localEventName === "string" ? localEventName : null) ??
        storedTitle ??
        "Nieznane wydarzenie";

      return (
        <div className="flex flex-col">
          <span>{eventName}</span>
          {syncStatus === "pending" && (
            <span className="text-xs text-orange-600">⏳ Oczekuje synch.</span>
          )}
          {syncStatus === "error" && (
            <span className="text-xs text-red-600">❌ Błąd synch.</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const statusConfig = {
        pending: {
          label: "Oczekuje",
          variant: "secondary" as const,
          icon: Clock,
        },
        accepted: {
          label: "Zaakceptowana",
          variant: "default" as const,
          icon: Check,
        },
        rejected: {
          label: "Odrzucona",
          variant: "destructive" as const,
          icon: Ban,
        },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      const Icon = config.icon;

      return (
        <Badge variant={config.variant} className="flex items-center gap-1">
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Akcje",
    cell: ({ row }) => {
      const application = row.original;
      const utils = api.useUtils();

      const updateStatus = api.applications.updateStatus.useMutation({
        onSuccess: () => {
          console.log("Status aplikacji został zaktualizowany");
          void utils.applications.getForCompany.invalidate();
        },
        onError: (error) => {
          console.error("Błąd przy aktualizacji statusu:", error.message);
        },
      });

      const handleAccept = () => {
        updateStatus.mutate({
          applicationId: application.id,
          status: "accepted",
        });
      };

      const handleReject = () => {
        updateStatus.mutate({
          applicationId: application.id,
          status: "rejected",
        });
      };

      if (application.status !== "pending") {
        return (
          <span className="text-muted-foreground text-sm">Rozstrzygnięta</span>
        );
      }

      return (
        <div className="flex justify-end gap-1">
          <Button
            variant="default"
            className="h-8 w-8 bg-green-700 p-0 hover:bg-green-800"
            onClick={handleAccept}
            disabled={updateStatus.isPending}
            title="Zaakceptuj aplikację"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            className="h-8 w-8 bg-red-700 p-0 hover:bg-red-800"
            onClick={handleReject}
            disabled={updateStatus.isPending}
            title="Odrzuć aplikację"
          >
            <Ban className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
