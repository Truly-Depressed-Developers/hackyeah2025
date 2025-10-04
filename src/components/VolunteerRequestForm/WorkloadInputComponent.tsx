"use client";

import { workloadOptions } from "./VolunteerRequestForm.utils";
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
import { Check } from "lucide-react";

type WorkloadValue = "Mini" | "Lekkie" | "Umiarkowane" | "Pełne";

type Props = {
  value?: WorkloadValue[];
  onChange?: (value: WorkloadValue[]) => void;
};

export default function WorkloadInputComponent({
  value = [],
  onChange,
}: Props) {
  const handleRemove = (workloadValue: WorkloadValue) => {
    const newSelected = value.filter((v) => v !== workloadValue);
    onChange?.(newSelected);
  };

  const handleSelect = (workloadValue: WorkloadValue) => {
    if (value.includes(workloadValue)) {
      handleRemove(workloadValue);
      return;
    }
    const newSelected = [...value, workloadValue];
    onChange?.(newSelected);
  };

  return (
    <Tags>
      <TagsTrigger label="Wybierz poziomy zaangażowania...">
        {value.map((workloadValue) => (
          <TagsValue
            key={workloadValue}
            onRemove={() => handleRemove(workloadValue)}
            className="max-w-[100px]"
          >
            <span className="truncate">
              {workloadOptions.find((opt) => opt.value === workloadValue)
                ?.label ?? workloadValue}
            </span>
          </TagsValue>
        ))}
      </TagsTrigger>
      <TagsContent>
        <TagsList>
          <TagsEmpty>Brak opcji</TagsEmpty>
          <TagsGroup>
            {workloadOptions.map((option) => (
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
  );
}
