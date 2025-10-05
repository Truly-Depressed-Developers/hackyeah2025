import EventList from "@/components/events/EventList";
import { api } from "@/trpc/server";
import {
  ArrowRightFromLine,
  SearchIcon,
  SlidersHorizontal,
} from "lucide-react";

export default async function FindEventPage() {
  const events = await api.event.getEvents();

  return (
    <div className="flex w-full flex-col items-center gap-y-6 px-8">
      <h1 className="mt-16 py-4 text-center text-2xl font-medium lg:text-4xl">
        Powiedz nam jakiego wolontariatu szukasz...
      </h1>

      <EventList initialEvents={events} />
    </div>
  );
}
