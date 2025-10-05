"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  Briefcase,
  Tag as TagIcon,
  ReceiptPoundSterling,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import type { ApiEvent } from "@/types/event";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type EventTileProps = {
  data: ApiEvent;
};

const InfoLine = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}) => {
  if (!value) return null;

  return (
    <div className="text-muted-foreground flex items-center gap-x-3 text-sm">
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span>
        <span className="text-foreground font-semibold">{label}:</span> {value}
      </span>
    </div>
  );
};

export default function EventTile({ data }: EventTileProps) {
  const formattedStartDate = data.metadata.Data_rozpoczecia
    ? format(data.metadata.Data_rozpoczecia, "dd.MM.yyyy")
    : "Brak daty";
  const formattedEndDate = data.metadata.Data_zakonczenia
    ? format(data.metadata.Data_zakonczenia, "dd.MM.yyyy")
    : "";
  const duration = formattedEndDate
    ? `${formattedStartDate} - ${formattedEndDate}`
    : formattedStartDate;

  const router = useRouter();

  const signInForEvent = api.event.signUpForEvent.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
      toast.success("Pomyślnie zapisano na wydarzenie");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Nie udało się zapisać na wydarzenie");
    },
  });

  const handleParticipateIn = (id: string) => {
    console.log(`User wants to participate in event with ID: ${id}`);

    signInForEvent.mutate({ eventId: id });
  };

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden rounded-lg border p-4 shadow-sm">
      <div className="relative h-48 w-full overflow-hidden rounded-md">
        {data.metadata.Thumbnail && (
          <Image
            src={data.metadata.Thumbnail}
            alt={`Zdjęcie wydarzenia: ${data.metadata.Nazwa}`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <CardContent className="flex w-full flex-1 flex-col p-0">
        <h3 className="text-xl leading-tight font-bold">
          {data.metadata.Nazwa}
        </h3>

        <div className="mt-4 flex flex-col gap-y-2 pb-4">
          <InfoLine
            icon={User}
            label="Organizator"
            value={data.metadata.Nazwa_organizatora}
          />
          <InfoLine icon={Calendar} label="Czas trwania" value={duration} />
          <InfoLine
            icon={Briefcase}
            label="Nakład pracy"
            value={data.metadata.Wymagania_nakladu_pracy}
          />
          <InfoLine
            icon={TagIcon}
            label="Forma działalności"
            value={data.metadata.Preferowana_forma_dzialalnosci}
          />
        </div>

        {data.metadata.Tags && data.metadata.Tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {data.metadata.Tags.split(",").map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto border-t pt-4">
          <Button
            className="w-full"
            onClick={() => handleParticipateIn(data.id)}
          >
            Zgłoś się
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
