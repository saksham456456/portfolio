import { AnimatedSection } from '@/components/animated-section';
import { CardGrid } from '@/components/card-grid';
import { ChatBubble } from '@/components/chat-bubble';
import { ProfileStatBlocks } from '@/components/profile-stat-blocks';
import { StickyNav } from '@/components/sticky-nav';
import { TimelineItem } from '@/components/timeline-item';
import {
  assistantConversation,
  contactLinks,
  galleryMoments,
  heroMetrics,
  projectCards,
  skillGroups,
  timelineEntries,
} from '@/content/site';

export default function Home() {
  return (
    <main className="page-shell pb-16 text-white">
      <div className="grid-overlay" />
      <StickyNav />

      <div className="container-frame space-y-8 pb-10 pt-8 sm:space-y-10 sm:pt-10 lg:space-y-12">
        <AnimatedSection id="hero" className="glass-panel overflow-hidden rounded-[36px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr] lg:items-end">
            <div>
              <span className="eyebrow">Digital maker • storyteller • builder</span>
              <h1 className="mt-5 max-w-4xl text-[clamp(3rem,9vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
                A personal site starter with calm motion, polished depth, and room for your whole story.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Built for a modern portfolio: smooth transitions, tactile cards, timeline storytelling, and an embedded AI panel that can speak in your voice.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#projects" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:-translate-y-0.5">
                  Explore work
                </a>
                <a href="#assistant" className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm text-white transition hover:border-white/25 hover:bg-white/10">
                  Open AI panel
                </a>
              </div>
            </div>

            <div className="space-y-5">
              <div className="glass-panel rounded-[28px] p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/75">What this starter includes</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                  <li>• Sticky navigation with section anchors</li>
                  <li>• Animated content blocks with spring hover states</li>
                  <li>• Story-first sections for bio, timeline, projects, gallery, and contact</li>
                  <li>• A chat-inspired AI assistant panel for your narrative and FAQs</li>
                </ul>
              </div>
              <ProfileStatBlocks items={heroMetrics} />
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="about" className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="glass-panel rounded-[32px] p-6 sm:p-8">
            <span className="eyebrow">About me</span>
            <h2 className="section-title mt-5">A home for who you are, not just what you shipped.</h2>
          </div>
          <div className="glass-panel rounded-[32px] p-6 sm:p-8">
            <p className="section-copy max-w-none text-sm sm:text-base">
              This structure is intentionally story-friendly. You can bring in career context, values, pivots, and human details — then support them with projects, metrics, and visual memories. The palette leans into a dark tech aesthetic with soft blur, subtle line work, and smooth animation so the experience feels premium on mobile and desktop.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection id="timeline" className="glass-panel rounded-[32px] p-6 sm:p-8 lg:p-10">
          <span className="eyebrow">Timeline / life book</span>
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="section-title">Turn milestones into a narrative arc.</h2>
              <p className="section-copy mt-4">
                Capture moments that shaped your craft, your curiosity, and the way you collaborate.
              </p>
            </div>
          </div>
          <div className="relative mt-8 space-y-5 before:absolute before:bottom-2 before:left-[12px] before:top-2 before:w-px before:bg-white/10">
            {timelineEntries.map((entry, index) => (
              <TimelineItem key={`${entry.year}-${entry.title}`} entry={entry} index={index} />
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection id="projects" className="space-y-6">
          <div className="glass-panel rounded-[32px] p-6 sm:p-8">
            <span className="eyebrow">Projects / work</span>
            <h2 className="section-title mt-5">Feature flagship work without losing the bigger picture.</h2>
            <p className="section-copy mt-4">
              The card grid is built for case studies, shipped products, experiments, and ongoing collaborations.
            </p>
          </div>
          <CardGrid items={projectCards} />
        </AnimatedSection>

        <AnimatedSection id="skills" className="grid gap-5 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.name} className="glass-panel rounded-[28px] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/75">{group.name}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-200">
                {group.items.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </AnimatedSection>

        <AnimatedSection id="gallery" className="glass-panel rounded-[32px] p-6 sm:p-8 lg:p-10">
          <span className="eyebrow">Gallery / memories</span>
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="section-title">Mix polished work with personal atmosphere.</h2>
              <p className="section-copy mt-4">
                Use this section for photos, snapshots, sketches, places, rituals, or behind-the-scenes context.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {galleryMoments.map((moment, index) => (
              <div
                key={moment.title}
                className="glass-panel min-h-64 rounded-[28px] p-5"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(8,18,32,0.25), rgba(8,18,32,0.85)), radial-gradient(circle at ${20 + index * 18}% 20%, rgba(124,156,255,0.45), transparent 38%), linear-gradient(135deg, rgba(66,217,200,0.18), rgba(9,13,22,0.05))`,
                }}
              >
                <div className="flex h-full flex-col justify-end">
                  <p className="text-xl font-semibold text-white">{moment.title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">{moment.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection id="contact" className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="glass-panel rounded-[32px] p-6 sm:p-8">
            <span className="eyebrow">Contact</span>
            <h2 className="section-title mt-5">Make the next step feel easy.</h2>
            <p className="section-copy mt-4">
              Pair your story with practical links and a clear invitation to collaborate, hire, or simply connect.
            </p>
          </div>
          <div className="glass-panel rounded-[32px] p-6 sm:p-8">
            <div className="space-y-4">
              {contactLinks.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-white/8 bg-white/5 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-base text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="assistant" className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-panel rounded-[32px] p-6 sm:p-8">
            <span className="eyebrow">AI assistant panel</span>
            <h2 className="section-title mt-5">Let visitors ask the site what matters.</h2>
            <p className="section-copy mt-4">
              This starter includes a conversation layout you can later wire to your own API, profile facts, or a retrieval layer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
              {['Ask about projects', 'Summarize my background', 'Find collaborations', 'Explore life book'].map((chip) => (
                <span key={chip} className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-[32px] p-4 sm:p-5">
            <div className="rounded-[28px] border border-white/10 bg-[rgba(3,8,18,0.72)] p-4">
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <div>
                  <p className="text-sm font-medium text-white">Portfolio AI</p>
                  <p className="text-xs text-slate-400">Online • grounded • concise</p>
                </div>
                <span className="rounded-full bg-emerald-400/12 px-3 py-1 text-xs text-emerald-200">Ready</span>
              </div>
              <div className="mt-4 space-y-3">
                {assistantConversation.map((item) => (
                  <ChatBubble key={`${item.role}-${item.message}`} role={item.role} message={item.message} />
                ))}
              </div>
              <div className="mt-4 rounded-[24px] border border-white/10 bg-white/5 p-3 text-sm text-slate-400">
                Ask a question… connect this input to your own API route later.
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}
