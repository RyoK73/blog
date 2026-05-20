import Image from "next/image";
import Link from "next/link";
import localImage from "../../../public/topImage.png";
import { SwitchTheme } from "@/components/common/SwitchTheme";
import { CustomTabs } from "@/components/common/CustomTabs";
import { CustomCard } from "./CustomCard";
const tabSize = "size-25";

export const Header = () => {
    return (
        <header className="col-span-2 flex items-center justify-between border border-border bg-content-background text-input h-25 ">
            <CustomCard
                label="Top"
                className="h-full w-auto p-0 m-0 border-transparent"
            >
                <Link
                    href="/"
                    aria-label="トップページへ戻る"
                    className="flex h-full border border-transparent m-2"
                >
                    <Image
                        src={localImage}
                        alt="プロフィール画像"
                        height={64}
                        width={64}
                        className="w-auto mr-4 rounded-full object-cover"
                    />
                    <div className="text-border flex flex-col justify-center text-[1rem]">
                        <p>Personal Log</p>
                        <div className="flex items-end gap-2">
                            <h1 className="text-foreground text-3xl font-bold text-nowrap">
                                DEV活
                            </h1>
                            <p>RyoK73@omarchy</p>
                        </div>
                    </div>
                </Link>
            </CustomCard>
            <div className="flex divide-x divide-border border-l">
                <div className="flex h-full justify-end">
                    <CustomTabs className={tabSize} />
                </div>
                <SwitchTheme
                    className={`flex justify-center items-center text-vivid ${tabSize}`}
                />
            </div>
        </header>
    );
};
