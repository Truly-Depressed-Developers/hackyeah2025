import HalfImageScreen from "@/app/_components/layout/HalfImageScreen";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signIn } from "@/server/auth";
import { Accessibility, ChevronDown } from "lucide-react";
import Image from "next/image";

const DISCORD_ICON_URL = "/discord.png";
const GOOGLE_ICON_URL = "/google.png";
const PL_FLAG_URL = "/poland.png";
const CRACOW_IMAGE_URL = "/cracow.jpg";

export default function LoginPage() {
  return (
    <HalfImageScreen imageUrl={CRACOW_IMAGE_URL}>
      <div className="flex h-full w-full flex-col">
        <header className="flex items-end justify-between p-4 md:p-8">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex min-h-12 min-w-42 items-center"
                >
                  <Logo />
                  <p className="text-lg">Polski</p>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Українська</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="icon"
              aria-label="Opcje dostępności"
              className="h-12 w-12"
            >
              <Accessibility className="size-6" />
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col items-start justify-center p-8 pb-64">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight md:text-6xl">
              Wejdź do <br /> Centrum Wolontariatu
            </h1>
            <p className="text-muted-foreground mt-4 text-2xl">
              Dołącz do społeczności wolontariuszy i odkrywaj inicjatywy, które
              zmieniają Kraków na lepsze.
            </p>
            <div className="mt-8 flex flex-col flex-wrap items-center justify-start gap-6 sm:flex-row">
              <form
                action={async () => {
                  "use server";
                  await signIn("discord", { redirectTo: "/" });
                }}
              >
                <Button variant="outline" className="px-12 py-8">
                  <Image
                    src={DISCORD_ICON_URL}
                    alt="Discord Logo"
                    width={28}
                    height={28}
                    className="mr-2"
                  />
                  <p className="text-xl">Zaloguj się przez discord</p>
                </Button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: "/" });
                }}
              >
                <Button variant="outline" className="px-12 py-8">
                  <Image
                    src={GOOGLE_ICON_URL}
                    alt="Google Logo"
                    width={28}
                    height={28}
                    className="mr-2"
                  />
                  <p className="text-xl">Zaloguj się z Google</p>
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </HalfImageScreen>
  );
}
