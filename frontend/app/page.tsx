"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  router.push("/leads");
  return (
    <div>
    </div>
  );
}
