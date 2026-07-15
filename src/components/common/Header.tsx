import Image from "next/image";
import Link from "next/link";
import localImage from "../../../public/topImage.png";
import { SwitchTheme } from "@/components/common/SwitchTheme";
import { CustomTabs } from "@/components/common/CustomTabs";
import { CustomCard } from "./CustomCard";

export const Header = () => {
  return (
    <header className="border-border bg-content-background text-input col-span-2 flex h-25 items-center justify-between border">
      <CustomCard
        label="Top"
        className="m-0 h-full w-auto bg-transparent border-transparent p-0"
      >
        <Link
          href="/"
          aria-label="トップページへ戻る"
          className="m-2 flex h-full border border-transparent"
        >
          <Image
            src={localImage}
            alt="プロフィール画像"
            height={64}
            width={64}
            className="mr-4 h-full w-auto rounded-full object-cover"
          />
          <div className="text-border flex flex-col justify-center text-[1rem]">
            <p className="hidden lg:inline">Personal Log</p>
            <div className="flex items-end gap-2">
              <h1 className="text-foreground text-3xl font-bold text-nowrap">
                DEV活
              </h1>
              <p className="hidden lg:inline">RyoK73@omarchy</p>
            </div>
          </div>
        </Link>
      </CustomCard>
      <div className="flex justify-end">
        <CustomTabs
          navClassName="border-l"
          linkClassName="hidden lg:flex lg:size-25"
        />
        <SwitchTheme
          className={`text-vivid flex size-25 items-center justify-center border-transparent`}
        />
      </div>
    </header>
  );
};
