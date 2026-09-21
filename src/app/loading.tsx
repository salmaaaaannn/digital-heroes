import { CubeLoader } from "@/components/ui/cube-loader";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#080A0A] text-white">
      <CubeLoader size={75} text="Entering Digital Heroes..." />
    </div>
  );
}
