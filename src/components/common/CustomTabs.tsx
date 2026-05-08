"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type TabProp = {
    tabName: string;
    tabLink: string;
};

export type NonEmptyArray<T> = [T, ...T[]];

export const CustomTabs = ({ params }: { params: NonEmptyArray<TabProp> }) => {
    const pathName = usePathname();
    const activeTab =
        params.find((p) =>
            p.tabLink === pathName ||
            (p.tabLink !== "/" && pathName.startsWith(p.tabLink))
        )?.tabName ?? params[0].tabName;

    return (
        <Tabs value={activeTab}>
            <TabsList variant={"line"}>
                {params.map((param) => {
                    return (
                        <Link key={param.tabName} href={param.tabLink}>
                            <TabsTrigger
                                value={param.tabName}
                                className="w-50 text-2xl after:bg-vivid data-active:text-vivid data-active:font-semibold hover:text-vivid/70"
                            >
                                {param.tabName}
                            </TabsTrigger>
                        </Link>
                    );
                })}
            </TabsList>
        </Tabs>
    );
};
