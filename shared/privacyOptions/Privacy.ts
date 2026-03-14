import { Globe, Users, Lock } from "lucide-react";

export const privacyConfig = {
    public: {
        label: "Public",
        icon: Globe,
    },
    following: {
        label: "Followers",
        icon: Users
        ,
    },
    only_me: {
        label: "Only me",
        icon: Lock,
    },
};