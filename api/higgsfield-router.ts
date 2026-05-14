import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "./lib/env";
import { createRouter, publicQuery } from "./middleware";

const HIGGSFIELD_BASE_URL = "https://platform.higgsfield.ai";

const imageAspectRatioSchema = z.enum([
  "9:16",
  "16:9",
  "4:3",
  "3:4",
  "1:1",
  "2:3",
  "3:2",
]);

const videoAspectRatioSchema = z.enum([
  "16:9",
  "9:16",
  "4:3",
  "3:4",
  "1:1",
  "21:9",
]);

const imageResolutionSchema = z.enum(["720p", "1080p"]);
const videoResolutionSchema = z.enum(["480", "720", "1080"]);
const requestStatusSchema = z.enum([
  "queued",
  "in_progress",
  "nsfw",
  "failed",
  "completed",
  "canceled",
]);

type HiggsfieldMedia = {
  url: string;
};

type HiggsfieldRequestStatus = {
  status: z.infer<typeof requestStatusSchema>;
  request_id: string;
  status_url?: string;
  cancel_url?: string;
  images?: HiggsfieldMedia[];
  video?: HiggsfieldMedia;
  detail?: string;
  error?: string;
  message?: string;
};

function normalizeMedia(entry: unknown): HiggsfieldMedia | undefined {
  if (typeof entry === "string" && entry.trim().length > 0) {
    return { url: entry };
  }

  if (entry && typeof entry === "object") {
    const record = entry as Record<string, unknown>;
    if (typeof record.url === "string" && record.url.trim().length > 0) {
      return { url: record.url };
    }
  }

  return undefined;
}

function normalizeMediaList(entry: unknown): HiggsfieldMedia[] | undefined {
  if (!Array.isArray(entry)) {
    return undefined;
  }

  const items = entry
    .map((value) => normalizeMedia(value))
    .filter((value): value is HiggsfieldMedia => Boolean(value));

  return items.length > 0 ? items : undefined;
}

function normalizeStatus(payload: unknown): HiggsfieldRequestStatus {
  const record = payload && typeof payload === "object"
    ? (payload as Record<string, unknown>)
    : {};
  const result =
    record.result && typeof record.result === "object"
      ? (record.result as Record<string, unknown>)
      : {};

  const images =
    normalizeMediaList(record.images) ??
    normalizeMediaList(result.images) ??
    normalizeMediaList(record.outputs) ??
    normalizeMediaList(result.outputs);
  const video =
    normalizeMedia(record.video) ??
    normalizeMedia(result.video) ??
    normalizeMedia(record.output) ??
    normalizeMedia(result.output);

  return {
    status: requestStatusSchema.parse(record.status),
    request_id: String(record.request_id ?? record.requestId ?? ""),
    status_url:
      typeof record.status_url === "string" ? record.status_url : undefined,
    cancel_url:
      typeof record.cancel_url === "string" ? record.cancel_url : undefined,
    detail: typeof record.detail === "string" ? record.detail : undefined,
    error: typeof record.error === "string" ? record.error : undefined,
    message: typeof record.message === "string" ? record.message : undefined,
    images,
    video,
  };
}

function getAuthorizationHeader() {
  if (!env.higgsfieldApiKey || !env.higgsfieldApiSecret) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Higgsfield API keys are not configured. Add HIGGSFIELD_API_KEY and HIGGSFIELD_API_SECRET on the server.",
    });
  }

  return `Key ${env.higgsfieldApiKey}:${env.higgsfieldApiSecret}`;
}

function parseJson<T>(text: string): T | null {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function getErrorMessage(payload: unknown, status: number) {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const message =
      record.detail ?? record.error ?? record.message ?? record.title;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  return `Higgsfield request failed with status ${status}.`;
}

async function higgsfieldFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${HIGGSFIELD_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: getAuthorizationHeader(),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  const payload = parseJson<T>(text);

  if (!response.ok) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: getErrorMessage(payload, response.status),
    });
  }

  if (payload === null) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Higgsfield returned an empty response.",
    });
  }

  return payload;
}

export const higgsfieldRouter = createRouter({
  capabilities: publicQuery.query(() => ({
    configured: Boolean(env.higgsfieldApiKey && env.higgsfieldApiSecret),
    defaultImageModel: "higgsfield-ai/soul/standard",
    defaultVideoModel: "bytedance/seedance/v1/lite",
  })),

  createImage: publicQuery
    .input(
      z.object({
        prompt: z.string().min(3).max(2000),
        aspectRatio: imageAspectRatioSchema.default("4:3"),
        resolution: imageResolutionSchema.default("1080p"),
        batchSize: z.union([z.literal(1), z.literal(4)]).default(1),
        enhancePrompt: z.boolean().default(true),
        styleStrength: z.number().min(0).max(1).default(1),
      }),
    )
    .mutation(async ({ input }) => {
      const payload = await higgsfieldFetch<unknown>("/higgsfield-ai/soul/standard", {
        method: "POST",
        body: JSON.stringify({
          prompt: input.prompt,
          aspect_ratio: input.aspectRatio,
          resolution: input.resolution,
          batch_size: input.batchSize,
          enhance_prompt: input.enhancePrompt,
          style_strength: input.styleStrength,
        }),
      });

      return normalizeStatus(payload);
    }),

  createVideo: publicQuery
    .input(
      z.object({
        prompt: z.string().min(3).max(2000),
        sourceImageUrl: z
          .string()
          .trim()
          .url("Source image must be a valid URL")
          .optional()
          .or(z.literal("")),
        aspectRatio: videoAspectRatioSchema.default("16:9"),
        resolution: videoResolutionSchema.default("720"),
        duration: z.number().int().min(2).max(12).default(5),
        cameraFixed: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input }) => {
      const sourceImageUrl = input.sourceImageUrl || undefined;
      const endpoint = sourceImageUrl
        ? "/bytedance/seedance/v1/lite/image-to-video"
        : "/bytedance/seedance/v1/lite/text-to-video";

      const payload = await higgsfieldFetch<unknown>(endpoint, {
        method: "POST",
        body: JSON.stringify({
          prompt: input.prompt,
          image_url: sourceImageUrl,
          aspect_ratio: input.aspectRatio,
          resolution: input.resolution,
          duration: input.duration,
          camera_fixed: input.cameraFixed,
        }),
      });

      return normalizeStatus(payload);
    }),

  status: publicQuery
    .input(z.object({ requestId: z.string().min(1) }))
    .query(async ({ input }) => {
      const payload = await higgsfieldFetch<unknown>(
        `/requests/${input.requestId}/status`,
      );
      return normalizeStatus(payload);
    }),
});
