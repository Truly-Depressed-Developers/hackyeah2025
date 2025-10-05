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
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { MapLayerMouseEvent } from "react-map-gl/maplibre";
import Map from "@/components/Map/Map";
import { DatePicker } from "../ui/date-picker";
import FormInputComponent from "./FormInputComponent";
import TagsInputComponent from "./TagsInputComponent";
import {
  volunteerRequestSchema,
  type VolunteerFormRequestSchema,
} from "./VolunteerRequestForm.utils";
import WorkloadInputComponent from "./WorkloadInputComponent";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const form = useForm<VolunteerFormRequestSchema>({
    resolver: zodResolver(volunteerRequestSchema),
    defaultValues: {
      name: "",
      description: "",
      organizerName: "",
      tags: [],
      thumbnail: undefined,
      workload: [],
      form: [],
      latitude: undefined,
      longitude: undefined,
      startDate: undefined,
      endDate: undefined,
    },
  });

  const createOpportunity = api.externalAPI.createOpportunity.useMutation({
    onSuccess: (data) => {
      form.reset();
      if (data.success) {
        toast.success(
          data.message || "Ogłoszenie zostało pomyślnie utworzone!",
        );
        router.push("/dashboard");
      } else {
        toast.warning(data.message || "Ogłoszenie zostało zapisane lokalnie");
      }
    },
    onError: (error) => {
      toast.error(`Błąd podczas tworzenia ogłoszenia: ${error.message}`);
    },
  });

  function onSubmit(values: VolunteerFormRequestSchema) {
    createOpportunity.mutate(values);
  }

  const handleDeleteImage = async (onChange: (value: string) => void) => {
    setIsDeleting(true);
    try {
      onChange("");
      toast.success("Obraz został usunięty");
    } catch {
      toast.error("Błąd podczas usuwania obrazu");
    } finally {
      setIsDeleting(false);
    }
  };

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
              <FormLabel>Miniaturka</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {field.value && (
                    <div className="relative">
                      <Image
                        src={field.value}
                        alt="Ładowanie..."
                        width={200}
                        height={128}
                        className="h-32 w-full rounded-md border object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          if (field.value) {
                            void handleDeleteImage(field.onChange);
                          }
                        }}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="mr-1 h-4 w-4" />
                            Usuń
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                  {!field.value && (
                    <UploadButton
                      endpoint="imageUploader"
                      content={{
                        button({ ready }) {
                          if (ready) return "Wybierz plik";
                          return "Przygotowywanie...";
                        },
                        allowedContent({ ready, isUploading }) {
                          if (!ready) return "Sprawdzanie...";
                          if (isUploading) return "Przesyłanie...";
                          return "Dozwolone: obrazki (jpg, png) do 4MB";
                        },
                      }}
                      appearance={{
                        button:
                          "ut-uploading:cursor-not-allowed bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md",
                        allowedContent: "text-muted-foreground text-xs",
                      }}
                      className="ut-button:w-full ut-button:justify-center"
                      onUploadBegin={() => {
                        setIsUploading(true);
                      }}
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          field.onChange(res[0].ufsUrl);
                          toast.success("Plik został przesłany!");
                        }
                        setIsUploading(false);
                      }}
                      onUploadError={(_error: Error) => {
                        toast.error("Błąd przesyłania");
                        setIsUploading(false);
                      }}
                    />
                  )}
                  {isUploading && (
                    <div className="text-muted-foreground flex items-center justify-center space-x-2 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Przesyłanie pliku...</span>
                    </div>
                  )}
                </div>
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
          <Button
            type="submit"
            disabled={isUploading || createOpportunity.isPending}
          >
            {createOpportunity.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tworzenie...
              </>
            ) : (
              "Stwórz"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
