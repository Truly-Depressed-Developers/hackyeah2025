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

interface OrganizationFormProps {
  control: Control<ProfileFormData>;
}

export function OrganizationForm({ control }: OrganizationFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nazwa firmy</FormLabel>
            <FormControl>
              <Input placeholder="Nazwa firmy" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lokalizacja</FormLabel>
            <FormControl>
              <Input placeholder="Lokalizacja" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Opis</FormLabel>
            <FormControl>
              <Textarea placeholder="Opis" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
