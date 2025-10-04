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
import { Textarea } from "@/components/ui/textarea";

type ProfileFormData = z.infer<typeof profileSchema>;

interface CoordinatorFormProps {
  control: Control<ProfileFormData>;
}

export function CoordinatorForm({ control }: CoordinatorFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Imię</FormLabel>
            <FormControl>
              <Input placeholder="Imię" {...field} />
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
              <Input placeholder="Nazwisko" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="school"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nazwa szkoły</FormLabel>
            <FormControl>
              <Input placeholder="Nazwa szkoły" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
