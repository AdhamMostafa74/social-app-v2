"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
    ImageIcon,
    Trash2,
    ImagesIcon,
    ChevronDown,
    Globe,
    Users,
    Lock,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useCreatePost } from "@/hooks/PostHooks";
import { useSession } from "next-auth/react";
import { privacyConfig } from "../privacyOptions/Privacy";
import TopLoader from "../Loader/Loader";
import { FaSpinner } from "react-icons/fa";
import { useGetProfile } from "@/hooks/UserHooks";


type Privacy = "public" | "following" | "only_me";

export default function CreatePost() {
    const [preview, setPreview] = useState<string | null>(null);
    const [text, setText] = useState("");
    const [privacy, setPrivacy] = useState<Privacy>("public");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [open, setOpen] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: session } = useSession()
    const user = session?.user.data.user

    const { data: profileData } = useGetProfile()


    const firstName = user ? user!.name.split(" ")[0] : '';

    const handleFile = (file: File) => {
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
        setImageFile(file);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        handleFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        handleFile(file);
    };

    const removeImage = () => {
        setPreview(null);
        setImageFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };



    const resetForm = () => {
        setText("");
        setPrivacy("public");
        setPreview(null);
        setImageFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    const { mutate, isPending } = useCreatePost({
        onSuccess: () => {
            resetForm()
            setOpen(false)
        }
    });

    const handleSubmit = async () => {
        const formData = new FormData();

        formData.append("body", text);
        formData.append("privacy", privacy);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        console.log([...formData.entries()]);
        const token = session?.user.data.token
        mutate({ token, formData })

    };


    const CurrentIcon = privacyConfig[privacy].icon;

    return (
        <>
            {
                user ? <Dialog open={open} onOpenChange={setOpen} >
                    {/* Trigger */}
                    <DialogTrigger asChild>
                        <div className="rounded-2xl w-full border bg-white p-4 shadow-lg cursor-pointer">
                            <div className="flex items-center gap-3">
                                <Image
                                    src={profileData?.data.user?.photo ?? user?.photo}
                                    alt={profileData?.data.user?.name ?? user?.name}
                                    width={48}
                                    height={48}
                                    className="h-12 w-12 rounded-full object-cover"
                                />

                                <div className="flex-1 rounded-full border px-5 py-3 text-gray-400 text-[17px]">
                                    What&apos;s on your mind?
                                </div>

                                <ImagesIcon className="text-blue-500 hover:text-blue-700" />
                            </div>
                        </div>
                    </DialogTrigger>

                    {/* Modal */}
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6">
                        {/* Header */}
                        <div className="border-b pb-4 text-center">
                            <DialogTitle className="text-lg font-semibold">
                                Create post
                            </DialogTitle>
                        </div>

                        {/* User */}
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-3">
                                <Image
                                    src={profileData?.data.user?.photo}
                                    alt={profileData?.data.user?.name}
                                    width={44}
                                    height={44}
                                    className="h-11 w-11 rounded-full object-cover"
                                />

                                <div>
                                    <span className="font-medium block">{user!.name}</span>

                                    {/* Privacy Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="mt-1 flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-gray-600">
                                                <CurrentIcon className="h-3 w-3" />
                                                {privacyConfig[privacy].label}
                                                <ChevronDown className="h-3 w-3" />
                                            </button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem onClick={() => setPrivacy("public")}>
                                                <Globe className="mr-2 h-4 w-4" />
                                                Public
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => setPrivacy("following")}>
                                                <Users className="mr-2 h-4 w-4" />
                                                Followers
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => setPrivacy("only_me")}>
                                                <Lock className="mr-2 h-4 w-4" />
                                                Only me
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>

                        {/* Textarea */}
                        <div>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={`What's in your mind, ${firstName}?`}
                                className="mt-4 min-h-30 w-full resize-none border-none text-lg outline-none placeholder:text-gray-400"
                            />

                            <div className="flex items-center justify-between text-sm text-gray-400">
                                <span>{text.length}/2000</span>
                            </div>
                        </div>

                        {/* Preview */}
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className="mt-4 rounded-xl border border-dashed p-4 text-center"
                        >
                            {preview ? (
                                <div className="relative overflow-hidden rounded-xl">
                                    <Image
                                        src={preview}
                                        alt="preview"
                                        width={400}
                                        height={300}
                                        className="h-64 w-full rounded-xl object-contain"
                                    />

                                    <button
                                        onClick={removeImage}
                                        className="absolute right-2 top-2 rounded-full bg-white p-2 shadow"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">
                                    Drag & drop image here
                                </p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-4 flex items-center justify-between rounded-xl border p-4">
                            <span className="font-medium">Add to your post</span>

                            <label className="cursor-pointer">
                                <ImageIcon className="h-6 w-6 text-blue-500" />

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            disabled={isPending || text === ''}
                            onClick={handleSubmit}
                            className=" flex justify-center text-xl
                            mt-4 w-full rounded-lg bg-blue-500 py-3 text-center font-medium text-white transition
                             hover:bg-blue-600 disabled:bg-blue-200"
                        >
                            {isPending ? <div className="flex items-center gap-2">
                                <FaSpinner className="animate-spin text-md"></FaSpinner>
                                Posting...
                            </div> : "Post"}
                        </button>
                    </DialogContent>
                </Dialog> : <TopLoader />
            }
        </>
    );
}