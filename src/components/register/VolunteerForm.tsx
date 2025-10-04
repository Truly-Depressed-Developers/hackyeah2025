"use client";

import type { Control } from "react-hook-form";
import type { z } from "zod";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { profileSchema } from "@/app/register/page";

type ProfileFormData = z.infer<typeof profileSchema>;

interface VolunteerFormProps {
  control: Control<ProfileFormData>;
}

export function VolunteerForm({ control }: VolunteerFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Imię</FormLabel>
            <FormControl>
              <Input placeholder="Jan" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nazwisko</FormLabel>
            <FormControl>
              <Input placeholder="Kowalski" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="isOfAge"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Jestem pełnoletni/a</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
