import { CubeLoader } from "@/components/ui/cube-loader";

export default function DashboardLoading() {
  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center p-12 text-white min-h-[70vh]">
      <CubeLoader size={60} text="Synchronizing Command Center..." />
    </div>
  );
}
