// src/lib/avatar.ts
// Shared DiceBear avatar generator. Astrologer cards already use this exact
// pattern (see astrologer-helpers.ts) — pulled out here so logged-in user
// avatars can use the same "random character" look, seeded by something
// stable per-user (phone number) so the same person always gets the same
// character instead of a new one every page load.

export function avatarUrl(seed: string) {
  return `https://api.dicebear.com/8.x/personas/svg?seed=${encodeURIComponent(seed)}&backgroundColor=fde9d0,fbe0c4,f7d9b0&radius=50`;
}
