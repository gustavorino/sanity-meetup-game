import { createClient } from "@sanity/client";

export type SanityCard = {
  _id: string;
  topic: string;
  userName?: string;
  body: any; // ain't got no time for that
  realTimeQuestion?: boolean;
};

export const client = createClient({
  dataset: import.meta.env.VITE_SANITY_DATASET || "productino",
  useCdn: false,
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "a67i5yzg",
  perspective: "published",
  apiVersion: "2024-01-01",
});

import imageUrlBuilder from "@sanity/image-url";

export const imageBuilder = imageUrlBuilder(client);

const query = `*[_type=="card"]{
  ...,
  body[]{
    ...,
    img {
      asset->
    },
    asset->
  }
}[0..17] | order(order asc,_createdAt asc)`;

export function loadCards() {
  return client.fetch<SanityCard[]>(query);
}

export function listenCards() {
  return client.listen<SanityCard>(query);
}
