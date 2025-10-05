"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { getApiEvents } from "@/services/eventApi";
import type { ApiEvent } from "@/types/event";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRightFromLine,
  SearchIcon,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Loading from "../Loading";
import EventsFilters, { type EventFiltersState } from "./EventsFilters";
import EventTile from "./TileEvent";

const EMPTY_FILTERS: EventFiltersState = {
  workload: [],
  form: [],
  location: [],
  dateFrom: undefined,
  dateTo: undefined,
};

export default function EventList() {
  const [showFilters, setShowFilters] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

  const [filters, setFilters] = useState<EventFiltersState>(EMPTY_FILTERS);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const prevShowFiltersRef = useRef<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getApiEvents(filters, appliedSearchTerm);
      setEvents(data);
      setIsLoading(false);
    };

    fetchData();
  }, [filters, appliedSearchTerm]);

  useEffect(() => {
    const prevShowFilters = prevShowFiltersRef.current;
    if (prevShowFilters === true && showFilters === false) {
      setFilters(EMPTY_FILTERS);
    }
    prevShowFiltersRef.current = showFilters;
  }, [showFilters]);

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <>
      <div className="flex w-full gap-x-2">
        <InputGroup>
          <InputGroupInput
            placeholder="Szukaj po nazwie, opisie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton onClick={handleSearch}>
              <ArrowRightFromLine />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtry
        </Button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            key="filters-panel"
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full overflow-hidden"
          >
            <EventsFilters onFilterChange={setFilters} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid w-full grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          <div className="col-span-full flex w-full justify-center">
            <Loading />
          </div>
        ) : events.length > 0 ? (
          events.map((event) => <EventTile key={event.id} data={event} />)
        ) : (
          <p className="text-muted-foreground col-span-full py-8 text-center">
            Nie znaleziono wydarzeń pasujących do kryteriów.
          </p>
        )}
      </div>
    </>
  );
}
