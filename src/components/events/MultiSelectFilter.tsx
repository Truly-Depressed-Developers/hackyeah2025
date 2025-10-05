"use client";

import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/ui/tags";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_TAGS = 2;

export type FilterOption = {
  value: string;
  label: string;
};

type Props = {
  icon?: React.ElementType;
  label: string;
  options: FilterOption[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  maxTags?: number;
};

export default function MultiSelectFilter({
  icon: Icon,
  label,
  options,
  value = [],
  onChange,
  className,
  maxTags = MAX_TAGS,
}: Props) {
  const handleRemove = (selectedValue: string) => {
    const newSelected = value.filter((v) => v !== selectedValue);
    onChange(newSelected);
  };

  const handleSelect = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      handleRemove(selectedValue);
      return;
    }
    const newSelected = [...value, selectedValue];
    onChange(newSelected);
  };

  return (
    <div className={className}>
      <Tags>
        <TagsTrigger label={value.length == 0 ? label : ""} className="w-full">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            {maxTags === 1
              ? value.length > 0 && (
                  <TagsValue
                    key={value[0]}
                    onRemove={() => handleRemove(value[0]!)}
                    className="max-w-[150px]"
                  >
                    <span className="truncate">
                      {options.find((opt) => opt.value === value[0])?.label ??
                        value[0]}
                    </span>
                  </TagsValue>
                )
              : value.slice(0, maxTags - 1).map((selectedValue) => (
                  <TagsValue
                    key={selectedValue}
                    onRemove={() => handleRemove(selectedValue)}
                    className="max-w-[150px]"
                  >
                    <span className="truncate">
                      {options.find((opt) => opt.value === selectedValue)
                        ?.label ?? selectedValue}
                    </span>
                  </TagsValue>
                ))}
          </div>
          {maxTags === 1 && value.length > 1 && (
            <TagsValue className="max-w-[150px]">
              <span className="truncate">+ {value.length - 1} więcej</span>
            </TagsValue>
          )}
          {maxTags > 1 && value.length > maxTags && (
            <TagsValue className="max-w-[150px]">
              <span className="truncate">
                + {value.length - maxTags + 1} więcej
              </span>
            </TagsValue>
          )}
          {maxTags > 1 && value.length === maxTags && value[maxTags - 1] && (
            <TagsValue
              key={value[maxTags - 1]}
              onRemove={() => handleRemove(value[maxTags - 1]!)}
              className="max-w-[150px]"
            >
              <span className="truncate">
                {options.find((opt) => opt.value === value[maxTags - 1])
                  ?.label ?? value[maxTags - 1]}
              </span>
            </TagsValue>
          )}
        </TagsTrigger>
        <TagsContent>
          <TagsList>
            <TagsEmpty>Brak opcji</TagsEmpty>
            <TagsGroup>
              {options.map((option) => (
                <TagsItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  value={option.value}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {option.label}
                </TagsItem>
              ))}
            </TagsGroup>
          </TagsList>
        </TagsContent>
      </Tags>
    </div>
  );
}
