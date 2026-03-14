"use client";

export default function TopLoader() {
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-full px-4 py-2 flex items-center justify-center border">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    );
}