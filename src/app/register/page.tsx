// src/app/uzupelnij-profil/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VolunteerForm } from "../_components/register/VolunteerForm";
import { OrganizationForm } from "../_components/register/OrganizationForm";
import { CoordinatorForm } from "../_components/register/CoordinatorForm";

// Schematy walidacji (bez zmian)
const volunteerSchema = z.object({
  role: z.literal("wolontariusz"),
  firstName: z.string().min(2, "Imię jest wymagane"),
  lastName: z.string().min(2, "Nazwisko jest wymagane"),
  isOfAge: z.boolean().optional(),
});

const companySchema = z.object({
  role: z.literal("organizator"),
  companyName: z.string().min(2, "Nazwa firmy jest wymagana"),
  location: z.string().min(3, "Lokalizacja jest wymagana"),
  description: z.string().optional(),
});

const coordinatorSchema = z.object({
  role: z.literal("koordynator"),
  firstName: z.string().min(2, "Imię jest wymagane"),
  lastName: z.string().min(2, "Nazwisko jest wymagane"),
  school: z.string().min(2, "Nazwa szkoły jest wymagana"),
});

export const profileSchema = z.discriminatedUnion("role", [
  volunteerSchema,
  companySchema,
  coordinatorSchema,
]);

type ProfileFormData = z.infer<typeof profileSchema>;
type Role = ProfileFormData["role"];

export default function CompleteProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const completeProfile = api.profile.complete.useMutation({
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      role: "wolontariusz",
      firstName: "",
      lastName: "",
      isOfAge: false,
    },
  });

  const selectedRole = form.watch("role");

  const handleTabChange = (value: string) => {
    form.setValue("role", value as Role, { shouldValidate: true });
    form.clearErrors();
    console.log(value);
  };

  function onSubmit(data: ProfileFormData) {
    console.log(data);
    completeProfile.mutate(data);
  }

  if (!session) {
    return (
      <div className="flex h-full w-full justify-center p-5 text-xl font-bold">
        Ładowanie...
      </div>
    );
  }

  return (
    <div className="container m-4 mx-auto flex max-w-3xl flex-col gap-y-4 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Uzupełnij swój profil</h1>
        <p>Wybierz swoją rolę i podaj wymagane informacje.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
          <Tabs
            value={selectedRole}
            onValueChange={handleTabChange}
            className="w-full gap-5"
          >
            <TabsList className="mx-auto grid w-full max-w-96 grid-cols-3">
              <TabsTrigger value="wolontariusz">Wolontariusz</TabsTrigger>
              <TabsTrigger value="organizator">Organizator</TabsTrigger>
              <TabsTrigger value="koordynator">Koordynator</TabsTrigger>
            </TabsList>

            <div className="border-muted rounded-md border-2 p-4">
              <TabsContent value="wolontariusz">
                <VolunteerForm control={form.control} />
              </TabsContent>
              <TabsContent value="organizator">
                <OrganizationForm control={form.control} />
              </TabsContent>
              <TabsContent value="koordynator">
                <CoordinatorForm control={form.control} />
              </TabsContent>
            </div>
          </Tabs>

          {completeProfile.error && (
            <p className="text-destructive text-sm font-medium">
              {completeProfile.error.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={completeProfile.isPending || !selectedRole}
            className="w-full"
            onClick={() => {
              console.log("test");
            }}
          >
            {completeProfile.isPending ? "Zapisywanie..." : "Zapisz profil"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
