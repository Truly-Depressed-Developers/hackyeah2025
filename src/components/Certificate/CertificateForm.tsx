"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().min(2, "Podaj imię i nazwisko"),
  eventName: z.string().min(2, "Podaj nazwę wydarzenia"),
});

type FormValues = z.infer<typeof schema>;

type CertificateFormProps = {
  onSubmit: (data: FormValues) => void;
};

export default function CertificateForm({ onSubmit }: CertificateFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", eventName: "" },
  });

  const handleSubmit = (values: FormValues) => {
    toast.success("Dane zostały zapisane — generuję certyfikat");
    onSubmit(values);
  };

  return (
    <div className="flex w-full justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Tworzenie Certyfikatu</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <CardContent className="space-y-4">
              {/* Pole imię i nazwisko */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię i nazwisko</FormLabel>
                    <FormControl>
                      <Input placeholder="Wpisz imię i nazwisko" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pole nazwa wydarzenia */}
              <FormField
                control={form.control}
                name="eventName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa wydarzenia</FormLabel>
                    <FormControl>
                      <Input placeholder="Wpisz nazwę wydarzenia" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">Generuj certyfikat</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
