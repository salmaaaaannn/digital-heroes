import { CubeLoader } from "@/components/ui/cube-loader";

export default function AdminSubsLoading() {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-white min-h-[60vh]">
      <CubeLoader size={50} text="Loading Subscriptions..." />
    </div>
  );
}
