import { createClient } from "@sanity/client";

export const client = createClient({
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: false,
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  perspective: "published",
  apiVersion: "2024-01-01",
});

const query = `*[_type=="card"][0..30] | order(_createdAt asc)`;

export function loadCards() {
  return client.fetch<SanityCard[]>(query);
}

export function listenCards() {
  return client.listen<SanityCard>(query);
}

export type SanityCard = {
  _id: string;
  topic: string;
  userName?: string;
  body: any;
  realTimeQuestion?: boolean;
};
