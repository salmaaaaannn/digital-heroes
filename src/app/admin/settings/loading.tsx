import { CubeLoader } from "@/components/ui/cube-loader";

export default function AdminSettingsLoading() {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-white min-h-[60vh]">
      <CubeLoader size={50} text="Loading Admin Settings..." />
    </div>
  );
}
