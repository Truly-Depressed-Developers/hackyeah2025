"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { profileSchema } from "@/app/schemas/schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";
import AuthFormHeader from "../../components/layout/AuthFormHeader";
import HalfImageScreen from "../../components/layout/HalfImageScreen";
import { CoordinatorForm } from "../../components/register/CoordinatorForm";
import { OrganizationForm } from "../../components/register/OrganizationForm";
import { VolunteerForm } from "../../components/register/VolunteerForm";

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
    form.reset({ role: value as Role } as ProfileFormData);
  };

  function onSubmit(data: ProfileFormData) {
    completeProfile.mutate(
      data as Parameters<typeof completeProfile.mutate>[0],
    );
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
