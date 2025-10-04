"use client";

import { formOptions } from "./VolunteerRequestForm.utils";
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

type FormValue =
  | "Zostań aktywistą online"
  | "Dbaj o potrzeby dzielnicy"
  | "Weź udział w akcjach bezpośrednich"
  | "Spotkaj się z mieszkańcami"
  | "Zaangażuj się w obywatelską kontrolę"
  | "Wesprzyj pogotowie obywatelskie";

type Props = {
  value?: FormValue[];
  onChange?: (value: FormValue[]) => void;
};

export default function FormInputComponent({ value = [], onChange }: Props) {
  const handleRemove = (formValue: FormValue) => {
    const newSelected = value.filter((v) => v !== formValue);
    onChange?.(newSelected);
  };

  const handleSelect = (formValue: FormValue) => {
    if (value.includes(formValue)) {
      handleRemove(formValue);
      return;
    }
    const newSelected = [...value, formValue];
    onChange?.(newSelected);
  };

  return (
    <Tags>
      <TagsTrigger label="Wybierz formy zaangażowania...">
        {value.map((formValue) => (
          <TagsValue
            key={formValue}
            onRemove={() => handleRemove(formValue)}
            className="max-w-[100px]"
          >
            <span className="truncate">
              {formOptions.find((opt) => opt.value === formValue)?.label ??
                formValue}
            </span>
          </TagsValue>
        ))}
      </TagsTrigger>
      <TagsContent>
        <TagsList>
          <TagsEmpty>Brak opcji</TagsEmpty>
          <TagsGroup>
            {formOptions.map((option) => (
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
