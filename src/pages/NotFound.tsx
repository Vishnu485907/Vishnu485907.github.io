import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import CredfixLogo from "@/components/CredfixLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#ededed] flex items-center justify-center font-primary p-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <CredfixLogo className="h-10" />
        </div>
        <h1 className="text-6xl font-bold text-pitch-black mb-2">404</h1>
        <p className="text-neutral-600 mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-orange text-white rounded-full px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
