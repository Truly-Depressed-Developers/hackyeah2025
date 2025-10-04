import Image from "next/image";

const MLODY_KRAKOW_LOGO_URL = "/Mlody_Krakow_LOGO.png";

export default function Logo() {
  return (
    <Image
      src={MLODY_KRAKOW_LOGO_URL}
      alt="Młody Kraków Logo"
      width={120}
      height={70}
      className="h-auto w-24 md:w-32"
    />
  );
}
