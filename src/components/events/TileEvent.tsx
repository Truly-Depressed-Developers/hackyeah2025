"use client";

import type { InferSelectModel } from "drizzle-orm";
import { events } from "../../server/db/schema";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Calendar, Briefcase, Tag as TagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

export type Event = InferSelectModel<typeof events>;

type EventTileProps = {
  data: Event;
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
  console.log(data.thumbnail);

  data.thumbnail = "/cracow.jpg";

  const formattedStartDate = data.startDate
    ? format(data.startDate, "dd.MM.yyyy")
    : "Brak daty";
  const formattedEndDate = data.endDate
    ? format(data.endDate, "dd.MM.yyyy")
    : "";
  const duration = formattedEndDate
    ? `${formattedStartDate} - ${formattedEndDate}`
    : formattedStartDate;

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden rounded-lg border p-4 shadow-sm">
      <div className="relative h-48 w-full overflow-hidden rounded-md">
        {data.thumbnail && (
          <Image
            // src={data.thumbnail}
            src={"/cracow.jpg"}
            alt={`Zdjęcie wydarzenia: ${data.name}`}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <CardContent className="flex w-full flex-1 flex-col p-0">
        <h3 className="text-xl leading-tight font-bold">{data.name}</h3>

        <div className="mt-4 flex flex-col gap-y-2 pb-4">
          <InfoLine
            icon={User}
            label="Organizator"
            value={data.organizerName}
          />
          <InfoLine icon={Calendar} label="Czas trwania" value={duration} />
          <InfoLine
            icon={Briefcase}
            label="Nakład pracy"
            value={data.workload?.join(", ")}
          />
          <InfoLine
            icon={TagIcon}
            label="Forma działalności"
            value={data.form?.join(", ")}
          />
        </div>

        {data.tags && data.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto border-t pt-4">
          <Button asChild className="w-full">
            <Link href={`/events/${data.id}`}>Zgłoś się</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
