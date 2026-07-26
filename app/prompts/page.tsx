import { CopyPrompt } from "../CopyPrompt";
import { PageIntro, SiteShell } from "../SiteChrome";
import { promptCards } from "../site-data";

export default function PromptsPage() {
  return (
    <SiteShell>
      <main className="content-page site-width">
        <PageIntro
          eyebrow="Copy, paste, build"
          title="Start with the first prompt. Codex will help with the rest."
          description="These are written for a first-time builder. Copy one prompt into Codex, watch what it does, and ask whenever a word or step does not make sense."
        />
        <ol className="prompt-howto" aria-label="How to use the prompts">
          <li><span>1</span><p>Start with <strong>Download and open the project.</strong></p></li>
          <li><span>2</span><p>Replace anything inside <strong>[square brackets]</strong>.</p></li>
          <li><span>3</span><p>Paste the whole prompt into Codex and let it work.</p></li>
          <li><span>4</span><p>If you get stuck, say: <strong>“Stop and explain that in simpler words.”</strong></p></li>
        </ol>
        <div className="prompt-list">
          {promptCards.map((card) => (
            <CopyPrompt key={card.title} {...card} />
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
