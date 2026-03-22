import NavMenu from "@/shared/NavigationMenu/NavMenu";
import CreatePost from "@/shared/Posts/CreatePost";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen  ">
            <div className="w-full flex lg:max-w-[80%] mx-auto">
                <NavMenu />
                <div className="flex flex-col mx-auto justify-center sm:w-full  lg:w-[60%] items-center p-10">
                    <CreatePost />
                    <main className="min-h-screen w-full">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}