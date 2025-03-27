'use client'
import Left from "@/components/Dashboard/Left";
import Right from "@/components/Dashboard/Right";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grow px-12 py-12">
      <div className={`w-full `}>
        <div className="flex justify-between gap-4 w-full items-center">
          <Left />
          <div className={`mx-12`}>
            <Image
              className="object-contain"
              width={200}
              height={20}
              alt="LOGO"
              src={`/next.svg`}
            />
          </div>
          <Right />
        </div>
      </div>
    </div>
  );
}
