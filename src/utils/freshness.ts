export const FRESHNESS_HALFLIFE_DAYS = 730; // ~2 years
const DAY_MS = 86_400_000;

type PostData = Record<string, unknown>;

function isWipData(data: PostData): boolean {
  const status = data.status;
  if (!status) return false;
  if (Array.isArray(status)) return status.includes("WIP");
  return status === "WIP";
}

export interface PostLike {
  data: PostData;
}

export function isWip<T extends PostLike>(post: T): boolean {
  return isWipData(post.data);
}

export function getCreatedTime<T extends PostLike>(post: T): Date {
  return new Date(post.data["created-time"] as string);
}

export function getEffectiveDate<T extends PostLike>(post: T): Date {
  const created = getCreatedTime(post);
  const updatedRaw = post.data["updated-time"];
  if (updatedRaw) {
    const updated = new Date(updatedRaw as string);
    if (
      !Number.isNaN(updated.getTime()) &&
      updated.getTime() > created.getTime()
    ) {
      return updated;
    }
  }
  return created;
}

export function freshnessScore<T extends PostLike>(post: T): number {
  if (isWip(post)) return Number.POSITIVE_INFINITY;
  const ageDays = (Date.now() - getEffectiveDate(post).getTime()) / DAY_MS;
  return Math.exp(-ageDays / FRESHNESS_HALFLIFE_DAYS);
}

export function byFreshness<T extends PostLike>(a: T, b: T): number {
  const aWip = isWip(a);
  const bWip = isWip(b);
  if (aWip && !bWip) return -1;
  if (!aWip && bWip) return 1;

  const sa = freshnessScore(a);
  const sb = freshnessScore(b);
  if (sa !== sb) return sb - sa;

  const ca = getCreatedTime(a).getTime();
  const cb = getCreatedTime(b).getTime();
  if (ca !== cb) return cb - ca;

  const slugA = String(a.data.slug ?? "");
  const slugB = String(b.data.slug ?? "");
  return slugA < slugB ? -1 : slugA > slugB ? 1 : 0;
}
