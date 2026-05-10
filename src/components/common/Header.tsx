import { SwitchTheme } from "@/components/common/SwitchTheme";
import { CustomTabs, type TabProp, NonEmptyArray } from "@/components/common/CustomTabs";
const TabProps: NonEmptyArray<TabProp> = [
    {
        name: "01 . HOME",
        link: "/",
    },
    {
        name: "02 . WORK",
        link: "/blog/tag/works",
    },
    {
        name: "03 . ABOUT",
        link: "/about",
    },
];

export const Header = () => {
    const tabSize = "w-35 h-auto";
    return (
        <header className="col-span-2 flex items-center border border-border m-8 h-25 divide-x divide-border bg-background/20 text-input">
            <div className="flex-1 flex p-4 h-full">
                <p className=" border border-border flex justify-center items-center mr-4">. . /</p>
                <div className="text-border">
                    <p>Personal Log</p>
                    <div className="flex items-end gap-2">
                        <h1 className="text-foreground text-3xl font-bold">DEV活</h1>
                        <p>RyoK73@omarchy</p>
                    </div>
                </div>
            </div>
            <div className="flex h-full justify-end item-center ">
                <CustomTabs tabs={TabProps} className={`${tabSize}`} />
            </div>
            <SwitchTheme className={`flex justify-center items-center ${tabSize}`} />
        </header>
    );
};
