'use client'
import Left from "@/components/Dashboard/Left";
import Right from "@/components/Dashboard/Right";
import Image from "next/image";
import { useMyContext } from "@/app/Provider";
import { themeLogos } from "@/lib/constants";

export default function Home() {
  const { isAuth,theme } = useMyContext();

  return (
    <div className="grow px-12 py-12">
      <div className={`w-full`}>
        <div className="flex justify-between gap-4 w-full items-center">
          <Left />
          <div className={`mx-12`}>
            <Image 
              className="object-contain w-[600px] h-[200px]" 
              width={600} 
              height={50} 
              alt="LOGO" 
              src={themeLogos[theme] || "/logo/light.png"} 
            />
          </div>
          <Right />
        </div>
      </div>
    </div>
  );
}
