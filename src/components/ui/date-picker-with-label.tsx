"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

type Props = {
  label: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  className?: string;
  icon?: React.ElementType;
};

export function DatePickerWithLabel({
  label,
  value,
  onChange,
  className,
  icon: Icon,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-h-10 w-full justify-start text-left font-normal"
          >
            <div className="flex w-full items-center gap-x-2">
              {Icon && (
                <Icon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
              )}
              <div className="flex min-w-0 flex-grow items-center">
                {value ? (
                  format(value, "PPP", { locale: pl })
                ) : (
                  <span className="text-muted-foreground">{label}</span>
                )}
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
