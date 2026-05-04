import Navbar from "@/sections/Navbar";
import Hero from "@/sections/Hero";
import Features from "@/sections/Features";
import Community from "@/sections/Community";
import Footer from "@/sections/Footer";
import AiChat from "@/components/AiChat";
import HelpButton from "@/components/HelpButton";
import { isPreviewBuild } from "@/lib/runtime";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-primary">
      <Navbar />
      <Hero />
      <Features />
      <Community />
      <Footer />
      {!isPreviewBuild && <AiChat />}
      <HelpButton />
    </div>
  );
}
