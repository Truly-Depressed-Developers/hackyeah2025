"use client";

import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/ui/tags";
import { useState } from "react";
import { defaultTags } from "./VolunteerRequestForm.utils";

type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
};

export default function TagsInputComponent({ value = [], onChange }: Props) {
  const [newTag, setNewTag] = useState<string>("");
  const [tags, setTags] =
    useState<{ id: string; label: string }[]>(defaultTags);

  const handleRemove = (tagValue: string) => {
    const newSelected = value.filter((v) => v !== tagValue);
    onChange?.(newSelected);
  };

  const handleSelect = (tagValue: string) => {
    if (value.includes(tagValue)) {
      handleRemove(tagValue);
      return;
    }
    const newSelected = [...value, tagValue];
    onChange?.(newSelected);
  };

  return (
    <Tags className="">
      <TagsTrigger label="Wybierz tagi...">
        {value.map((tag) => (
          <TagsValue key={tag} onRemove={() => handleRemove(tag)}>
            {tags.find((t) => t.id === tag)?.label}
          </TagsValue>
        ))}
      </TagsTrigger>
      <TagsContent>
        <TagsInput onValueChange={setNewTag} placeholder="Wyszukaj tag..." />
        <TagsList>
          <TagsEmpty />
          <TagsGroup>
            {tags
              .filter((tag) => !value.includes(tag.id))
              .map((tag) => (
                <TagsItem key={tag.id} onSelect={handleSelect} value={tag.id}>
                  {tag.label}
                </TagsItem>
              ))}
          </TagsGroup>
        </TagsList>
      </TagsContent>
    </Tags>
  );
}
