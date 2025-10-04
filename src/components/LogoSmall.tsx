import Image from "next/image";

const MLODY_KRAKOW_LOGO_URL = "/Mlody_Krakow_LOGO-bez-tla.png";

interface LogoSmallProps {
  collapsed?: boolean;
}

export default function LogoSmall({ collapsed = false }: LogoSmallProps) {
  return (
    <div className="flex items-center justify-center">
      <Image
        src={MLODY_KRAKOW_LOGO_URL}
        alt="Młody Kraków Logo"
        width={73}
        height={43}
        className={`transition-all duration-200 ${
          collapsed ? "h-8 w-8 object-contain" : "h-[43px] w-[73px]"
        }`}
      />
    </div>
  );
}
