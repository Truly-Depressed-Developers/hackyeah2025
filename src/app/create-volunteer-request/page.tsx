import { VolunteerRequestForm } from "@/components/VolunteerRequestForm/VolunteerRequestForm";

export default function CreateVolunteerRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-10">
      <VolunteerRequestForm className="w-full max-w-2xl" />
    </div>
  );
}
