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
import HalfImageScreen from "../_components/layout/HalfImageScreen";
import AuthFormHeader from "../_components/layout/AuthFormHeader";

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

const allFieldsDefaultValues = {
  role: "wolontariusz" as const,

  firstName: "",
  lastName: "",
  isOfAge: false,

  companyName: "",
  location: "",
  description: "",

  school: "",
};

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
    defaultValues: allFieldsDefaultValues,
  });

  const selectedRole = form.watch("role");

  const handleTabChange = (value: string) => {
    form.setValue("role", value as Role, { shouldValidate: true });
    form.clearErrors();
    form.reset({ ...allFieldsDefaultValues, role: value as Role });
  };

  function onSubmit(data: ProfileFormData) {
    console.log(data);
    completeProfile.mutate(data);
  }

  return (
    <HalfImageScreen imageUrl="/cracow.jpg">
      <AuthFormHeader />

      {!session ? (
        <div className="flex h-full items-center justify-center text-2xl font-bold">
          Ładowanie...
        </div>
      ) : (
        <div className="mt-24 flex h-full w-full max-w-2xl flex-col justify-start gap-4 p-6">
          <div className="gap-y-2">
            <h1 className="text-2xl font-bold md:text-5xl">
              Uzupełnij swój profil
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Wybierz swoją rolę i podaj wymagane informacje.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-2 space-y-6"
            >
              <Tabs
                value={selectedRole}
                onValueChange={handleTabChange}
                className="w-full gap-2"
              >
                <TabsList className="grid h-full w-full max-w-lg grid-cols-3">
                  <TabsTrigger value="wolontariusz">Wolontariusz</TabsTrigger>
                  <TabsTrigger value="organizator">Organizator</TabsTrigger>
                  <TabsTrigger value="koordynator">Koordynator</TabsTrigger>
                </TabsList>

                <div className="mt-2">
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
      )}
    </HalfImageScreen>
  );
}
