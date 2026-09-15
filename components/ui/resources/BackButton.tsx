"use client";
import { useRouter } from "next/navigation";
export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/resources`)}
      className="bg-[#0F4C35] text-white w-full h-full border rounded-t-2xl font-medium text-center transition hover:bg-[#0D3F2C] hover:cursor-pointer"
    >
      Back
    </button>
  );
}
//useRouter it is react hook to make able to redirect to other page
