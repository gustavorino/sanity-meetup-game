import { ContentCard } from "./ContentCard.tsx";
import { FullWrap } from "./FullWrap.tsx";
import { Intro } from "./Intro.tsx";

export function Overlays() {
  return (
    <FullWrap>
      <ContentCard />

      <Intro />
    </FullWrap>
  );
}
