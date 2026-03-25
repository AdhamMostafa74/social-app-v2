"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Upload, Eye, EyeOff, Trash2Icon } from "lucide-react";
import clsx from "clsx";
import { useChangePassword, useUploadPhoto } from "@/hooks/UserHooks";
import Image from "next/image";

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

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);

    const [form, setForm] = useState({ password: "", newPassword: "" });
    const [error, setError] = useState<string | null>(null);

    const { mutate: changePassword, isPending: passwordLoading } = useChangePassword();
    const { mutate: uploadPhoto, isPending: imageLoading } = useUploadPhoto();

    const toggle = (section: "image" | "password") => {
        setOpenSection((prev) => (prev === section ? null : section));
    };

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

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            {/* BACKDROP */}
            <div
                onClick={onClose}
                className={clsx(
                    "fixed inset-0 bg-black/40 z-40 transition-all duration-500",
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                )}
            />

            {/* SHEET */}
            <div
                className={clsx(
                    "fixed top-0 right-0 h-full w-95 sm:w-105 bg-white z-50 transition-transform duration-500",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
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
                                "transition-all duration-500 ease-in-out overflow-hidden",
                                openSection === "image"
                                    ? "max-h-125 opacity-100"
                                    : "max-h-0 opacity-0"
                            )}
                        >
                            <div className="p-4 pt-0 space-y-4">

                                {/* AVATAR */}
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 rounded-full overflow-hidden border">
                                        {userImage ? (
                                            <Image
                                                src={userImage}
                                                alt="avatar"
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-gray-400">
                                                U
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* INPUT */}
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImage}
                                />

                                <button
                                    onClick={handleSelect}
                                    className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white py-2 rounded-md"
                                >
                                    Change Photo
                                </button>

                                {/* PREVIEW */}
                                {preview && (
                                    <div className="space-y-3 animate-in fade-in zoom-in-95">
                                        <Image
                                            src={preview}
                                            alt="Preview"
                                            width={400}
                                            height={400}
                                            className="w-full h-70 object-contain rounded-md"
                                        />

                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleUpload}
                                                disabled={imageLoading}
                                                className="flex-1 bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white py-2 rounded-md flex items-center justify-center gap-2"
                                            >
                                                <Upload size={16} />
                                                {imageLoading ? "Uploading..." : "Upload Photo"}
                                            </button>

                                            <button
                                                className="flex-1 bg-red-300 text-white hover:bg-red-500 transition-all duration-300 py-2 rounded-md flex items-center justify-center gap-2"
                                                onClick={handleRemove}

                                            >
                                                <Trash2Icon size={16} />
                                                Remove
                                            </button>
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
                                    <label className="text-sm">Old Password</label>

                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            className="w-full border rounded-md px-3 py-2 pr-10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm">New Password</label>

                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={form.newPassword}
                                            onChange={handleChange}
                                            className="w-full border rounded-md px-3 py-2 pr-10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-sm text-red-500 animate-in fade-in">
                                        {error}
                                    </p>
                                )}

                                <button
                                    onClick={handlePassword}
                                    disabled={passwordLoading}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                                >
                                    {passwordLoading ? "Saving..." : "Update Password"}
                                </button>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}