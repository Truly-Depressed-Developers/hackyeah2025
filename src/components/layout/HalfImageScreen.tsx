import Image from "next/image";

type HalfImageScreenProps = {
  imageUrl: string;
  children: React.ReactNode;
};

export default function HalfImageScreen({
  imageUrl,
  children,
}: HalfImageScreenProps) {
  return (
    <div className="relative flex h-screen">
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src={imageUrl}
          alt="zdjecie pogladowe miasta"
          fill
          style={{ objectFit: "cover" }}
          sizes="50vw"
          quality={95}
          priority
        />
      </div>
      <div className="w-full lg:w-1/2">
        <div className="flex h-full w-full flex-col">{children}</div>
      </div>
    </div>
  );
}
