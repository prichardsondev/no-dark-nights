import { CopyPrompt } from "../CopyPrompt";
import { PageIntro, SiteShell } from "../SiteChrome";
import { promptCards } from "../site-data";

export default function PromptsPage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="Prompt cards"
          title="Good instructions leave room to think."
          description="Copy a card, replace the details with your own, and keep the parts that describe the goal, context, boundaries, and finish line."
        />
        <div className="prompt-list">
          {promptCards.map((card) => (
            <CopyPrompt key={card.title} {...card} />
          ))}
        </div>
      </main>
    </SiteShell>
  );
}

