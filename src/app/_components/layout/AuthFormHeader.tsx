"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/server/auth";
import { Accessibility, ChevronDown, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const PL_FLAG_URL = "/poland.png";
const MLODY_KRAKOW_LOGO_URL = "/Mlody_Krakow_LOGO.png";

export default function AuthFormHeader() {
  const { data: session } = useSession();

  return (
    <header className="flex items-end justify-between p-4 md:p-8">
      <Image
        src={MLODY_KRAKOW_LOGO_URL}
        alt="Młody Kraków Logo"
        width={120}
        height={70}
        className="h-auto w-24 md:w-32"
      />
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Image
                src={PL_FLAG_URL}
                alt="Polska flaga"
                width={20}
                height={20}
              />
              <p>Polski</p>
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
          className="h-9 w-9"
        >
          <Accessibility className="size-4" />
        </Button>
        {session && (
          <Button variant="outline" size="icon" asChild className="h-9 w-9">
            <Link href="/api/auth/signout">
              <LogOut className="size-4" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
