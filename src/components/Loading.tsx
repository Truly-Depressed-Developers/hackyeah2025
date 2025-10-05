import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Ładowanie aplikacji...</span>
      </div>
    </div>
  );
}
