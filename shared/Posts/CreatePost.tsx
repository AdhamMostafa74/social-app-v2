"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
    ImageIcon,
    X,
    Smile,
    Trash2,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog";
import { User } from "next-auth";

interface CreatePostProps {
    user: User;
}

export default function CreatePost({ user }: CreatePostProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [text, setText] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const firstName = user.name.split(" ")[0];

    const handleFile = (file: File) => {
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
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

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };



    return (
        <Dialog>
            {/* Trigger */}
            <DialogTrigger asChild>
                <div className="rounded-2xl w-2xl border bg-white p-4 shadow-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                        <Image
                            src={user.photo}
                            alt={user.name}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-full object-cover"
                        />

                        <div className="flex-1 rounded-full border px-5 py-3 text-gray-400 text-[17px]">
                            What&apos;s on your mind?
                        </div>
                    </div>
                </div>
            </DialogTrigger>

            {/* Modal */}
            <DialogContent className="max-w-lg rounded-2xl p-6">
                {/* Header */}
                <div className="border-b pb-4 text-center">
                    <DialogTitle className="text-lg font-semibold">
                        Create post
                    </DialogTitle>
                </div>

                {/* User */}
                <div className="flex items-center gap-3 pt-4">
                    <Image
                        src={user.photo}
                        alt={user.name}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full object-cover"
                    />
                    <span className="font-medium">{user.name}</span>
                </div>

                {/* Textarea */}
                <div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={`What's in your mind, ${firstName}?`}
                        className="mt-4 min-h-[120px] w-full resize-none border-none text-lg outline-none placeholder:text-gray-400"
                    />

                    <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>{text.length}/500</span>
                    </div>
                </div>

                {/* Preview + Drag Drop */}
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="mt-4 rounded-xl border border-dashed p-4 text-center"
                >
                    {preview ? (
                        <div className="relative">
                            <Image
                                src={preview}
                                alt="preview"
                                width={400}
                                height={400}
                                className="w-full rounded-xl object-cover"
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

                {/* Footer Upload */}
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

                {/* Post Button */}
                <button className="mt-4 w-full rounded-lg bg-blue-500 py-3 font-medium text-white transition hover:bg-blue-600">
                    Post
                </button>
            </DialogContent>
        </Dialog>
    );
}