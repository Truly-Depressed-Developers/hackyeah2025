import EventList from "@/components/events/EventList";
import { api } from "@/trpc/server";
import axios from "axios";

export default async function FindEventPage() {
  const secEvent = await axios
    .get("https://chroma-db-api-369833237955.europe-west1.run.app/query", {
      headers: {
        "User-Agent": "insomnia/11.6.1",
        "x-api-key": "CHUJDUPACYCKI",
      },
    })
    .then((res) => res.data);

  console.log("SEC EVENT", secEvent);

  return (
    <div className="flex w-full flex-col items-center gap-y-6 px-8">
      <h1 className="mt-16 py-4 text-center text-2xl font-medium lg:text-4xl">
        Powiedz nam jakiego wolontariatu szukasz...
      </h1>

      <EventList />
    </div>
  );
}
