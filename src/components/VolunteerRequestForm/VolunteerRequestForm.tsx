"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Map from "@/components/Map/Map";
import { Textarea } from "@/components/ui/textarea";
import TagsInputComponent from "./TagsInputComponent";
import WorkloadInputComponent from "./WorkloadInputComponent";
import FormInputComponent from "./FormInputComponent";
import type { MapLayerMouseEvent } from "react-map-gl/maplibre";
import { DatePicker } from "../ui/date-picker";
import {
  volunteerRequestSchema,
  type VolunteerFormRequestSchema,
} from "./VolunteerRequestForm.utils";

type Props = {
  className?: string;
};

type Marker = {
  long: number | undefined;
  lat: number | undefined;
};

export function VolunteerRequestForm({ className }: Props) {
  const [markerData, setMarkerData] = useState<Marker>({
    long: undefined,
    lat: undefined,
  });

  const form = useForm<VolunteerFormRequestSchema>({
    resolver: zodResolver(volunteerRequestSchema),
    defaultValues: {
      name: "",
      description: "",
      organizerName: "",
      tags: [],
      thumbnail: "",
      workload: [],
      form: [],
    },
  });

  function onSubmit(values: VolunteerFormRequestSchema) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa</FormLabel>
              <FormControl>
                <Input placeholder="Wpisz nazwę ogłoszenia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Opisz szczegóły wolontariatu"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tagi</FormLabel>
              <FormControl>
                <TagsInputComponent
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Miniaturka (URL)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="latitude"
          render={({ field }) => (
            <FormControl>
              <Input type="hidden" {...field} value={field.value ?? ""} />
            </FormControl>
          )}
        />
        <FormField
          control={form.control}
          name="longitude"
          render={({ field }) => (
            <FormControl>
              <Input type="hidden" {...field} value={field.value ?? ""} />
            </FormControl>
          )}
        />

        <FormItem>
          <FormLabel>Lokalizacja</FormLabel>
          <div className="h-96 w-full overflow-hidden rounded-md">
            <Map
              long={19.94}
              lat={50.05}
              markers={
                markerData.lat && markerData.long
                  ? [
                      {
                        long: markerData.long,
                        lat: markerData.lat,
                        clickable: false,
                      },
                    ]
                  : []
              }
              onClick={(data: MapLayerMouseEvent) => {
                setMarkerData({ long: data.lngLat.lng, lat: data.lngLat.lat });
                form.setValue("latitude", data.lngLat.lat);
                form.setValue("longitude", data.lngLat.lng);
              }}
            />
          </div>
          {(form.formState.errors.latitude ??
            form.formState.errors.longitude) && (
            <FormMessage>
              {form.formState.errors.latitude?.message ??
                form.formState.errors.longitude?.message ??
                "Select location on map"}
            </FormMessage>
          )}
        </FormItem>

        <div className="flex flex-col gap-4 sm:flex-row">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Data początkowa</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Data końcowa</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="workload"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wymagania nakładu pracy</FormLabel>
              <FormControl>
                <WorkloadInputComponent
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="form"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferowana forma działalności</FormLabel>
              <FormControl>
                <FormInputComponent
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organizerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa organizatora</FormLabel>
              <FormControl>
                <Input placeholder="Podaj nazwę firmy/organizacji" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">Stwórz</Button>
        </div>
      </form>
    </Form>
  );
}
