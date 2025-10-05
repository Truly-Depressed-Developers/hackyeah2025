"use client";

import { useState, useEffect } from "react";
import MultiSelectFilter from "./MultiSelectFilter";
import { LayoutGrid, MapPin, Clock, Calendar } from "lucide-react";
import {
  FORM_OPTIONS,
  LOCATION_OPTIONS,
  WORKLOAD_OPTIONS,
} from "./filters.constatnts";
import { DatePickerWithLabel } from "../ui/date-picker-with-label";

export type EventFiltersState = {
  workload: string[];
  form: string[];
  location: string[];
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
};

type Props = {
  onFilterChange: (filters: EventFiltersState) => void;
};

export default function EventsFilters({ onFilterChange }: Props) {
  const [workload, setWorkload] = useState<string[]>([]);
  const [form, setForm] = useState<string[]>([]);
  const [location, setLocation] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  useEffect(() => {
    onFilterChange({ workload, form, location, dateFrom, dateTo });
  }, [workload, form, location, dateFrom, dateTo, onFilterChange]);

  return (
    <div className="bg-card flex w-full flex-wrap items-start gap-4 rounded-md border-b pb-6">
      <MultiSelectFilter
        className="min-h-10 min-w-[200px] flex-1"
        icon={LayoutGrid}
        label="Obszar inicjatyw"
        options={FORM_OPTIONS}
        value={form}
        onChange={setForm}
        maxTags={1}
      />
      <MultiSelectFilter
        className="min-h-10 min-w-[200px] flex-1"
        icon={MapPin}
        label="Lokalizacja"
        options={LOCATION_OPTIONS}
        value={location}
        onChange={setLocation}
      />
      <DatePickerWithLabel
        className="min-h-10 min-w-[200px] flex-1"
        icon={Calendar}
        label="Data od"
        value={dateFrom}
        onChange={setDateFrom}
      />
      <DatePickerWithLabel
        className="min-h-10 min-w-[200px] flex-1"
        icon={Calendar}
        label="Data do"
        value={dateTo}
        onChange={setDateTo}
      />
      <MultiSelectFilter
        className="min-h-10 min-w-[200px] flex-1"
        icon={Clock}
        label="Nakład pracy"
        options={WORKLOAD_OPTIONS}
        value={workload}
        onChange={setWorkload}
        maxTags={1}
      />
    </div>
  );
}
