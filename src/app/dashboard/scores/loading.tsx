import { CubeLoader } from "@/components/ui/cube-loader";

export default function ScoresLoading() {
  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center p-12 text-white min-h-[60vh]">
      <CubeLoader size={50} text="Loading Performance Core..." />
    </div>
  );
}
