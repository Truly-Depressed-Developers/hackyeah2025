"use client";

import { useState, useMemo } from "react";
import type { Event } from "./TileEvent";
import EventsFilters, { type EventFiltersState } from "./EventsFilters";
import EventTile from "./TileEvent";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  ArrowRightFromLine,
  SearchIcon,
  SlidersHorizontal,
} from "lucide-react";

type Props = {
  initialEvents: Event[];
};

export default function EventList({ initialEvents }: Props) {
  const [showFiltes, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<EventFiltersState>({
    workload: [],
    form: [],
    location: [],
    dateFrom: undefined,
    dateTo: undefined,
  });

  const handleToggleFilters = () => {
    setFilters({
      workload: [],
      form: [],
      location: [],
      dateFrom: undefined,
      dateTo: undefined,
    });
    setShowFilters(!showFiltes);
  };

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      const workloadMatch =
        filters.workload.length === 0 ||
        event.workload?.some((w) => filters.workload.includes(w));

      const formMatch =
        filters.form.length === 0 ||
        event.form?.some((f) => filters.form.includes(f));

      return workloadMatch && formMatch;
    });
  }, [initialEvents, filters]);

  return (
    <>
      <div className="flex w-full gap-x-2">
        <InputGroup>
          <InputGroupInput
            placeholder="Szukaj..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton>
              <ArrowRightFromLine />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <Button variant="outline" onClick={handleToggleFilters}>
          <SlidersHorizontal />
          Filtry
        </Button>
      </div>

      {showFiltes && <EventsFilters onFilterChange={setFilters} />}

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventTile key={event.id} data={event} />
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center">
            Nie znaleziono wydarzeń pasujących do filtrów.
          </p>
        )}
      </div>
    </>
  );
}
