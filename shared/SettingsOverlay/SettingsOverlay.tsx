"use client";

import { useRef, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, Upload } from "lucide-react";
import clsx from "clsx";
import { useChangePassword, useUploadPhoto } from "@/hooks/UserHooks";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

// ================= TYPES =================
type Props = {
    isOpen: boolean;
    onClose: () => void;
    userImage: string;
};

// ================= COMPONENT =================
export default function SettingsPanel({ isOpen, onClose, userImage }: Props) {
    const [openSection, setOpenSection] = useState<"image" | "password" | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // IMAGE
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);

    // PASSWORD
    const [form, setForm] = useState({ password: "", newPassword: "" });
    const [error, setError] = useState<string | null>(null);

    const { data: session } = useSession();

    const { mutate: changePassword, isPending: passwordLoading } = useChangePassword();
    const { mutate: uploadPhoto, isPending: imageLoading } = useUploadPhoto();

    const toggle = (section: "image" | "password") => {
        setOpenSection((prev) => (prev === section ? null : section));
    };

    // ================= VALIDATION =================
    const validatePassword = (password: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        return regex.test(password);
    };

    // ================= IMAGE =================
    const handleSelect = () => fileRef.current?.click();

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpload = () => {
        if (!image) return;

        uploadPhoto(image, {
            onSuccess: () => {
                setImage(null);
                setPreview(null);
            },
        });
    };

    const handleRemove = () => {
        setImage(null);
        setPreview(null);
    };

    // ================= PASSWORD =================
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePassword = () => {
        if (!validatePassword(form.password) || !validatePassword(form.newPassword)) {
            setError("Must be 8+ chars, include upper, lower, number, symbol");
            return;
        }

        changePassword(form, {
            onSuccess: () => {
                setForm({ password: "", newPassword: "" });
                setError(null);
                onClose();
            },
        });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-95 sm:w-105 p-0">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="font-semibold text-lg">Settings</h2>
                </div>

                <div className="p-5 space-y-4">

                    {/* ================= IMAGE CARD ================= */}
                    <div className="bg-white rounded-xl border overflow-hidden">

                        <button
                            onClick={() => toggle("image")}
                            className="w-full flex justify-between items-center p-4"
                        >
                            <span className="font-medium">Profile Photo</span>
                            <ChevronDown
                                className={clsx(
                                    "transition-transform duration-300",
                                    openSection === "image" && "rotate-180"
                                )}
                            />
                        </button>

                        <div
                            className={clsx(
                                "transition-all duration-300 ease-in-out overflow-hidden",
                                openSection === "image"
                                    ? "max-h-125 opacity-100"
                                    : "max-h-0 opacity-0"
                            )}
                        >
                            <div className="p-4 pt-0 space-y-4">

                                {/* AVATAR */}
                                <div className="flex justify-center">
                                    <Avatar className="w-20 h-20">
                                        <AvatarImage src={userImage} />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                </div>

                                {/* INPUT */}
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImage}
                                />

                                <Button
                                    onClick={handleSelect}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                    Change Photo
                                </Button>

                                {/* PREVIEW */}
                                {preview && (
                                    <div className="space-y-3 animate-in fade-in zoom-in-95">
                                        <Image
                                            src={preview}
                                            alt="Preview"
                                            width={400}
                                            height={200}
                                            className="w-full h-40 object-cover rounded-md"
                                        />

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleUpload}
                                                disabled={imageLoading}
                                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                {imageLoading ? "Uploading..." : "Upload Photo"}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                className="flex-1 text-red-500"
                                                onClick={handleRemove}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* ================= PASSWORD CARD ================= */}
                    <div className="bg-white rounded-xl border overflow-hidden">

                        <button
                            onClick={() => toggle("password")}
                            className="w-full flex justify-between items-center p-4"
                        >
                            <span className="font-medium">Change Password</span>
                            <ChevronDown
                                className={clsx(
                                    "transition-transform duration-300",
                                    openSection === "password" && "rotate-180"
                                )}
                            />
                        </button>

                        <div
                            className={clsx(
                                "transition-all duration-300 ease-in-out overflow-hidden",
                                openSection === "password"
                                    ? "max-h-125 opacity-100"
                                    : "max-h-0 opacity-0"
                            )}
                        >
                            <div className="p-4 pt-0 space-y-3">

                                <div className="space-y-1">
                                    <Label>Old Password</Label>

                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showPassword ? <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                                size={18} /> : <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black" size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label>New Password</Label>

                                    <div className="relative">
                                        <Input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={form.newPassword}
                                            onChange={handleChange}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showNewPassword ? <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                                size={18} /> : <Eye
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black" size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-sm text-red-500 animate-in fade-in">
                                        {error}
                                    </p>
                                )}

                                <Button
                                    onClick={handlePassword}
                                    disabled={passwordLoading}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                    {passwordLoading ? "Saving..." : "Update Password"}
                                </Button>

                            </div>
                        </div>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
}