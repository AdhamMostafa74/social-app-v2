import NavMenu from "@/shared/NavigationMenu/NavMenu";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen  ">
            <div className="w-full flex lg:max-w-[80%] mx-auto">
                <NavMenu />
                <main className="  p-6 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    );
}