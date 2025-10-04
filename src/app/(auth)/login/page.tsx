import AuthFormHeader from "@/components/layout/AuthFormHeader";
import HalfImageScreen from "@/components/layout/HalfImageScreen";
import { Button } from "@/components/ui/button";
import { signIn } from "@/server/auth";
import Image from "next/image";

const DISCORD_ICON_URL = "/discord.png";
const GOOGLE_ICON_URL = "/google.png";
const CRACOW_IMAGE_URL = "/cracow.jpg";

export default function LoginPage() {
  return (
    <HalfImageScreen imageUrl={CRACOW_IMAGE_URL}>
      <AuthFormHeader />

      <main className="mt-32 flex flex-1 flex-col items-start p-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Wejdź do <br /> Centrum Wolontariatu
          </h1>
          <p className="text-muted-foreground mt-4 text-base md:text-xl">
            Dołącz do społeczności wolontariuszy i odkrywaj inicjatywy, które
            zmieniają Kraków na lepsze.
          </p>
          <div className="mt-8 flex flex-col flex-wrap justify-start gap-4 sm:flex-row md:gap-6">
            <form
              action={async () => {
                "use server";
                await signIn("discord", { redirectTo: "/" });
              }}
            >
              <Button variant="outline" className="p-6">
                <Image
                  src={DISCORD_ICON_URL}
                  alt="Discord Logo"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <p>Zaloguj się przez discord</p>
              </Button>
            </form>
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
              }}
            >
              <Button variant="outline" className="p-6">
                <Image
                  src={GOOGLE_ICON_URL}
                  alt="Google Logo"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <p>Zaloguj się z Google</p>
              </Button>
            </form>
          </div>
        </div>
      </main>
    </HalfImageScreen>
  );
}
