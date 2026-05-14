import { startTransition, useEffect, useState } from "react";
import {
  ArrowUpRight,
  Clapperboard,
  Command,
  Film,
  ImageIcon,
  Megaphone,
  Orbit,
  PanelsTopLeft,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { trpc } from "@/providers/trpc";
import { isStaticSite } from "@/lib/runtime";

type StudioMode = "image" | "video";
type StudioStatus =
  | "queued"
  | "in_progress"
  | "nsfw"
  | "failed"
  | "completed"
  | "canceled";

type StudioJobPayload = {
  status: StudioStatus;
  request_id: string;
  status_url?: string;
  cancel_url?: string;
  images?: Array<{ url: string }>;
  video?: { url: string };
  detail?: string;
  error?: string;
  message?: string;
};

type StudioJob = {
  kind: StudioMode;
  requestId: string;
  status: StudioStatus;
};

type QuickTool = {
  title: string;
  description: string;
  badge?: string;
  Icon: typeof Sparkles;
};

type ShowcaseCard = {
  title: string;
  description: string;
  eyebrow: string;
  cta: string;
  className: string;
  accentClassName: string;
};

type GallerySectionData = {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  tone: string;
  tags: string[];
};

const NAV_ITEMS = [
  "Explore",
  "Image",
  "Video",
  "Audio",
  "Collab",
  "Canvas",
  "Edit",
  "Character",
  "Marketing Studio",
  "MCP & CLI",
];

const QUICK_TOOLS: QuickTool[] = [
  {
    title: "Generate Video",
    description: "Direct short clips with text-only or image-led motion.",
    Icon: Clapperboard,
  },
  {
    title: "Seedance 2.0",
    description: "Cinematic motion presets for clean camera choreography.",
    Icon: Film,
  },
  {
    title: "Nano Banana Pro",
    description: "Fast character consistency and lighting-aware product swaps.",
    Icon: Sparkles,
    badge: "Unlimited",
  },
  {
    title: "Motion Control",
    description: "Keep movement stable while you push speed, zoom, and parallax.",
    Icon: Orbit,
    badge: "New",
  },
  {
    title: "Marketing Studio",
    description: "Hook-ready layouts for ads, launches, and social drops.",
    Icon: Megaphone,
  },
  {
    title: "Canvas",
    description: "Storyboard shots, pin references, and line up every beat.",
    Icon: PanelsTopLeft,
  },
];

const FEATURE_BANNERS: ShowcaseCard[] = [
  {
    eyebrow: "New Feature",
    title: "One canvas. Every workflow.",
    description:
      "Moodboard, draft variations, move shots around, and jump back into generation without leaving the page.",
    cta: "Try Canvas",
    className:
      "from-[#0f8f9b] via-[#0b4ec6] to-[#06194a] text-white shadow-[0_30px_80px_rgba(4,111,221,0.28)]",
    accentClassName:
      "bg-[radial-gradient(circle_at_25%_20%,rgba(166,255,105,0.35),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.18),transparent_20%),url('/images/pathway-bg.jpg')] bg-cover bg-center",
  },
  {
    eyebrow: "New Model",
    title: "Meet Soul Studio 2",
    description:
      "Sharper texture, better typography, and cleaner faces when you need campaign-ready stills.",
    cta: "Try Soul 2",
    className:
      "from-[#030303] via-[#111111] to-[#171717] text-white shadow-[0_30px_80px_rgba(0,0,0,0.4)]",
    accentClassName:
      "bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.42),transparent_18%),radial-gradient(circle_at_50%_80%,rgba(199,255,38,0.18),transparent_35%)]",
  },
];

const CREATOR_ROWS = [
  {
    title: "Create Image",
    description: "Prompt-first stills with editorial contrast.",
  },
  {
    title: "Create Video",
    description: "Animate your scene with camera-aware motion.",
  },
  {
    title: "Motion Control",
    description: "Direct zoom, whip, orbit, and track moves.",
  },
  {
    title: "Soul 2.0",
    description: "Sharper faces and cleaner product shots.",
    badge: "New",
  },
];

const TOP_CHOICES = [
  {
    title: "Nano Banana Pro",
    description: "Best for product replacements and controlled edits.",
    tone:
      "bg-[radial-gradient(circle_at_22%_22%,rgba(255,248,84,0.42),transparent_30%),linear-gradient(160deg,#ffe000,#8a7f00)]",
  },
  {
    title: "Motion Control",
    description: "Precise character motion with stable framing.",
    tone:
      "bg-[radial-gradient(circle_at_65%_20%,rgba(255,255,255,0.28),transparent_24%),linear-gradient(160deg,#1f1f2a,#10162a)]",
  },
  {
    title: "Skin Enhancer",
    description: "Natural pores, soft diffusion, and beauty lighting.",
    tone:
      "bg-[radial-gradient(circle_at_30%_25%,rgba(255,221,204,0.24),transparent_25%),linear-gradient(160deg,#2e1817,#120b0b)]",
  },
  {
    title: "Shots",
    description: "Nine framing presets you can drop into any concept.",
    tone:
      "bg-[radial-gradient(circle_at_78%_18%,rgba(198,255,47,0.2),transparent_24%),linear-gradient(160deg,#1a1e12,#090b08)]",
  },
  {
    title: "Angles 2.0",
    description: "Camera grammar for fast mood and perspective changes.",
    tone:
      "bg-[radial-gradient(circle_at_30%_20%,rgba(108,193,255,0.24),transparent_24%),linear-gradient(160deg,#0d1520,#05070a)]",
  },
];

const GALLERY_SECTIONS: GallerySectionData[] = [
  {
    eyebrow: "FRAMEFIELD SOUL CINEMA",
    title: "Editorial portraits and product frames with studio polish.",
    description:
      "Dial in natural skin, crisp edges, and ad-grade styling with the same dense gallery rhythm as the reference.",
    cta: "View all of Soul Cinema",
    tone:
      "bg-[radial-gradient(circle_at_10%_10%,rgba(203,255,64,0.18),transparent_28%),linear-gradient(180deg,#1b2209,#080b06)]",
    tags: ["Beauty", "Fashion", "Campaign", "Portrait", "Luxury", "Close-up"],
  },
  {
    eyebrow: "Kling 3.0 Exclusive Access",
    title: "Next-gen motion with text-only scenes or image-led direction.",
    description:
      "Use the same panel to launch standalone videos or animate a generated still into a polished moving shot.",
    cta: "View all of Kling 3.0",
    tone:
      "bg-[radial-gradient(circle_at_15%_20%,rgba(192,255,33,0.22),transparent_26%),linear-gradient(180deg,#162607,#060904)]",
    tags: ["Camera Move", "Product", "Fashion", "Narrative", "Loop", "Tracking"],
  },
  {
    eyebrow: "Mixed Media",
    title: "Layer paper, ink, chrome, texture, and film grain in one lane.",
    description:
      "This row keeps the same black-on-black card language while opening up a looser mixed-media palette.",
    cta: "View all of Mixed Media",
    tone:
      "bg-[radial-gradient(circle_at_82%_16%,rgba(255,93,0,0.2),transparent_20%),linear-gradient(180deg,#20140d,#090604)]",
    tags: ["Sketch", "Canvas", "Cut Paper", "Tracking", "Window", "Palette"],
  },
  {
    eyebrow: "Visual Effects",
    title: "Reactive transitions, lens tricks, and atmosphere builders.",
    description:
      "Create the VFX lookalike layer with reusable cards for rain, light leaks, particle sweeps, and zoom-driven transitions.",
    cta: "View all of Visual Effects",
    tone:
      "bg-[radial-gradient(circle_at_16%_16%,rgba(0,207,255,0.18),transparent_26%),linear-gradient(180deg,#111827,#07090c)]",
    tags: ["Warp", "Zoom", "Film Burn", "Particles", "Shadow", "Flares"],
  },
  {
    eyebrow: "Studio Apps",
    title: "Utility workflows for ads, hooks, lipsync, and cleanup passes.",
    description:
      "The layout mirrors the long-scroll discovery feel: quick labels, dense card grids, and lime CTAs breaking the darkness.",
    cta: "View all of Studio Apps",
    tone:
      "bg-[radial-gradient(circle_at_16%_16%,rgba(198,255,47,0.14),transparent_28%),linear-gradient(180deg,#171818,#070707)]",
    tags: ["Zoomer", "Skin", "Lipsync", "Watch Cut", "Ghost", "Dump"],
  },
  {
    eyebrow: "FRAMEFIELD SOUL",
    title: "High-fidelity still image generation for premium campaigns.",
    description:
      "Use the image form for a direct call into Soul Standard and keep the outputs ready for the video flow right beside it.",
    cta: "View all of Framefield Soul",
    tone:
      "bg-[radial-gradient(circle_at_85%_14%,rgba(255,255,255,0.12),transparent_18%),linear-gradient(180deg,#1a1a1a,#080808)]",
    tags: ["Gloss", "E-commerce", "Portrait", "Lifestyle", "Hero Shot", "Beauty"],
  },
  {
    eyebrow: "Kling 2.5 Turbo",
    title: "Fast motion studies built for iteration speed.",
    description:
      "When you want velocity over polish, use the same interface to branch into shorter clips and prompt tests.",
    cta: "View all of Kling 2.5 Turbo",
    tone:
      "bg-[radial-gradient(circle_at_15%_15%,rgba(107,180,255,0.15),transparent_22%),linear-gradient(180deg,#10151b,#05070a)]",
    tags: ["Rain", "Crash", "Tracking", "Spin", "Water", "Shadow"],
  },
];

const EXPLORE_TAGS = [
  "Cinema Studio",
  "Visual Effects",
  "Soul",
  "Studio Apps",
  "Kling",
  "Character Controls",
  "Marketing",
  "Motion",
  "Hooks",
  "Nano Banana",
  "Product Swap",
  "Prompt Library",
  "Upscale",
  "Assistant",
  "YouTube",
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
];

const FOOTER_COLUMNS = [
  {
    title: "Framefield AI",
    items: [
      "About",
      "Careers",
      "Pricing",
      "Contact",
      "Community",
      "Enterprise",
    ],
  },
  {
    title: "Image",
    items: ["AI Image", "Draw to Edit", "Fashion", "Prompt Guide", "GPT Image 2"],
  },
  {
    title: "Video",
    items: [
      "AI Video",
      "Mixed Media",
      "Create Video",
      "Image to Video",
      "Soul Cinema",
    ],
  },
  {
    title: "Edit",
    items: ["Banana Placement", "Edit Image", "Upscale", "Replace", "Product Clean"],
  },
];

const TILE_PATTERNS = [
  "md:row-span-2",
  "",
  "",
  "md:row-span-2",
  "",
  "",
  "md:col-span-2",
  "",
  "md:row-span-2",
  "",
  "",
  "md:col-span-2",
];

export default function Home() {
  const capabilitiesQuery = trpc.higgsfield.capabilities.useQuery(undefined, {
    enabled: !isStaticSite,
    retry: false,
  });
  const [mode, setMode] = useState<StudioMode>("image");
  const [imagePrompt, setImagePrompt] = useState(
    "A luxury skin-care bottle on black volcanic glass, cinematic lighting, crisp typography, premium beauty campaign.",
  );
  const [imageAspectRatio, setImageAspectRatio] = useState("4:3");
  const [imageResolution, setImageResolution] = useState("1080p");
  const [imageBatchSize, setImageBatchSize] = useState("1");
  const [videoPrompt, setVideoPrompt] = useState(
    "Slow dolly-in, soft rim light, elegant motion, premium ad energy.",
  );
  const [videoAspectRatio, setVideoAspectRatio] = useState("16:9");
  const [videoResolution, setVideoResolution] = useState("720");
  const [videoDuration, setVideoDuration] = useState("5");
  const [videoSourceImage, setVideoSourceImage] = useState("");
  const [cameraFixed, setCameraFixed] = useState(false);
  const [job, setJob] = useState<StudioJob | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [latestImageUrl, setLatestImageUrl] = useState("");
  const [latestVideoUrl, setLatestVideoUrl] = useState("");

  const configured = capabilitiesQuery.data?.configured ?? false;
  const shouldPoll =
    job?.status === "queued" || job?.status === "in_progress";
  const statusQuery = trpc.higgsfield.status.useQuery(
    { requestId: job?.requestId ?? "pending" },
    {
      enabled: Boolean(job?.requestId),
      retry: false,
      refetchInterval: shouldPoll ? 3000 : false,
      refetchOnWindowFocus: false,
    },
  );
  const createImageMutation = trpc.higgsfield.createImage.useMutation();
  const createVideoMutation = trpc.higgsfield.createVideo.useMutation();

  function applyPayload(kind: StudioMode, payload: StudioJobPayload) {
    setJob({
      kind,
      requestId: payload.request_id,
      status: payload.status,
    });

    if (payload.images?.[0]?.url) {
      setLatestImageUrl(payload.images[0].url);
      setVideoSourceImage((current) => current || payload.images?.[0]?.url || "");
    }

    if (payload.video?.url) {
      setLatestVideoUrl(payload.video.url);
    }

    if (
      payload.status === "failed" ||
      payload.status === "nsfw" ||
      payload.status === "canceled"
    ) {
      setErrorMessage(
        payload.message ||
          payload.error ||
          payload.detail ||
          "The generation did not complete.",
      );
    }
  }

  useEffect(() => {
    if (!statusQuery.data || !job) {
      return;
    }

    const nextPayload = statusQuery.data as StudioJobPayload;
    queueMicrotask(() => {
      applyPayload(job.kind, nextPayload);
    });
  }, [job, statusQuery.data]);

  async function handleImageSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    try {
      const payload = (await createImageMutation.mutateAsync({
        prompt: imagePrompt,
        aspectRatio: imageAspectRatio as
          | "9:16"
          | "16:9"
          | "4:3"
          | "3:4"
          | "1:1"
          | "2:3"
          | "3:2",
        resolution: imageResolution as "720p" | "1080p",
        batchSize: imageBatchSize === "4" ? 4 : 1,
        enhancePrompt: true,
        styleStrength: 1,
      })) as StudioJobPayload;

      applyPayload("image", payload);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Image generation failed.",
      );
    }
  }

  async function handleVideoSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    try {
      const payload = (await createVideoMutation.mutateAsync({
        prompt: videoPrompt,
        sourceImageUrl: videoSourceImage,
        aspectRatio: videoAspectRatio as
          | "16:9"
          | "9:16"
          | "4:3"
          | "3:4"
          | "1:1"
          | "21:9",
        resolution: videoResolution as "480" | "720" | "1080",
        duration: Number(videoDuration),
        cameraFixed,
      })) as StudioJobPayload;

      applyPayload("video", payload);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Video generation failed.",
      );
    }
  }

  const activePayload = (statusQuery.data as StudioJobPayload | undefined) ?? null;
  const activeStatus = activePayload?.status ?? job?.status;
  const pending = createImageMutation.isPending || createVideoMutation.isPending;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(197,255,54,0.08),transparent_28%),radial-gradient(circle_at_20%_20%,rgba(0,150,255,0.08),transparent_26%)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-4 px-3 py-3 md:px-6">
          <div className="flex items-center gap-4">
            <div className="rounded-md border border-lime-300/35 bg-lime-300/10 px-3 py-1 font-headline text-2xl uppercase tracking-[0.24em] text-lime-300">
              FRAMEFIELD
            </div>
            <span className="hidden font-display text-[10px] uppercase tracking-[0.34em] text-white/45 md:block">
              Studio Beta
            </span>
          </div>

          <nav className="hidden items-center gap-4 xl:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href="#"
                className="font-display text-[11px] uppercase tracking-[0.26em] text-white/68 transition hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-2 py-1 font-display text-[10px] uppercase tracking-[0.24em] text-fuchsia-200 md:inline-flex">
              Pricing
            </span>
            <Button
              variant="ghost"
              className="h-8 rounded-full border border-white/10 bg-white/5 px-4 font-display text-[11px] uppercase tracking-[0.26em] text-white hover:bg-white/10"
            >
              Login
            </Button>
            <Button className="h-8 rounded-full bg-lime-300 px-4 font-display text-[11px] uppercase tracking-[0.26em] text-black hover:bg-lime-200">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-[1560px] space-y-4 px-3 pb-24 pt-4 md:px-6 md:pt-5">
        <section className="grid gap-3 xl:grid-cols-[1.32fr_0.98fr]">
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <HeroPromoCard />
              <CliPromoCard />
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[26px] border border-white/8 bg-[#111214] p-4 shadow-[0_25px_60px_rgba(0,0,0,0.28)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-[10px] uppercase tracking-[0.3em] text-white/45">
                      What will you create today?
                    </p>
                    <h2 className="mt-2 max-w-lg font-display text-3xl uppercase tracking-[0.08em] text-white md:text-4xl">
                      A gallery-first studio for images, motion, and launch-ready assets.
                    </h2>
                  </div>
                  <Button className="hidden rounded-full bg-lime-300 px-4 font-display text-[11px] uppercase tracking-[0.22em] text-black hover:bg-lime-200 md:inline-flex">
                    Explore Studio
                  </Button>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {CREATOR_ROWS.map((item) => (
                    <div
                      key={item.title}
                      className="group rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-3 transition hover:border-lime-300/35"
                    >
                      <div className="overflow-hidden rounded-[18px] border border-white/8 bg-[radial-gradient(circle_at_20%_20%,rgba(194,255,61,0.16),transparent_22%),linear-gradient(160deg,#25272b,#111214)] p-3">
                        <div className="aspect-[1.08/1] rounded-[14px] border border-white/8 bg-[radial-gradient(circle_at_70%_18%,rgba(255,255,255,0.18),transparent_18%),linear-gradient(160deg,#23262a,#0d0e10)]" />
                      </div>
                      <div className="mt-3 flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-lg uppercase tracking-[0.05em] text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm text-white/58">
                            {item.description}
                          </p>
                        </div>
                        {item.badge ? (
                          <span className="rounded-full bg-lime-300 px-2 py-1 font-display text-[10px] uppercase tracking-[0.18em] text-black">
                            {item.badge}
                          </span>
                        ) : (
                          <ArrowUpRight className="mt-1 size-4 text-white/35 transition group-hover:text-lime-300" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {QUICK_TOOLS.map((item) => (
                  <MiniToolCard key={item.title} item={item} />
                ))}
              </div>
            </div>
          </div>

          <aside className="xl:sticky xl:top-[88px] xl:self-start">
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#121315,#090909)] p-4 shadow-[0_35px_80px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-4">
                <div>
                  <p className="font-display text-[10px] uppercase tracking-[0.32em] text-white/45">
                    Studio Console
                  </p>
                  <h2 className="mt-2 font-display text-3xl uppercase tracking-[0.12em] text-lime-300">
                    Generate
                  </h2>
                </div>
                <div className="text-right">
                  <StatusPill configured={configured} />
                  <p className="mt-2 text-xs text-white/46">
                    {isStaticSite
                      ? "Static GitHub Pages preview."
                      : capabilitiesQuery.isLoading
                      ? "Checking API configuration..."
                      : configured
                        ? "Server keys are live."
                        : "Waiting for API keys."}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex rounded-full border border-white/10 bg-white/[0.03] p-1">
                {(["image", "video"] as StudioMode[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={cn(
                      "flex-1 rounded-full px-4 py-2 font-display text-xs uppercase tracking-[0.24em] transition",
                      mode === item
                        ? "bg-lime-300 text-black"
                        : "text-white/55 hover:text-white",
                    )}
                  >
                    {item === "image" ? "Image" : "Video"}
                  </button>
                ))}
              </div>

              {mode === "image" ? (
                <form className="mt-4 space-y-4" onSubmit={handleImageSubmit}>
                  <div>
                    <label className="mb-2 block font-display text-[11px] uppercase tracking-[0.24em] text-white/55">
                      Prompt
                    </label>
                    <Textarea
                      value={imagePrompt}
                      onChange={(event) => setImagePrompt(event.target.value)}
                      className="min-h-28 rounded-[20px] border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/28 focus-visible:border-lime-300/55 focus-visible:ring-lime-300/25"
                      placeholder="Describe your shot..."
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <SelectField
                      label="Aspect"
                      value={imageAspectRatio}
                      onChange={setImageAspectRatio}
                      options={["4:3", "3:4", "1:1", "16:9", "9:16", "3:2", "2:3"]}
                    />
                    <SelectField
                      label="Resolution"
                      value={imageResolution}
                      onChange={setImageResolution}
                      options={["720p", "1080p"]}
                    />
                    <SelectField
                      label="Outputs"
                      value={imageBatchSize}
                      onChange={setImageBatchSize}
                      options={["1", "4"]}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!configured || pending}
                    className="h-12 w-full rounded-full bg-lime-300 font-display text-[12px] uppercase tracking-[0.28em] text-black hover:bg-lime-200"
                  >
                    {createImageMutation.isPending ? "Launching..." : "Start Creating"}
                  </Button>
                </form>
              ) : (
                <form className="mt-4 space-y-4" onSubmit={handleVideoSubmit}>
                  <div>
                    <label className="mb-2 block font-display text-[11px] uppercase tracking-[0.24em] text-white/55">
                      Prompt
                    </label>
                    <Textarea
                      value={videoPrompt}
                      onChange={(event) => setVideoPrompt(event.target.value)}
                      className="min-h-24 rounded-[20px] border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/28 focus-visible:border-lime-300/55 focus-visible:ring-lime-300/25"
                      placeholder="Describe the motion..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-display text-[11px] uppercase tracking-[0.24em] text-white/55">
                      Source Image URL
                    </label>
                    <div className="space-y-2">
                      <Input
                        value={videoSourceImage}
                        onChange={(event) => setVideoSourceImage(event.target.value)}
                        className="h-11 rounded-full border-white/10 bg-white/5 px-4 text-white placeholder:text-white/28 focus-visible:border-lime-300/55 focus-visible:ring-lime-300/25"
                        placeholder="Leave empty for text-to-video"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          latestImageUrl &&
                          startTransition(() => {
                            setVideoSourceImage(latestImageUrl);
                          })
                        }
                        className="font-display text-[11px] uppercase tracking-[0.2em] text-lime-300 transition hover:text-lime-200 disabled:text-white/20"
                        disabled={!latestImageUrl}
                      >
                        Use latest generated image
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <SelectField
                      label="Aspect"
                      value={videoAspectRatio}
                      onChange={setVideoAspectRatio}
                      options={["16:9", "9:16", "1:1", "4:3", "3:4", "21:9"]}
                    />
                    <SelectField
                      label="Resolution"
                      value={videoResolution}
                      onChange={setVideoResolution}
                      options={["480", "720", "1080"]}
                    />
                    <SelectField
                      label="Duration"
                      value={videoDuration}
                      onChange={setVideoDuration}
                      options={["5", "8", "10", "12"]}
                    />
                  </div>

                  <label className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/72">
                    <input
                      type="checkbox"
                      checked={cameraFixed}
                      onChange={(event) => setCameraFixed(event.target.checked)}
                      className="size-4 rounded border-white/20 bg-transparent accent-lime-300"
                    />
                    Lock the camera for steadier motion
                  </label>

                  <Button
                    type="submit"
                    disabled={!configured || pending}
                    className="h-12 w-full rounded-full bg-lime-300 font-display text-[12px] uppercase tracking-[0.28em] text-black hover:bg-lime-200"
                  >
                    {createVideoMutation.isPending ? "Launching..." : "Render Video"}
                  </Button>
                </form>
              )}

              <div className="mt-4 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-[10px] uppercase tracking-[0.28em] text-white/45">
                      Output
                    </p>
                    <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.08em] text-white">
                      Live render panel
                    </h3>
                  </div>
                  {activeStatus ? <RenderStatus status={activeStatus} /> : null}
                </div>

                <div className="mt-4 overflow-hidden rounded-[22px] border border-white/10 bg-[#0b0d10]">
                  <div className="aspect-[1.05/1]">
                    {activePayload?.video?.url ? (
                      <video
                        src={activePayload.video.url}
                        controls
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : activePayload?.images?.length ? (
                      <div className="grid h-full grid-cols-2 gap-px bg-white/10">
                        {activePayload.images.map((item) => (
                          <img
                            key={item.url}
                            src={item.url}
                            alt="Generated output"
                            className="h-full w-full object-cover"
                          />
                        ))}
                      </div>
                    ) : latestVideoUrl ? (
                      <video
                        src={latestVideoUrl}
                        controls
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : latestImageUrl ? (
                      <img
                        src={latestImageUrl}
                        alt="Latest generated result"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_25%,rgba(198,255,47,0.16),transparent_22%),linear-gradient(180deg,#111214,#090909)] px-8 text-center">
                        <ImageIcon className="size-10 text-lime-300/80" />
                        <p className="mt-4 font-display text-xl uppercase tracking-[0.12em] text-white">
                          Ready to render
                        </p>
                        <p className="mt-2 max-w-sm text-sm text-white/48">
                          Generate a still with Soul Standard or launch a motion pass with Seedance using the same console.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <InfoChip label="Request ID" value={job?.requestId || "No job yet"} />
                  <InfoChip
                    label="Active Flow"
                    value={job?.kind === "video" ? "Video" : job?.kind === "image" ? "Image" : "Idle"}
                  />
                </div>

                {errorMessage ? (
                  <p className="mt-3 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                    {errorMessage}
                  </p>
                ) : null}

                {!configured ? (
                  <p className="mt-3 rounded-2xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
                    {isStaticSite
                      ? "This GitHub Pages deployment is a static live preview. Deploy the Node server with HIGGSFIELD_API_KEY and HIGGSFIELD_API_SECRET to enable rendering."
                      : (
                        <>
                          Add <code>HIGGSFIELD_API_KEY</code> and{" "}
                          <code>HIGGSFIELD_API_SECRET</code> to the server
                          environment to enable rendering.
                        </>
                      )}
                  </p>
                ) : null}
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-3 lg:grid-cols-2">
          {FEATURE_BANNERS.map((card) => (
            <FeatureBanner key={card.title} card={card} />
          ))}
        </section>

        <section className="grid gap-3 lg:grid-cols-[1.04fr_0.96fr]">
          <PromoModule
            eyebrow="Top Choice"
            title="One link in. Marketing out."
            description="Turn a product URL into hook variations, promo visuals, and launch-ready layouts without retyping your brief."
            cta="Try Marketing Studio"
            tone="from-[#140b10] via-[#1b0b14] to-[#2d0f25]"
            detailTone="bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_18%),linear-gradient(180deg,#311019,#11060c)]"
          />
          <PromoModule
            eyebrow="Available for Everyone"
            title="Seedance 2.0"
            description="World-class motion studies with a faster loop for ideas that need immediate video iteration."
            cta="Get Seedance 2.0"
            tone="from-[#08142b] via-[#091e44] to-[#0f447d]"
            detailTone="bg-[radial-gradient(circle_at_78%_20%,rgba(121,209,255,0.2),transparent_18%),linear-gradient(180deg,#0b244c,#08101f)]"
          />
        </section>

        <section className="overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(90deg,#070707,#101725)] p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.3em] text-white/40">
                Digital Series
              </p>
              <h2 className="mt-2 font-headline text-6xl uppercase leading-none tracking-[0.12em] text-white md:text-8xl">
                Mork
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-white/58 md:text-base">
                A full-bleed banner built to echo the original site’s cinematic interruptions between product rails.
              </p>
            </div>
            <Button className="rounded-full border border-white/10 bg-white/6 px-5 font-display text-[11px] uppercase tracking-[0.24em] text-white hover:bg-white/12">
              Watch Now
            </Button>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/8 bg-[#101112] p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.3em] text-white/40">
                Creator Mode
              </p>
              <h2 className="mt-2 font-display text-4xl uppercase tracking-[0.08em] text-white">
                Top choice
              </h2>
              <p className="mt-2 text-sm text-white/52">
                Creator-commented tools tailored for quick wins.
              </p>
            </div>
            <Button className="rounded-full border border-white/10 bg-white/6 px-5 font-display text-[11px] uppercase tracking-[0.24em] text-white hover:bg-white/12">
              See All
            </Button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {latestImageUrl ? (
              <div className="overflow-hidden rounded-[22px] border border-lime-300/22 bg-[#0b0d10]">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={latestImageUrl}
                    alt="Latest generated image"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="font-display text-lg uppercase tracking-[0.05em] text-white">
                    Your Latest Render
                  </p>
                  <p className="mt-1 text-sm text-white/55">
                    Fresh output from the live Soul Standard panel.
                  </p>
                </div>
              </div>
            ) : null}

            {TOP_CHOICES.slice(0, latestImageUrl ? 4 : 5).map((item) => (
              <div
                key={item.title}
                className="overflow-hidden rounded-[22px] border border-white/8 bg-[#0b0d10]"
              >
                <div className={cn("aspect-square", item.tone)} />
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-lg uppercase tracking-[0.05em] text-white">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-white/55">
                        {item.description}
                      </p>
                    </div>
                    <ArrowUpRight className="mt-1 size-4 text-white/32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {GALLERY_SECTIONS.map((section) => (
          <GallerySection key={section.eyebrow} section={section} />
        ))}

        <section className="rounded-[28px] border border-white/8 bg-[#0f1011] px-4 py-10 md:px-6">
          <h2 className="text-center font-display text-4xl uppercase tracking-[0.08em] text-white">
            Explore more AI features
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {EXPLORE_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.2em] text-white/62"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <footer className="overflow-hidden rounded-[28px] border border-lime-300/25 bg-lime-300 text-black">
          <div className="grid gap-8 px-4 py-8 md:grid-cols-[1.2fr_repeat(4,1fr)] md:px-6 md:py-10">
            <div>
              <p className="font-display text-[11px] uppercase tracking-[0.28em] text-black/55">
                The ultimate AI-powered camera control for filmmakers and creators
              </p>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="font-display text-sm uppercase tracking-[0.2em]">
                  {column.title}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-black/72">
                  {column.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-black/10 px-4 py-4 text-sm text-black/70 md:flex-row md:items-center md:justify-between md:px-6">
            <p>565 Mission St, San Francisco, CA, 94105</p>
            <p>X / Twitter • YouTube • Instagram • LinkedIn • TikTok</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function HeroPromoCard() {
  return (
    <div className="overflow-hidden rounded-[26px] border border-white/8 bg-[linear-gradient(135deg,#16020d,#09090b_45%,#111215)] p-4">
      <p className="font-display text-[10px] uppercase tracking-[0.28em] text-white/42">
        Marketing Studio Hooks
      </p>
      <div className="mt-4 flex min-h-[290px] flex-col justify-between rounded-[22px] border border-white/8 bg-[radial-gradient(circle_at_18%_16%,rgba(255,118,168,0.18),transparent_26%),linear-gradient(160deg,#1f0712,#0d0e10)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 font-display text-[10px] uppercase tracking-[0.22em] text-white/75">
            Hook Builder
          </div>
          <Sparkles className="size-4 text-lime-300" />
        </div>

        <div className="grid gap-3 sm:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[18px] border border-white/8 bg-white/6 p-3">
            <div className="aspect-[0.85/1] rounded-[14px] bg-[radial-gradient(circle_at_60%_18%,rgba(255,255,255,0.2),transparent_20%),linear-gradient(160deg,#40202a,#121315)]" />
          </div>
          <div className="flex flex-col justify-end">
            <h2 className="font-display text-4xl uppercase leading-none tracking-[0.06em] text-white">
              Create viral video hooks
            </h2>
            <p className="mt-3 max-w-sm text-sm text-white/56">
              Product lineups, creator angles, and launch visuals in the same dense, card-heavy composition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CliPromoCard() {
  return (
    <div className="overflow-hidden rounded-[26px] border border-white/8 bg-[#0d0f11] p-4">
      <p className="font-display text-[10px] uppercase tracking-[0.28em] text-white/42">
        Studio CLI
      </p>
      <div className="mt-4 min-h-[290px] rounded-[22px] border border-lime-300/18 bg-[linear-gradient(180deg,rgba(198,255,47,0.08),transparent_40%),linear-gradient(160deg,#0d0d0d,#1a1a1a)] p-4">
        <div className="flex items-center gap-2 text-lime-300">
          <Command className="size-4" />
          <span className="font-display text-[10px] uppercase tracking-[0.24em]">
            Terminal-linked workflows
          </span>
        </div>
        <div className="mt-6 rounded-[18px] border border-white/8 bg-[radial-gradient(circle_at_50%_50%,rgba(198,255,47,0.12),transparent_28%),linear-gradient(180deg,#111214,#08090a)] p-5">
          <p className="font-headline text-5xl uppercase tracking-[0.14em] text-lime-300 md:text-6xl">
            Framefield CLI
          </p>
          <p className="mt-4 max-w-sm text-sm text-white/56">
            Launch image and video generations from the app while keeping the landing page feel unmistakably cinematic.
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniToolCard({ item }: { item: QuickTool }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-[#111214] p-4 transition hover:border-lime-300/30">
      <div className="flex items-center justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <item.Icon className="size-4 text-lime-300" />
        </div>
        {item.badge ? (
          <span className="rounded-full bg-lime-300 px-2 py-1 font-display text-[10px] uppercase tracking-[0.18em] text-black">
            {item.badge}
          </span>
        ) : null}
      </div>
      <h3 className="mt-5 font-display text-xl uppercase tracking-[0.06em] text-white">
        {item.title}
      </h3>
      <p className="mt-2 text-sm text-white/55">{item.description}</p>
    </div>
  );
}

function FeatureBanner({ card }: { card: ShowcaseCard }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] border border-white/8 bg-gradient-to-br p-4 md:p-5",
        card.className,
      )}
    >
      <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr] md:items-center">
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.28em] text-white/55">
            {card.eyebrow}
          </p>
          <h2 className="mt-3 max-w-md font-display text-4xl uppercase leading-none tracking-[0.06em] md:text-5xl">
            {card.title}
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/70 md:text-base">
            {card.description}
          </p>
          <Button className="mt-5 rounded-full bg-white px-5 font-display text-[11px] uppercase tracking-[0.24em] text-black hover:bg-white/90">
            {card.cta}
          </Button>
        </div>

        <div
          className={cn(
            "relative min-h-[260px] overflow-hidden rounded-[24px] border border-white/10 p-4",
            card.accentClassName,
          )}
        >
          <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-display text-[10px] uppercase tracking-[0.22em] text-white/75">
            Preview
          </div>
          <div className="grid h-full grid-cols-3 gap-3">
            <div className="rounded-[18px] border border-white/10 bg-white/15" />
            <div className="rounded-[18px] border border-white/10 bg-white/5" />
            <div className="rounded-[18px] border border-white/10 bg-white/10" />
            <div className="col-span-2 rounded-[18px] border border-white/10 bg-white/10" />
            <div className="rounded-[18px] border border-white/10 bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PromoModule({
  eyebrow,
  title,
  description,
  cta,
  tone,
  detailTone,
}: {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  tone: string;
  detailTone: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-[28px] border border-white/8 bg-gradient-to-br p-4 md:p-5", tone)}>
      <div className="grid min-h-[320px] gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.28em] text-white/45">
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-sm font-display text-4xl uppercase leading-none tracking-[0.06em] text-white md:text-5xl">
            {title}
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/64 md:text-base">
            {description}
          </p>
          <Button className="mt-5 rounded-full bg-white px-5 font-display text-[11px] uppercase tracking-[0.24em] text-black hover:bg-white/90">
            {cta}
          </Button>
        </div>

        <div className={cn("min-h-[220px] rounded-[22px] border border-white/10 p-4", detailTone)}>
          <div className="grid h-full grid-cols-4 gap-3">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-[16px] border border-white/8 bg-white/5",
                  index % 4 === 0 ? "row-span-2" : "",
                  index === 7 ? "col-span-2" : "",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GallerySection({ section }: { section: GallerySectionData }) {
  return (
    <section className="rounded-[28px] border border-white/8 bg-[#0f1011] p-4 md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.3em] text-lime-300">
            {section.eyebrow}
          </p>
          <h2 className="mt-2 max-w-3xl font-display text-4xl uppercase tracking-[0.08em] text-white">
            {section.title}
          </h2>
          <p className="mt-2 max-w-4xl text-sm text-white/50 md:text-base">
            {section.description}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-[320px_1fr]">
        <div className={cn("rounded-[24px] border border-white/8 p-5", section.tone)}>
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl border border-lime-300/20 bg-lime-300/10">
                <WandSparkles className="size-5 text-lime-300" />
              </div>
              <h3 className="mt-5 font-display text-4xl uppercase leading-none tracking-[0.06em] text-white">
                {section.eyebrow}
              </h3>
              <p className="mt-3 text-sm text-white/68">{section.description}</p>
            </div>

            <div>
              <Button className="rounded-full bg-lime-300 px-5 font-display text-[11px] uppercase tracking-[0.24em] text-black hover:bg-lime-200">
                {section.cta}
              </Button>
              <div className="mt-4 flex flex-wrap gap-2">
                {section.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-display text-[10px] uppercase tracking-[0.2em] text-white/62"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid auto-rows-[86px] gap-3 md:grid-cols-3 xl:grid-cols-5">
          {TILE_PATTERNS.map((pattern, index) => (
            <div
              key={`${section.eyebrow}-${index}`}
              className={cn(
                "overflow-hidden rounded-[20px] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
                pattern,
              )}
            >
              <div className="h-full w-full bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.08),transparent_22%),linear-gradient(180deg,#202325,#111214)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-display text-[11px] uppercase tracking-[0.24em] text-white/55">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-lime-300/55"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#111214] text-white">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatusPill({ configured }: { configured: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 font-display text-[10px] uppercase tracking-[0.22em]",
        configured
          ? "border-lime-300/30 bg-lime-300/10 text-lime-300"
          : "border-amber-300/30 bg-amber-300/10 text-amber-100",
      )}
    >
      {configured ? "API Ready" : "Setup Needed"}
    </span>
  );
}

function RenderStatus({ status }: { status: StudioStatus }) {
  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 font-display text-[10px] uppercase tracking-[0.22em]",
        status === "completed"
          ? "border-lime-300/30 bg-lime-300/10 text-lime-300"
          : status === "failed" || status === "nsfw"
            ? "border-rose-400/30 bg-rose-400/10 text-rose-100"
            : "border-sky-300/30 bg-sky-300/10 text-sky-100",
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="font-display text-[10px] uppercase tracking-[0.22em] text-white/42">
        {label}
      </p>
      <p className="mt-1 truncate text-sm text-white/72">{value}</p>
    </div>
  );
}
