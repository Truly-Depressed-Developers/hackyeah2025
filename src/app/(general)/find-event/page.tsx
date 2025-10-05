import EventList from "@/components/events/EventList";

export default async function FindEventPage() {
  return (
    <div className="flex w-full flex-col items-center gap-y-6 px-8">
      <h1 className="mt-16 py-4 text-center text-2xl font-medium lg:text-4xl">
        Powiedz nam jakiego wolontariatu szukasz...
      </h1>

      <EventList />
    </div>
  );
}
