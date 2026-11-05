import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleCheck,
  ClipboardCheck,
  Droplets,
  ExternalLink,
  FileText,
  Leaf,
  Menu,
  Network,
  ShieldCheck,
  Sprout,
  TreePine,
  Users,
  X,
} from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';
import {
  useCreatePartnerReadinessSubmission,
  useHealthCheck,
  useListPartnerReadinessSubmissions,
} from '@workspace/api-client-react';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

const navItems = [
  { label: 'Value chain', href: '/value-chain' },
  { label: 'Projects', href: '/projects' },
  { label: 'Enterprises', href: '/enterprises' },
  { label: 'Infrastructure', href: '/infrastructure' },
  { label: 'Markets', href: '/markets' },
  { label: 'Impact', href: '/impact' },
  { label: 'Partners', href: '/partners' },
  { label: 'Insights', href: '/insights' },
  { label: 'Invest', href: '/invest' },
  { label: 'Contact', href: '/contact' },
];

const pillarItems = [
  { number: '01', title: 'Stella Mundi', icon: Sprout, text: 'Productive assets, project development, capital mobilisation, implementation and stewardship.' },
  { number: '02', title: 'Markets & demand', icon: Network, text: 'Demand creation, customer acquisition, long-term markets, commercial connectivity and logistics coordination.' },
  { number: '03', title: 'Community resilience', icon: Users, text: 'Community participation, enterprise development, skills and long-term social and economic resilience.' },
];

const projects = [
  { slug: 'mwenezi-lucerne', place: 'Zimbabwe · Agriculture', title: 'Mwenezi Lucerne', category: 'Design & phasing', summary: '2,200 ha designed under 45 centre pivots, for approximately 55,000 MT of premium export lucerne annually at full build-out.', stat: '2,200 ha', image: '/stella-irrigation.png' },
  { slug: 'bura-tana-lucerne', place: 'Kenya · Agriculture & water', title: 'Bura-Tana Lucerne', category: 'Phase 1 active', summary: 'MoU signed with NWHSA and Tana River County; Phase 1 of four mobilising across 3,250 ha under pivot irrigation.', stat: '3,250 ha', image: '/stella-irrigation.png' },
  { slug: 'driefontein-grain', place: 'Zimbabwe · Agriculture', title: 'Driefontein Grain', category: 'Operating · offtake signed', summary: 'Wheat, soya and maize under a signed supply agreement with a national bread manufacturer.', stat: 'Wheat / Soya / Maize', image: '/stella-operations.png' },
  { slug: 'nuanetsi-green-belt', place: 'Zimbabwe · Agriculture', title: 'Nuanetsi Green Belt', category: 'In development', summary: 'Sugarcane, lucerne and citrus, with sugarcane targeting roughly 3,000 ha by the end of the current phase.', stat: '3,000 ha', image: '/stella-operations.png' },
  { slug: 'hwange-diocese-services', place: 'Zimbabwe · Community & health', title: 'Hwange Diocese Services Partnership', category: 'Operating', summary: 'Agricultural financing, medical assistance and laboratory services delivered in partnership with the Diocese of Hwange.', stat: 'Health + services', image: '/stella-faith.png' },
  { slug: 'tana-river-feed-mill', place: 'Kenya · Agro-processing', title: 'Tana River Feed Mill & Livestock Platform', category: 'Planned · Phase 2–4', summary: 'Feed processing at 7,000 ha, export scale at 12,000 ha, then a beef, goat and dairy livestock platform.', stat: '7,000–12,000 ha', image: '/stella-operations.png' },
];

type QuestionnaireData = {
  dioceseName: string;
  landSize: string;
  landUse: string;
  waterSource: string;
  titleIssues: string;
  decisionAuthority: string;
  priorPartnership: string;
  fundingReliance: string;
  briefingAvailability: string;
  governanceNotes: string;
  greatestConcern: string;
  confidenceFactors: string[];
  preferredPillar: string;
  onboardingSupport: string[];
  additionalNotes: string;
};

const initialQuestionnaire: QuestionnaireData = {
  dioceseName: '',
  landSize: '',
  landUse: '',
  waterSource: '',
  titleIssues: '',
  decisionAuthority: '',
  priorPartnership: '',
  fundingReliance: '',
  briefingAvailability: '',
  governanceNotes: '',
  greatestConcern: '',
  confidenceFactors: [],
  preferredPillar: '',
  onboardingSupport: [],
  additionalNotes: '',
};

function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" data-testid="link-logo" className="flex items-center gap-3">
      <span className={`flex h-14 w-[116px] items-center justify-center rounded-[4px] ${inverse ? 'bg-[#f7f3ea] px-2' : ''}`}>
        <img src="/stella-mundi-logo.png" alt="Stella Mundi" className="h-full w-full object-contain" />
      </span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  return (
    <header className="relative z-30 border-b border-[#d9d2c4] bg-[#f7f3ea]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 lg:px-10">
        <Logo />
        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`} className={`text-[0.72rem] font-semibold tracking-[0.08em] transition-colors hover:text-[#b68a1e] ${location === item.href ? 'text-[#b68a1e]' : 'text-[#364255]'}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          <Link href="/about" data-testid="link-about" className="text-[0.72rem] font-semibold tracking-[0.08em] text-[#364255] hover:text-[#b68a1e]">About</Link>
          <Link href="/questionnaire" data-testid="link-questionnaire-header" className="rounded-[4px] bg-[#1d2d45] px-5 py-3 text-[0.72rem] font-bold tracking-[0.08em] text-[#f7f3ea] transition-transform hover:-translate-y-0.5">Begin a conversation <ArrowRight className="ml-2 inline h-3.5 w-3.5" /></Link>
        </div>
        <button type="button" onClick={() => setOpen(!open)} data-testid="button-toggle-menu" className="rounded-[4px] border border-[#cfc7b8] p-2 text-[#1d2d45] xl:hidden" aria-label="Toggle navigation">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-[#d9d2c4] bg-[#f7f3ea] px-5 py-5 xl:hidden">
          <div className="grid gap-4">
            {navItems.map((item) => <Link key={item.href} onClick={() => setOpen(false)} href={item.href} data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`} className="font-display text-2xl text-[#1d2d45]">{item.label}</Link>)}
            <Link onClick={() => setOpen(false)} href="/questionnaire" data-testid="link-questionnaire-mobile" className="mt-2 w-fit rounded-[4px] bg-[#1d2d45] px-5 py-3 text-sm font-bold text-[#f7f3ea]">Begin a conversation <ArrowRight className="ml-2 inline h-4 w-4" /></Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1d2d45] text-[#f7f3ea]">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:grid-cols-[1.25fr_.75fr_.75fr] lg:px-10 lg:py-20">
        <div>
          <Logo inverse />
          <p className="mt-7 max-w-sm font-display text-2xl leading-snug text-[#d9d2c4]">Productive assets, held with care. A long view for East and Southern Africa.</p>
        </div>
        <div>
          <p className="eyebrow !text-[#d9a82e]">Explore</p>
          <div className="mt-5 grid gap-3 text-sm text-[#d9d2c4]">
            <Link href="/model" data-testid="link-footer-model" className="hover:text-[#d9a82e]">The three-pillar economy</Link>
            <Link href="/projects" data-testid="link-footer-projects" className="hover:text-[#d9a82e]">Project portfolio</Link>
            <Link href="/governance" data-testid="link-footer-governance" className="hover:text-[#d9a82e]">Governance</Link>
            <Link href="/faq" data-testid="link-footer-faq" className="hover:text-[#d9a82e]">FAQ</Link>
            <Link href="/library" data-testid="link-footer-library" className="hover:text-[#d9a82e]">Prospectus library</Link>
            <Link href="/insights" data-testid="link-footer-insights" className="hover:text-[#d9a82e]">Insights</Link>
          </div>
        </div>
        <div>
          <p className="eyebrow !text-[#d9a82e]">Stay close</p>
          <p className="mt-5 text-sm leading-7 text-[#d9d2c4]">For dioceses, operating partners, capital partners, and benefactors looking for a serious first conversation.</p>
          <Link href="/questionnaire" data-testid="link-footer-questionnaire" className="mt-5 inline-flex items-center text-sm font-bold text-[#d9a82e]">Partner readiness questionnaire <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </div>
      </div>
      <div className="border-t border-[#526074] px-5 py-5 text-xs text-[#aeb5bd] lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap justify-between gap-3"><span>© {new Date().getFullYear()} Stella Mundi</span><span>Designed for stewardship, measured in decades.</span></div>
      </div>
    </footer>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="grain min-h-[100dvh] bg-[#f7f3ea]"><Header />{children}<Footer /></div>;
}

function ButtonLink({ href, children, secondary = false, dark = false }: { href: string; children: ReactNode; secondary?: boolean; dark?: boolean }) {
  return <Link href={href} data-testid={`link-cta-${href.replaceAll('/', '') || 'home'}`} className={`inline-flex items-center justify-center rounded-[4px] px-5 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5 ${secondary ? (dark ? 'border border-[#f7f3ea]/55 text-[#f7f3ea] hover:border-[#f7f3ea]' : 'border border-[#b9b2a5] text-[#1d2d45] hover:border-[#1d2d45]') : 'bg-[#1d2d45] text-[#f7f3ea]'}`}>{children}<ArrowRight className="ml-2 h-4 w-4" /></Link>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function PageIntro({ eyebrow, title, body, image = false, imageSrc = '/stella-irrigation.png' }: { eyebrow: string; title: string; body: string; image?: boolean; imageSrc?: string }) {
  return (
    <section className={`relative overflow-hidden border-b border-[#d9d2c4] ${image ? 'bg-[#1d2d45] text-[#f7f3ea]' : 'bg-[#ebe5d9]'}`}>
      {image && <div className="absolute inset-0 opacity-35" style={{ backgroundImage: `url('${imageSrc}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
      <div className="relative mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28">
        <div className="max-w-3xl reveal">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 font-display text-5xl leading-[.98] tracking-[-0.045em] md:text-7xl">{title}</h1>
          <p className={`mt-7 max-w-2xl text-lg leading-8 ${image ? 'text-[#d9d2c4]' : 'text-[#526074]'}`}>{body}</p>
        </div>
      </div>
    </section>
  );
}

function StatStrip({ items }: { items: { value: string; label: string }[] }) {
  return <div className="grid border-y border-[#d9d2c4] md:grid-cols-5">{items.map((item, i) => <div key={item.label} className={`px-5 py-7 lg:px-10 ${i < items.length - 1 ? 'border-b border-[#d9d2c4] md:border-b-0 md:border-r' : ''}`}><p className="font-display text-4xl tracking-[-0.04em] text-[#1d2d45]">{item.value}</p><p className="mt-2 text-xs font-bold uppercase tracking-[.14em] text-[#667083]">{item.label}</p></div>)}</div>;
}

function Home() {
  return (
    <Shell>
      <main>
        <section className="relative min-h-[670px] overflow-hidden bg-[#1d2d45] text-[#f7f3ea]">
          <div className="absolute inset-0 bg-cover bg-center opacity-55" style={{ backgroundImage: "url('/stella-homepage-hero.png')" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1d2d45] via-[#1d2d45]/75 to-transparent" />
          <div className="relative mx-auto flex min-h-[670px] max-w-[1400px] items-end px-5 pb-16 pt-24 lg:px-10 lg:pb-24">
            <div className="max-w-3xl reveal">
              <Eyebrow>The Catholic Economy Value Chain</Eyebrow>
              <h1 className="mt-6 max-w-5xl font-display text-6xl leading-[.98] tracking-[-0.055em] md:text-7xl lg:text-[4.25rem]">We are not building isolated projects.<br /><span className="text-[#d9a82e]">We are building an economy.</span></h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[#d9d2c4] md:text-xl">A regional economic platform connecting institutional capital, productive assets, infrastructure, markets and community resilience across East & Southern Africa.</p>
              <div className="mt-9 flex flex-wrap gap-3"><ButtonLink href="/value-chain">Explore the Catholic Economy</ButtonLink><ButtonLink href="/projects" secondary dark>View our projects</ButtonLink><ButtonLink href="/invest" secondary dark>Investment partnerships</ButtonLink></div>
            </div>
            <div className="absolute right-10 top-16 hidden max-w-[235px] rounded-[4px] border border-[#f7f3ea]/20 bg-[#27536b]/80 p-6 text-left lg:block reveal reveal-delay-2"><Eyebrow>Live from the field</Eyebrow><p className="mt-3 font-display text-3xl leading-tight text-[#f7f3ea]">Driefontein</p><p className="mt-2 text-sm text-[#d9d2c4]">Wheat / Soya / Maize</p><Link href="/projects/driefontein-grain" className="mt-5 inline-flex rounded-[4px] bg-[#d9a82e] px-4 py-2 text-xs font-bold uppercase tracking-[.08em] text-[#1d2d45]">View project</Link></div>
          </div>
        </section>
        <StatStrip items={[{ value: '250,000 ha', label: 'Regional vision, East & Southern Africa' }, { value: '≈US$1bn', label: 'Indicative framework, subject to feasibility' }, { value: '60,000 ha', label: 'Zimbabwe roadmap' }, { value: '100,000 ha', label: 'Kenya roadmap' }, { value: '3 pillars', label: 'One economic architecture' }]} />
        <section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-24">
          <Eyebrow>Start here</Eyebrow><h2 className="mt-5 font-display text-4xl leading-tight tracking-[-.04em] md:text-5xl">Understand the platform, then choose your path.</h2><p className="mt-4 max-w-2xl leading-7 text-[#667083]">Follow the story from the value chain to the projects, people and opportunities that make it tangible.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-4">{[{ title: 'The Model', text: 'How the Catholic Economy Value Chain works.', href: '/model' }, { title: 'The Projects', text: 'What is being built and where.', href: '/projects' }, { title: 'The People', text: 'Who operates, participates and partners.', href: '/impact' }, { title: 'The Opportunities', text: 'Where investment and partnership fit.', href: '/invest' }].map((item, i) => <Link href={item.href} key={item.title} className="border-t-4 border-[#d9a82e] bg-[#ebe5d9] p-6 hover:bg-[#f7f3ea]"><h3 className="font-display text-2xl text-[#1d2d45]">{item.title}</h3><p className="mt-3 text-sm leading-6 text-[#667083]">{item.text}</p></Link>)}</div>
        </section>
        <section className="bg-[#ebe5d9] px-5 py-20 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[1400px]"><div className="flex flex-wrap items-end justify-between gap-6"><div><Eyebrow>The three-pillar economy</Eyebrow><h2 className="mt-4 font-display text-4xl tracking-[-.04em] md:text-5xl">Three institutions. One economy.</h2></div><ButtonLink href="/model" secondary>Explore the model</ButtonLink></div><div className="mt-12 grid gap-px bg-[#cfc7b8] md:grid-cols-3">{pillarItems.map((item) => <Link href="/model" key={item.number} data-testid={`link-pillar-${item.number}`} className="group bg-[#ebe5d9] p-6 transition-colors hover:bg-[#f7f3ea] lg:p-7"><item.icon className="h-6 w-6 text-[#b68a1e]" /><p className="mt-10 text-xs font-bold tracking-[.13em] text-[#b68a1e]">{item.number}</p><h3 className="mt-3 font-display text-2xl leading-tight text-[#1d2d45]">{item.title}</h3><p className="mt-4 text-sm leading-6 text-[#667083]">{item.text}</p><ArrowDownRight className="mt-7 h-5 w-5 text-[#b68a1e] transition-transform group-hover:translate-x-1 group-hover:translate-y-1" /></Link>)}</div><div className="mt-7 rounded-[4px] bg-[#0b394d] p-6 text-[#f7f3ea]"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#d9a82e]">One architecture</p><p className="mt-2 text-sm leading-7 text-[#d9d2c4]">Production follows demand. Infrastructure connects production to the customer. Community resilience is built into the model.</p></div></div>
        </section>
        <section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-24"><div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr]"><div><Eyebrow>Live from the field</Eyebrow><h2 className="mt-5 max-w-lg font-display text-4xl leading-tight tracking-[-.04em] md:text-5xl">Production follows demand.</h2></div><div><p className="max-w-xl text-lg leading-8 text-[#526074]">Driefontein, wheat, soya and maize, supplying a national bread brand through a signed offtake agreement. Bura-Tana, Kenya, Phase 1 of a four-phase lucerne and livestock-feed project, with water infrastructure delivered in partnership with Kenya's National Water Harvesting and Storage Authority.</p><div className="mt-8"><ButtonLink href="/projects" secondary>See the projects</ButtonLink></div></div></div></section>
        <section className="bg-[#dfe6dc] px-5 py-20 lg:px-10 lg:py-28"><div className="mx-auto max-w-[1400px]"><div className="flex flex-wrap items-end justify-between gap-6"><div><Eyebrow>Selected work</Eyebrow><h2 className="mt-4 font-display text-4xl tracking-[-.04em] md:text-5xl">The portfolio, in formation.</h2></div><ButtonLink href="/projects" secondary>View all projects</ButtonLink></div><div className="mt-12 grid gap-6 lg:grid-cols-3">{projects.map((p, i) => <Link href={`/projects/${p.slug}`} key={p.slug} data-testid={`card-project-${i}`} className="group hover-lift border border-[#c6d0c1] bg-[#f7f3ea] p-7"><div className="flex justify-between text-xs font-bold uppercase tracking-[.12em] text-[#667083]"><span>{p.place}</span><span>{p.stat}</span></div><div className="mt-16 h-px bg-[#d9a82e] transition-all group-hover:w-1/2" /><h3 className="mt-5 font-display text-3xl leading-tight text-[#1d2d45]">{p.title}</h3><p className="mt-3 text-sm leading-6 text-[#667083]">{p.summary}</p><p className="mt-8 text-xs font-bold uppercase tracking-[.12em] text-[#b68a1e]">{p.category} <ArrowRight className="ml-2 inline h-3.5 w-3.5" /></p></Link>)}</div></div></section>
        <section className="bg-[#d9a82e] px-5 py-16 lg:px-10"><div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 md:flex-row md:items-center"><div><Eyebrow>For potential partners</Eyebrow><h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight tracking-[-.04em] text-[#1d2d45] md:text-5xl">Bring us the place, the question, or the possibility.</h2></div><ButtonLink href="/questionnaire">Take the readiness questionnaire</ButtonLink></div></section>
      </main>
    </Shell>
  );
}

function ModelPage() {
  return <Shell><PageIntro eyebrow="The model · Economia Pro Homine" title="An economy for the human person." body="The Catholic Economy Value Chain is a platform for productive assets, markets, infrastructure and community resilience. It exists to strengthen the Church's mission through a second, self-generated stream alongside parish giving and benefactor support." image /><section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-24"><p className="max-w-4xl font-display text-4xl leading-tight text-[#1d2d45] md:text-6xl">“A commercial enterprise and a tool to develop, transform and build our communities.”</p><p className="mt-8 max-w-2xl leading-8 text-[#667083]">The model is designed around dignity of the person, not only the balance sheet. Commercial surplus is governed and returned to the platform's mission; it does not replace giving.</p><div className="mt-14 grid gap-6 lg:grid-cols-3">{pillarItems.map((item) => <article key={item.number} className="flex min-h-[280px] flex-col border-t-4 border-[#d9a82e] bg-[#f7f3ea] p-7"><div className="flex items-start justify-between"><item.icon className="h-7 w-7 text-[#b68a1e]" /><span className="font-display text-3xl text-[#c6c0b5]">{item.number}</span></div><h2 className="mt-10 font-display text-3xl text-[#1d2d45]">{item.title}</h2><p className="mt-4 leading-7 text-[#667083]">{item.text}</p></article>)}</div></section><section className="bg-[#ebe5d9] px-5 py-20 lg:px-10"><div className="mx-auto max-w-[1400px]"><Eyebrow>Reach and roadmap</Eyebrow><div className="mt-8 grid gap-6 md:grid-cols-3"><div><p className="font-display text-5xl text-[#b68a1e]">250,000 ha</p><p className="mt-2 text-sm text-[#667083]">Regional vision across East & Southern Africa</p></div><div><p className="font-display text-5xl text-[#1d2d45]">60,000 ha</p><p className="mt-2 text-sm text-[#667083]">Zimbabwe roadmap</p></div><div><p className="font-display text-5xl text-[#3f5d42]">100,000 ha</p><p className="mt-2 text-sm text-[#667083]">Kenya roadmap</p></div></div><p className="mt-8 max-w-3xl text-sm leading-7 text-[#667083]">These are multi-year platform targets, distinct from project-by-project figures. The indicative framework is approximately US$1bn and remains subject to feasibility, approvals, definitive contracts and financial close.</p></div></section></Shell>;
}

function ValueChainPage() {
  const steps = [['01', 'Demand', 'Market need', 'Production follows demand.'], ['02', 'Capital', 'Institutional capital', 'Capital supports productive assets.'], ['03', 'Assets', 'Productive assets', 'The platform builds productive capacity.'], ['04', 'Infrastructure', 'Transport + energy', 'Infrastructure connects production to the customer.'], ['05', 'Markets', 'Customers + offtake', 'Markets convert supply into revenue.'], ['06', 'Resilience', 'Communities + skills', 'Community resilience strengthens the system around the assets.']];
  return <Shell><PageIntro eyebrow="Catholic Economy Value Chain" title="From demand to development." body="Production follows demand. Lumen Terra identifies structural demand. Stella Mundi builds productive capacity. Infrastructure connects production to the customer. Regina Humanitas embeds community resilience." /><section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-24"><div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">{steps.map((s) => <div key={s[0]} className="flex min-h-[190px] flex-col rounded-[4px] border border-[#d9d2c4] bg-[#ebe5d9] p-5"><div className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-[#d9a82e]" /><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#667083]">{s[1]}</p></div><h2 className="mt-5 font-display text-2xl leading-tight text-[#1d2d45]">{s[2]}</h2><p className="mt-auto pt-5 text-sm leading-6 text-[#667083]">{s[3]}</p></div>)}</div><div className="mt-10 rounded-[4px] bg-[#0b394d] p-7 text-[#f7f3ea]"><Eyebrow>Why this matters</Eyebrow><p className="mt-3 max-w-4xl leading-7 text-[#d9d2c4]">The value chain makes the platform legible: capital supports productive assets, productive assets create supply, infrastructure supports reliability, markets convert supply into revenue, and resilience strengthens the system around the assets.</p></div><div className="mt-8 flex flex-wrap gap-3"><ButtonLink href="/model">Explore the three pillars</ButtonLink><ButtonLink href="/projects" secondary>See projects</ButtonLink></div></section><section className="bg-[#dfe6dc] px-5 py-20 lg:px-10"><div className="mx-auto max-w-[1400px]"><Eyebrow>Proof in the portfolio</Eyebrow><h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-[#1d2d45] md:text-5xl">Bura-Tana turns the architecture into a phased operating plan.</h2><p className="mt-6 max-w-3xl leading-8 text-[#526074]">The Kenya project moves from 3,250 ha in Phase 1 to 7,000 ha, then 12,000 ha, followed by a livestock platform. Water infrastructure is being delivered in partnership with Kenya's National Water Harvesting and Storage Authority and Tana River County Government.</p></div></section></Shell>;
}

function EnterprisesPage() {
  const enterpriseCards = [{ title: 'Agriculture & food systems', text: 'Lucerne, grain, sugarcane, citrus, livestock feed and related productive enterprises where demand can be identified before production is scaled.', image: '/stella-agriculture-food-systems.png' }, { title: 'Agro-processing', text: 'Milling, feed processing, storage, aggregation and logistics that connect productive assets to reliable customers.' }, { title: 'Health & social services', text: 'Medical assistance, laboratory services and other community-facing services that strengthen resilience around the productive platform.' }, { title: 'Skills & enterprise development', text: 'Training, operating capability and local participation that make the value chain durable beyond a single project cycle.' }];
  return <Shell><PageIntro eyebrow="Enterprises" title="Productive assets make the architecture tangible." body="The platform develops enterprises where demand, productive capacity, infrastructure and community resilience can reinforce one another. Each opportunity is assessed on its own feasibility and governance." /><section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28"><div className="grid gap-6 md:grid-cols-2">{enterpriseCards.map((c, i) => <article key={c.title} className={`hover-lift overflow-hidden border border-[#d9d2c4] bg-[#f7f3ea] p-8 ${i === 0 ? 'md:row-span-2 bg-[#dfe6dc]' : ''}`}><p className="text-sm font-bold uppercase tracking-[.14em] text-[#b68a1e]">0{i + 1}</p><h2 className="mt-16 font-display text-4xl text-[#1d2d45]">{c.title}</h2><p className="mt-4 max-w-sm leading-7 text-[#667083]">{c.text}</p><ArrowDownRight className="mt-12 h-6 w-6 text-[#b68a1e]" />{c.image && <img src={c.image} alt="Agricultural fields and productive infrastructure" className="-mx-8 -mb-8 mt-8 h-56 w-[calc(100%+4rem)] object-cover" />}</article>)}</div></section><section className="bg-[#1d2d45] px-5 py-20 text-[#f7f3ea] lg:px-10"><div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-3"><div><Eyebrow>Selection lens</Eyebrow><h2 className="mt-4 font-display text-4xl">Useful, governable, market-backed.</h2></div><p className="leading-8 text-[#d9d2c4]">Demand comes first. A project is not built in isolation: the operating model, infrastructure, route to market and community role are considered together.</p><p className="leading-8 text-[#d9d2c4]">Where a concept is still being shaped, it is presented as designed, planned or targeting. The distinction matters.</p></div></section></Shell>;
}

function InfrastructurePage() {
  const assets = [{ title: 'Water & irrigation', text: 'Hydrology, water harvesting, storage and centre-pivot irrigation that make production reliable.' }, { title: 'Energy, transport & logistics', text: 'The enabling systems that connect productive assets to customers and offtake routes.' }, { title: 'Processing & storage', text: 'Milling, feed processing, cooling, aggregation and storage, staged around the market need.' }];
  return <Shell><PageIntro eyebrow="Infrastructure" title="Infrastructure connects production to the customer." body="Infrastructure is not a backdrop. It is the practical system that determines whether productive assets can supply markets reliably, and whether community resilience can be built around them." image /><section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28"><div className="grid gap-6 md:grid-cols-3">{assets.map((asset, i) => <article key={asset.title} className="border-t-4 border-[#3f5d42] bg-[#f7f3ea] p-7"><p className="font-display text-3xl text-[#c6c0b5]">0{i + 1}</p><h2 className="mt-14 font-display text-3xl text-[#1d2d45]">{asset.title}</h2><p className="mt-4 leading-7 text-[#667083]">{asset.text}</p></article>)}</div></section><section className="bg-[#dfe6dc] px-5 py-20 lg:px-10"><div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-2"><div><Eyebrow>Example · Bura-Tana</Eyebrow><h2 className="mt-5 font-display text-4xl leading-tight text-[#1d2d45] md:text-5xl">Water infrastructure delivered with public-sector partnership.</h2></div><p className="leading-8 text-[#526074]">The Kenya programme is being developed with Kenya's National Water Harvesting and Storage Authority and Tana River County Government. The infrastructure is described by phase and status; unbuilt assets are not presented as operating.</p></div></section></Shell>;
}

function MarketsPage() {
  const steps = [{ title: '1. Identify', text: 'Structural demand and customer requirements.' }, { title: '2. Secure', text: 'Commercial relationships and offtake pathways.' }, { title: '3. Connect', text: 'Logistics, infrastructure and production.' }, { title: '4. Grow', text: 'Repeat demand and scalable market access.' }];
  return <Shell><PageIntro eyebrow="Markets & offtake" title="Demand is the first discipline." body="Lumen Terra identifies structural demand, connects customers to supply and coordinates the route to market across the platform." /><section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-24"><div className="grid gap-6 md:grid-cols-4">{steps.map((step, i) => <article key={step.title} className={`border-t-4 ${i % 2 === 0 ? 'border-[#d9a82e]' : 'border-[#3f5d42]'} bg-[#f7f3ea] p-7`}><h2 className="font-display text-2xl text-[#1d2d45]">{step.title}</h2><p className="mt-4 text-sm leading-6 text-[#667083]">{step.text}</p></article>)}</div><div className="mt-10 bg-[#0b394d] p-7 text-[#f7f3ea]"><Eyebrow>The commercial logic</Eyebrow><p className="mt-3 max-w-3xl leading-7 text-[#d9d2c4]">Production is not built in isolation. The market route is part of the architecture from the beginning.</p></div><div className="mt-8 grid gap-6 md:grid-cols-2"><div className="border-t-4 border-[#3f5d42] bg-[#ebe5d9] p-7"><h2 className="font-display text-3xl text-[#1d2d45]">For buyers</h2><p className="mt-3 text-sm leading-7 text-[#667083]">A clearer route to product, project origin, supply logic and commercial contact.</p></div><div className="border-t-4 border-[#d9a82e] bg-[#ebe5d9] p-7"><h2 className="font-display text-3xl text-[#1d2d45]">For partners</h2><p className="mt-3 text-sm leading-7 text-[#667083]">A commercial platform where demand, productive assets and infrastructure meet.</p></div></div></section></Shell>;
}

function ImpactPage() {
  const impactCards = [{ icon: Leaf, title: 'Land & water', text: 'Stewardship of productive assets, irrigation and the long-term resource base.' }, { icon: Users, title: 'People & livelihoods', text: 'Community participation, skills, enterprise development and dignified work.' }, { icon: ShieldCheck, title: 'Mission resilience', text: 'A second, self-generated stream that supports the Church alongside parish giving and benefactor support.' }];
  return <Shell><PageIntro eyebrow="Impact & community" title="Resilience is built into the model." body="Regina Humanitas embeds community participation, enterprise development, skills and long-term social and economic resilience around the productive platform." image /><section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28"><div className="grid gap-8 md:grid-cols-3">{impactCards.map((x) => <article key={x.title} className="border-t-4 border-[#b44743] bg-[#f7f3ea] p-7"><x.icon className="h-6 w-6 text-[#b44743]" /><h2 className="mt-12 font-display text-3xl text-[#1d2d45]">{x.title}</h2><p className="mt-4 leading-7 text-[#667083]">{x.text}</p></article>)}</div><div className="mt-12 border border-[#d9d2c4] bg-[#ebe5d9] p-7"><Eyebrow>Community in practice</Eyebrow><p className="mt-4 max-w-4xl leading-8 text-[#526074]">The Hwange Diocese partnership includes agricultural financing, medical assistance and laboratory services. These are part of the platform's community and resilience function, not an afterthought to the commercial work.</p></div></section><section className="bg-[#d9a82e] px-5 py-20 lg:px-10"><div className="mx-auto max-w-[1400px]"><Eyebrow>Indicative projections</Eyebrow><h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-[#1d2d45] md:text-5xl">The Sovereign Fund Fee is designed to convert platform scale into mission support.</h2><div className="mt-10 grid gap-8 md:grid-cols-2"><div><p className="font-display text-5xl text-[#1d2d45]">2%</p><p className="mt-2 max-w-sm text-sm leading-7 text-[#364255]">Indicative Sovereign Fund Fee projection. Figures remain subject to feasibility, approvals, definitive contracts and financial close.</p></div><div><p className="font-display text-5xl text-[#1d2d45]">Mission-linked</p><p className="mt-2 max-w-sm text-sm leading-7 text-[#364255]">The fee is described as a projection and governance mechanism, not as achieved income.</p></div></div></div></section></Shell>;
}

function InvestPage() {
  return <Shell><PageIntro eyebrow="Invest" title="Investment partnerships for productive assets." body="Stella Mundi is building an institutional platform for capital partners who value clear documentation, operating discipline and a long enough view for productive infrastructure to mature." /><section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28"><div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]"><div><Eyebrow>How investment fits</Eyebrow><h2 className="mt-5 font-display text-4xl leading-tight md:text-5xl">Capital follows demand and supports assets.</h2><p className="mt-7 max-w-xl leading-8 text-[#667083]">The indicative framework is approximately US$1bn across the regional vision, subject to project-by-project feasibility, approvals, definitive contracts and financial close. No single figure is presented as committed capital or achieved return.</p></div><div className="grid gap-5 md:grid-cols-2"><div className="border-t-4 border-[#d9a82e] bg-[#ebe5d9] p-7"><h3 className="font-display text-3xl text-[#1d2d45]">Project capital</h3><p className="mt-4 text-sm leading-7 text-[#667083]">Capital for land development, water, productive assets, processing and infrastructure.</p></div><div className="border-t-4 border-[#3f5d42] bg-[#ebe5d9] p-7"><h3 className="font-display text-3xl text-[#1d2d45]">Market partnerships</h3><p className="mt-4 text-sm leading-7 text-[#667083]">Customer, offtake and logistics relationships that make production bankable.</p></div><div className="border-t-4 border-[#0b394d] bg-[#ebe5d9] p-7"><h3 className="font-display text-3xl text-[#1d2d45]">Technical capability</h3><p className="mt-4 text-sm leading-7 text-[#667083]">Operators and advisors who can move a project from design through delivery.</p></div><div className="border-t-4 border-[#b44743] bg-[#ebe5d9] p-7"><h3 className="font-display text-3xl text-[#1d2d45]">Mission alignment</h3><p className="mt-4 text-sm leading-7 text-[#667083]">A structure in which commercial surplus returns to the platform's mission alongside giving.</p></div></div></div><div className="mt-16 border border-[#d9d2c4] bg-[#f7f3ea] p-8"><ClipboardCheck className="h-7 w-7 text-[#b68a1e]" /><h3 className="mt-8 font-display text-3xl text-[#1d2d45]">What a first conversation covers</h3><ul className="mt-6 grid gap-4 text-sm leading-6 text-[#667083] md:grid-cols-2">{['Place, title, water, and decision authority', 'Operating partner and market evidence', 'Governance-documented structures', 'Phasing, questions, and next diligence'].map((x) => <li key={x} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-[#6a865d]" />{x}</li>)}</ul><div className="mt-8"><ButtonLink href="/questionnaire">Start with readiness</ButtonLink></div></div></section></Shell>;
}

function ProjectsPage() {
  return <Shell><PageIntro eyebrow="Projects" title="Projects that make the architecture tangible." body="The initial portfolio spans irrigated agriculture, productive infrastructure and responsible community services in Zimbabwe and Kenya. Project figures are indicative and subject to project-by-project feasibility, approvals, definitive contracts and financial close." /><section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28"><div className="grid gap-6 lg:grid-cols-2">{projects.map((p) => <Link href={`/projects/${p.slug}`} key={p.slug} data-testid={`link-project-${p.slug}`} className="group overflow-hidden border border-[#d9d2c4] bg-[#f7f3ea] transition-transform hover:-translate-y-1"><div className="relative h-52 overflow-hidden bg-[#0b394d]"><img src={p.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#0b394d]/90 via-[#0b394d]/20 to-transparent" /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6"><span className="max-w-[75%] font-display text-2xl leading-tight text-[#f7f3ea]">{p.stat}</span><span className="text-xs font-bold uppercase tracking-[.1em] text-[#f7f3ea]/80">Stella Mundi</span></div></div><div className="p-7"><div className="flex justify-between"><span className="eyebrow">{p.place}</span><ExternalLink className="h-4 w-4 text-[#b68a1e]" /></div><p className="mt-7 text-xs font-bold uppercase tracking-[.14em] text-[#b68a1e]">{p.category}</p><h2 className="mt-3 font-display text-3xl text-[#1d2d45]">{p.title}</h2><p className="mt-3 text-sm leading-6 text-[#667083]">{p.summary}</p></div></Link>)}</div><div className="mt-8 border border-[#d9d2c4] bg-[#f7f3ea] px-5 py-4 text-xs leading-6 text-[#667083]">Project figures are indicative and subject to project-by-project feasibility, approvals, definitive contracts and financial close.</div></section></Shell>;
}

function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug) ?? projects[0];
  const detail = {
    'mwenezi-lucerne': { headline: 'A 2,200 ha lucerne platform designed around 45 centre pivots.', facts: ['2,200 ha', '45 centre pivots', '~55,000 MT annual target'], body: 'Mwenezi Lucerne is designed for approximately 55,000 MT of premium export lucerne annually. The project is presented as an indicative footprint and development-stage opportunity.', note: 'Explore infrastructure needs, route-to-market logic and development stage.' },
    'bura-tana-lucerne': { headline: 'A four-phase Kenya programme beginning at 3,250 ha.', facts: ['3,250 ha Phase 1', '7,000 ha Phase 2', '12,000 ha Phase 3'], body: 'Bura-Tana is being developed as an East African flagship for lucerne and livestock feed. Water infrastructure is being delivered in partnership with Kenya’s National Water Harvesting and Storage Authority and Tana River County Government.', note: 'Phase 4 adds the beef, goat and dairy livestock platform.' },
    'driefontein-grain': { headline: 'Wheat, soya and maize connected to a signed national offtake route.', facts: ['Wheat', 'Soya', 'Maize'], body: 'Driefontein is the portfolio’s clearest market proof point: production is linked to a signed supply agreement with a national bread manufacturer.', note: 'The project demonstrates why demand is the first discipline.' },
    'nuanetsi-green-belt': { headline: 'Sugarcane, lucerne and citrus developed as a productive belt.', facts: ['~3,000 ha', 'Sugarcane', 'Lucerne + citrus'], body: 'The Nuanetsi Green Belt is in development, with sugarcane targeting roughly 3,000 ha by the end of the current phase alongside lucerne and citrus.', note: 'Figures are indicative and subject to feasibility and approvals.' },
    'hwange-diocese-services': { headline: 'Agricultural financing and essential services around a diocesan partnership.', facts: ['Agricultural finance', 'Medical assistance', 'Laboratory services'], body: 'The Hwange Diocese Services Partnership connects agricultural financing, medical assistance and laboratory services in a community-facing platform.', note: 'This is the community and resilience function in practice.' },
    'tana-river-feed-mill': { headline: 'Feed processing first, livestock platform as the phases mature.', facts: ['7,000 ha feed mill', '12,000 ha export scale', 'Beef / goat / dairy'], body: 'The Tana River programme is phased: feed processing at 7,000 ha, export scale at 12,000 ha, then a livestock platform spanning beef, goats and dairy.', note: 'The phases remain a planned development pathway.' },
  }[project.slug] ?? { headline: 'A project with a wider system around it.', facts: [project.stat], body: project.summary, note: 'Figures are indicative and subject to project-by-project feasibility.' };
  return <Shell><PageIntro eyebrow={`${project.place} · ${project.category}`} title={project.title} body={project.summary} image /><section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28"><div className="grid gap-12 lg:grid-cols-[1fr_.8fr]"><div><Eyebrow>The project</Eyebrow><p className="mt-5 max-w-2xl font-display text-4xl leading-tight text-[#1d2d45]">{detail.headline}</p><p className="mt-7 max-w-2xl leading-8 text-[#667083]">{detail.body}</p><p className="mt-6 max-w-2xl text-sm leading-7 text-[#667083]">{detail.note}</p></div><div className="grid gap-px border border-[#d9d2c4] bg-[#d9d2c4] sm:grid-cols-3 lg:grid-cols-1">{detail.facts.map((fact) => <div key={fact} className="bg-[#f7f3ea] p-6"><p className="font-display text-3xl text-[#1d2d45]">{fact}</p><p className="mt-2 text-xs font-bold uppercase tracking-[.12em] text-[#667083]">Indicative project detail</p></div>)}</div></div></section><section className="bg-[#dfe6dc] px-5 py-20 lg:px-10"><div className="mx-auto max-w-[1400px]"><Eyebrow>Next conversation</Eyebrow><h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight text-[#1d2d45] md:text-5xl">A project becomes real through the quality of its questions.</h2><div className="mt-8"><ButtonLink href="/questionnaire">Discuss partnership readiness</ButtonLink></div></div></section></Shell>;
}

function PartnersPage() {
  const groups = [{ title: 'Government partners', text: 'Public-sector relationships that enable water, land, infrastructure and regional development.' }, { title: 'Capital partners', text: 'Institutional capital aligned with productive assets, governance and a long-term view.' }, { title: 'Commercial markets', text: 'Customers, offtakers and logistics partners who can turn supply into durable revenue.' }, { title: 'Technical partners', text: 'Operators and specialists across agriculture, water, processing, energy and services.' }, { title: 'Church & community', text: 'Dioceses, local leadership and communities who participate in the platform and its benefits.' }, { title: 'Diaspora supporters', text: 'Supporters who want a clear route into the platform, distinct from commercial investment.' }];
  return <Shell><PageIntro eyebrow="Partners" title="Partnerships make the architecture real." body="The platform is built through arm’s-length relationships with government, capital, commercial, technical, Church and community partners." /><section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28"><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{groups.map((x, i) => <div key={x.title} className="border-t-4 border-[#d9a82e] bg-[#f7f3ea] p-7"><p className="font-display text-4xl text-[#d9a82e]">0{i + 1}</p><h2 className="mt-12 font-display text-2xl text-[#1d2d45]">{x.title}</h2><p className="mt-4 text-sm leading-7 text-[#667083]">{x.text}</p></div>)}</div></section><section className="bg-[#ebe5d9] px-5 py-20 lg:px-10"><div className="mx-auto max-w-[1400px]"><Eyebrow>Named relationships</Eyebrow><h2 className="mt-4 font-display text-4xl text-[#1d2d45] md:text-5xl">Evidence before association.</h2><div className="mt-10 grid gap-6 md:grid-cols-3"><div className="bg-[#f7f3ea] p-6"><h3 className="font-display text-2xl text-[#1d2d45]">NWHSA</h3><p className="mt-3 text-sm leading-7 text-[#667083]">Kenya's National Water Harvesting and Storage Authority, named in the Bura-Tana water infrastructure partnership.</p></div><div className="bg-[#f7f3ea] p-6"><h3 className="font-display text-2xl text-[#1d2d45]">Tana River County Government</h3><p className="mt-3 text-sm leading-7 text-[#667083]">The county government partner named for the Kenya programme.</p></div><div className="bg-[#f7f3ea] p-6"><h3 className="font-display text-2xl text-[#1d2d45]">AFC Holdings</h3><p className="mt-3 text-sm leading-7 text-[#667083]">A named institutional relationship in the platform's partner landscape.</p></div></div></div></section><section className="bg-[#1d2d45] px-5 py-20 text-[#f7f3ea] lg:px-10"><div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 md:flex-row md:items-end"><div><Eyebrow>Ready when you are</Eyebrow><h2 className="mt-4 max-w-xl font-display text-4xl leading-tight md:text-5xl">Start with the right route.</h2></div><ButtonLink href="/partner">How to partner</ButtonLink></div></section></Shell>;
}

function AboutPage() {
  return <Shell><PageIntro eyebrow="About Stella Mundi" title="A commercial and productive-asset platform for mission." body="Stella Mundi is the Zimbabwe Catholic Bishops' Conference's commercial and agricultural entity, extending into Kenya. It brings productive assets, project development, capital mobilisation, implementation and stewardship into one platform." image /><section className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 lg:grid-cols-[.7fr_1.3fr] lg:px-10 lg:py-28"><Eyebrow>Economia Pro Homine</Eyebrow><div><p className="font-display text-4xl leading-tight text-[#1d2d45] md:text-5xl">An economy built for the human person.</p><p className="mt-8 max-w-2xl leading-8 text-[#667083]">The platform is designed to complement, never replace, parish giving and benefactor support. Its purpose is to build productive capacity and resilient communities while keeping roles, risks and the use of commercial surplus clear.</p></div></section><section className="bg-[#ebe5d9] px-5 py-20 lg:px-10"><div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-3">{[['01', 'Complement, never replace', 'A second, self-generated stream alongside parish giving and benefactor support.'], ['02', 'Precision over promotion', 'Indicative figures are labelled indicative; planned infrastructure is not presented as operating.'], ['03', 'Dignity of the person', 'Community, worker and land-steward outcomes carry the same seriousness as supply and capital.']].map((x) => <div key={x[0]}><p className="font-display text-3xl text-[#b68a1e]">{x[0]}</p><h3 className="mt-8 font-display text-2xl text-[#1d2d45]">{x[1]}</h3><p className="mt-3 leading-7 text-[#667083]">{x[2]}</p></div>)}</div></section></Shell>;
}

function InsightsPage() {
  const insights = [{ tag: 'Value chain', title: 'Production follows demand.', text: 'How the six-stage Catholic Economy Value Chain connects capital, assets, infrastructure, markets and resilience.' }, { tag: 'Project note', title: 'From 3,250 ha to a livestock platform.', text: 'The phased Bura-Tana development pathway in Kenya.' }, { tag: 'Governance', title: 'Designed, planned, targeting.', text: 'Why the platform distinguishes intended outcomes from achieved and contracted outcomes.' }, { tag: 'Community', title: 'Resilience is part of the architecture.', text: 'How skills, services and participation sit alongside productive assets and markets.' }];
  return <Shell><PageIntro eyebrow="Insights" title="Notes from the work of building carefully." body="Short, useful reflections on land, infrastructure, markets, governance, community resilience and the partnerships that make good work possible." /><section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28"><div className="grid gap-6 md:grid-cols-2">{insights.map((x, i) => <article key={x.title} className={`border-t-4 ${i % 2 === 0 ? 'border-[#d9a82e]' : 'border-[#3f5d42]'} bg-[#ebe5d9] p-7`}><p className="text-xs font-bold uppercase tracking-[.13em] text-[#667083]">{x.tag}</p><h2 className="mt-16 font-display text-3xl leading-tight text-[#1d2d45]">{x.title}</h2><p className="mt-4 text-sm leading-7 text-[#667083]">{x.text}</p><div className="mt-10 flex justify-between border-t border-[#cfc7b8] pt-4 text-xs text-[#667083]"><span>Editorial briefing</span><ArrowRight className="h-4 w-4 text-[#b68a1e]" /></div></article>)}</div></section></Shell>;
}

function GovernancePage() {
  const controls = [{ title: 'Legal and institutional mandate', text: 'Stella Mundi is the Zimbabwe Catholic Bishops’ Conference’s commercial and agricultural entity, with a platform extending into Kenya.' }, { title: 'Three-part architecture', text: 'Stella Mundi is the productive-asset function; market-facing and community/resilience functions are kept distinct for clarity.' }, { title: 'Arm’s-length management', text: 'Clergy, institutional leadership and commercial management have clear roles and decision rights.' }, { title: 'Use of surplus', text: 'Commercial surplus is described alongside where it returns to the platform and its mission; it is not framed as private ownership.' }, { title: 'Project-stage discipline', text: 'Designed, planned, targeting, operating and signed are used according to the evidence available for each project.' }, { title: 'Transparency and safeguards', text: 'The prospectus library is intended to hold governance, ESG, safeguards and MoU summaries as they are confirmed for publication.' }];
  return <Shell><PageIntro eyebrow="Governance & transparency" title="Trust is a design requirement." body="The platform is commercially serious because its roles, decisions, risks, stages and reporting are made visible to the people who carry responsibility." image /><section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-28"><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{controls.map((x, i) => <article key={x.title} className="border-t-4 border-[#0b394d] bg-[#f7f3ea] p-7"><p className="font-display text-3xl text-[#c6c0b5]">0{i + 1}</p><h2 className="mt-12 font-display text-2xl text-[#1d2d45]">{x.title}</h2><p className="mt-4 text-sm leading-7 text-[#667083]">{x.text}</p></article>)}</div></section><section className="bg-[#dfe6dc] px-5 py-20 lg:px-10"><div className="mx-auto max-w-[1400px]"><p className="max-w-3xl font-display text-4xl leading-tight text-[#1d2d45] md:text-5xl">The standard is not complexity. It is clarity.</p><p className="mt-6 max-w-3xl leading-8 text-[#526074]">Figures marked indicative, projected or targeting remain subject to feasibility, approvals, definitive contracts and financial close.</p></div></section></Shell>;
}

function PartnerPage() {
  const routes = ['Government / Public Sector', 'Investor / Capital Partner', 'Financier / Market Partner', 'Offtake / Technical Partner', 'Community / Church', 'Media / Other'];
  return <Shell><PageIntro eyebrow="How to partner" title="Choose the right route." body="Government, investment, market, technical, community, Church, media and other partnership enquiries each need a clear starting point." /><section className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 lg:grid-cols-[.85fr_1.15fr] lg:px-10 lg:py-28"><div><Eyebrow>Start with the evidence</Eyebrow><h2 className="mt-5 font-display text-4xl leading-tight md:text-5xl">The first step is not a pitch deck.</h2><p className="mt-7 max-w-xl leading-8 text-[#667083]">It is a short, considered account of the place, people, authority, water, market and work already underway. The partner readiness questionnaire can be saved locally as you go.</p></div><div className="border border-[#d9d2c4] bg-[#ebe5d9] p-8"><FileText className="h-7 w-7 text-[#b68a1e]" /><h3 className="mt-8 font-display text-3xl text-[#1d2d45]">Choose a route</h3><div className="mt-6 grid gap-3">{routes.map((route) => <div key={route} className="border border-[#d9d2c4] bg-[#f7f3ea] px-4 py-3 text-sm text-[#364255]">{route}</div>)}</div><div className="mt-8"><ButtonLink href="/questionnaire">Begin questionnaire</ButtonLink></div></div></section></Shell>;
}

function FaqPage() {
  const faqs = [
    ['What is Stella Mundi?', "Stella Mundi is the Zimbabwe Catholic Bishops' Conference's commercial and agricultural entity, extending into Kenya. It is a platform for productive assets, project development, capital mobilisation, implementation and stewardship."],
    ['Is Stella Mundi the Church going into business?', 'Stella Mundi is not a replacement for parish giving or benefactor support. It is a second, self-generated stream designed to build productive capacity and strengthen the mission through governed commercial activity.'],
    ['Where does commercial surplus go?', "The platform's stated intent is that commercial surplus returns to the platform and its mission, with use and governance documented clearly. It is not presented as private shareholder profit."],
    ['Are Lumen Terra and Regina Humanitas separate companies?', "On this website, use them as functional descriptions: the market-facing function and the community/resilience function. They should not be presented as separately incorporated companies unless the Zimbabwe Catholic Bishops' Conference confirms that structure."],
    ['How should I read the project figures?', 'Project figures marked indicative, projected or targeting are not achieved outcomes. Planned infrastructure is described as designed or planned; operating, signed and delivering are reserved for confirmed evidence.'],
    ['How can I get involved?', 'Choose the route that fits your role: government, capital, market, technical, Church, community, media or other. The partner readiness questionnaire is the structured starting point for dioceses and trusted partners.'],
  ];
  return <Shell><PageIntro eyebrow="FAQ" title="Clear answers before a sceptical reader has to ask." body="The platform is designed to be commercially serious without overstating its stage, structure or results." /><section className="mx-auto max-w-[1000px] px-5 py-20 lg:px-10 lg:py-28"><div className="grid gap-3">{faqs.map(([question, answer]) => <details key={question} className="border border-[#d9d2c4] bg-[#f7f3ea] p-6"><summary className="cursor-pointer font-display text-2xl text-[#1d2d45]">{question}</summary><p className="mt-4 max-w-3xl leading-8 text-[#667083]">{answer}</p></details>)}</div></section></Shell>;
}

function LibraryPage() {
  const resources = [
    { title: 'Project one-pagers', text: 'Project-level summaries for Mwenezi Lucerne, Bura-Tana, Driefontein, Nuanetsi, Hwange and Tana River.' },
    { title: 'Governance charter', text: 'The platform mandate, decision rights, arm’s-length management and use-of-surplus policy.' },
    { title: 'ESG & safeguards policy', text: 'The safeguards and reporting framework that should sit alongside project feasibility.' },
    { title: 'MoU summaries', text: 'Confirmed partnership summaries, including the Bura-Tana water infrastructure relationship.' },
  ];
  return <Shell><PageIntro eyebrow="Prospectus library" title="The documents behind the platform." body="A single place for project one-pagers, governance, safeguards and confirmed partnership summaries. Publication status is kept explicit." /><section className="mx-auto max-w-[1200px] px-5 py-20 lg:px-10 lg:py-28"><div className="grid gap-6 md:grid-cols-2">{resources.map((resource, i) => <article key={resource.title} className="border border-[#d9d2c4] bg-[#f7f3ea] p-7"><FileText className="h-6 w-6 text-[#b68a1e]" /><p className="mt-10 text-xs font-bold uppercase tracking-[.14em] text-[#667083]">Resource 0{i + 1}</p><h2 className="mt-3 font-display text-3xl text-[#1d2d45]">{resource.title}</h2><p className="mt-4 leading-7 text-[#667083]">{resource.text}</p><p className="mt-7 border-t border-[#d9d2c4] pt-4 text-xs font-bold uppercase tracking-[.12em] text-[#b68a1e]">Publication status · confirm before launch</p></article>)}</div></section></Shell>;
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };
  return <Shell><PageIntro eyebrow="Contact the Catholic Economy platform" title="Start a conversation." body="Government, investment, market, technical and community partnership enquiries." /><section className="mx-auto max-w-[1400px] px-5 py-20 lg:px-10 lg:py-24"><div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]"><div className="bg-[#0b394d] p-8 text-[#f7f3ea]"><Eyebrow>Contact</Eyebrow><h2 className="mt-5 font-display text-4xl">Choose the right route.</h2><p className="mt-6 text-sm leading-7 text-[#d9d2c4]">Government / Public Sector<br />Investor / Capital Partner<br />Financier / Market Partner<br />Offtake / Technical Partner<br />Community / Church<br />Media / Other</p></div><form onSubmit={submit} className="border border-[#d9d2c4] bg-[#f7f3ea] p-8"><Eyebrow>Enquiry</Eyebrow><div className="mt-6 grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#667083]">Name<input required name="name" className="border border-[#d9d2c4] bg-[#ebe5d9] px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#1d2d45]" /></label><label className="grid gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#667083]">Organisation<input name="organisation" className="border border-[#d9d2c4] bg-[#ebe5d9] px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#1d2d45]" /></label><label className="grid gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#667083]">Email<input required type="email" name="email" className="border border-[#d9d2c4] bg-[#ebe5d9] px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#1d2d45]" /></label><label className="grid gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#667083]">Interest<select name="interest" className="border border-[#d9d2c4] bg-[#ebe5d9] px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#1d2d45]"><option>Government / Public Sector</option><option>Investor / Capital Partner</option><option>Financier / Market Partner</option><option>Offtake / Technical Partner</option><option>Community / Church</option><option>Media / Other</option></select></label></div><label className="mt-5 grid gap-2 text-xs font-bold uppercase tracking-[.12em] text-[#667083]">Message<textarea required name="message" rows={5} className="border border-[#d9d2c4] bg-[#ebe5d9] px-4 py-3 text-sm font-normal normal-case tracking-normal text-[#1d2d45]" /></label><button type="submit" className="mt-6 rounded-[4px] bg-[#3f5d42] px-5 py-3 text-sm font-bold uppercase tracking-[.08em] text-[#f7f3ea]">{submitted ? 'Enquiry noted' : 'Submit enquiry'}</button>{submitted && <p className="mt-4 text-sm text-[#3f5d42]">Thank you. This prototype has recorded the enquiry state; final production routing should be confirmed before launch.</p>}</form></div><div className="mt-12"><p className="font-display text-2xl text-[#1d2d45]">contactus@stellarmundi.com</p><p className="mt-2 text-sm text-[#667083]">East & Southern Africa</p></div><div className="mt-10 border border-[#d9d2c4] bg-[#f7f3ea] p-6 text-sm leading-7 text-[#667083]"><span className="font-bold uppercase tracking-[.12em] text-[#b68a1e]">Important</span><br />This website is a stakeholder prototype. Final corporate addresses, jurisdictional contacts and regulated-investor access should be confirmed before production launch.</div></section></Shell>;
}

const steps = [
  { label: 'Place', fields: ['dioceseName', 'landSize', 'landUse'] },
  { label: 'Resources', fields: ['waterSource', 'titleIssues', 'decisionAuthority'] },
  { label: 'Experience', fields: ['priorPartnership', 'fundingReliance', 'briefingAvailability'] },
  { label: 'Readiness', fields: ['governanceNotes', 'greatestConcern', 'confidenceFactors', 'preferredPillar', 'onboardingSupport'] },
  { label: 'Review', fields: ['additionalNotes'] },
];

function QuestionnairePage() {
  const [data, setData] = useState<QuestionnaireData>(() => {
    try { return { ...initialQuestionnaire, ...JSON.parse(localStorage.getItem('stella-questionnaire') ?? '{}') }; } catch { return initialQuestionnaire; }
  });
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [saveState, setSaveState] = useState('Saved locally');
  const createSubmission = useCreatePartnerReadinessSubmission();

  useEffect(() => {
    setSaveState('Saving…');
    const timer = window.setTimeout(() => { localStorage.setItem('stella-questionnaire', JSON.stringify(data)); setSaveState('Saved locally'); }, 350);
    return () => window.clearTimeout(timer);
  }, [data]);

  const update = (key: keyof QuestionnaireData, value: string | string[]) => setData((current) => ({ ...current, [key]: value }));
  const toggleArray = (key: 'confidenceFactors' | 'onboardingSupport', value: string, max?: number) => setData((current) => {
    const list = current[key];
    if (list.includes(value)) return { ...current, [key]: list.filter((x) => x !== value) };
    if (max && list.length >= max) return current;
    return { ...current, [key]: [...list, value] };
  });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    createSubmission.mutate({ data }, { onSuccess: () => { localStorage.removeItem('stella-questionnaire'); setSubmitted(true); } });
  };
  if (submitted) return <Shell><section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center px-5 py-20 lg:px-10"><CircleCheck className="h-12 w-12 text-[#6a865d]" /><Eyebrow>Received with thanks</Eyebrow><h1 className="mt-5 font-display text-6xl leading-none tracking-[-.05em] text-[#1d2d45]">The conversation can begin.</h1><p className="mt-7 max-w-xl text-lg leading-8 text-[#667083]">Your Partner Readiness Questionnaire is with the Stella Mundi team. We will review the detail and come back with a considered next step.</p><div className="mt-9"><ButtonLink href="/">Return home</ButtonLink></div></section></Shell>;
  const isReview = step === steps.length - 1;
  return <Shell><main className="bg-[#ebe5d9]"><div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-12 lg:grid-cols-[.65fr_1.35fr] lg:px-10 lg:py-20"><aside><Eyebrow>Partner readiness</Eyebrow><h1 className="mt-5 font-display text-5xl leading-[.98] tracking-[-.05em] text-[#1d2d45] md:text-6xl">A 15-minute beginning.</h1><p className="mt-6 leading-7 text-[#667083]">A few grounded questions help us understand the place and prepare a useful first conversation.</p><div className="mt-10 flex items-center gap-3 text-xs font-bold uppercase tracking-[.12em] text-[#6a865d]"><span className="h-2 w-2 rounded-full bg-[#6a865d]" />{saveState}</div><div className="mt-12 hidden gap-3 lg:grid">{steps.map((x, i) => <button type="button" key={x.label} onClick={() => setStep(i)} data-testid={`button-step-${i}`} className={`flex items-center gap-3 text-left text-sm ${step === i ? 'font-bold text-[#1d2d45]' : 'text-[#667083]'}`}><span className={`grid h-7 w-7 place-items-center rounded-full border text-xs ${step === i ? 'border-[#1d2d45] bg-[#1d2d45] text-[#f7f3ea]' : 'border-[#b9b2a5]'}`}>{i + 1}</span>{x.label}</button>)}</div></aside><form onSubmit={submit} className="border border-[#d9d2c4] bg-[#f7f3ea] p-6 md:p-10"><div className="mb-10 flex items-center justify-between border-b border-[#d9d2c4] pb-5"><div><p className="eyebrow">Section 0{step + 1} of 0{steps.length}</p><h2 className="mt-2 font-display text-3xl text-[#1d2d45]">{steps[step].label}</h2></div><span className="text-sm text-[#667083]">{Math.round(((step + 1) / steps.length) * 100)}%</span></div>{step === 0 && <div className="grid gap-6"><Field label="Diocese or organisation name" value={data.dioceseName} onChange={(v) => update('dioceseName', v)} placeholder="Name" required /><Field label="Approximate land area" value={data.landSize} onChange={(v) => update('landSize', v)} placeholder="For example, 240 hectares" /><TextArea label="Current or intended land use" value={data.landUse} onChange={(v) => update('landUse', v)} placeholder="Tell us what is happening on the land today." /></div>}{step === 1 && <div className="grid gap-6"><TextArea label="What is the current water source or situation?" value={data.waterSource} onChange={(v) => update('waterSource', v)} placeholder="Borehole, river, rain-fed, planned supply…" /><TextArea label="Are there title, lease, or access questions?" value={data.titleIssues} onChange={(v) => update('titleIssues', v)} placeholder="A short account is helpful." /><Field label="Who holds decision authority for a partnership?" value={data.decisionAuthority} onChange={(v) => update('decisionAuthority', v)} placeholder="Role, office, committee, or named body" /></div>}{step === 2 && <div className="grid gap-6"><TextArea label="Has the diocese or organisation worked with an operating partner before?" value={data.priorPartnership} onChange={(v) => update('priorPartnership', v)} placeholder="What was learned?" /><SelectField label="How would you describe your funding reliance today?" value={data.fundingReliance} onChange={(v) => update('fundingReliance', v)} options={['Mostly parish giving', 'Mostly benefactor support', 'A mix of support and earned income', 'Primarily earned income', 'Still being assessed']} /><SelectField label="How soon could the right people join a briefing?" value={data.briefingAvailability} onChange={(v) => update('briefingAvailability', v)} options={['Within two weeks', 'This quarter', 'Later this year', 'Not yet known']} /></div>}{step === 3 && <div className="grid gap-7"><TextArea label="What governance or accountability structures are already documented?" value={data.governanceNotes} onChange={(v) => update('governanceNotes', v)} placeholder="Up to 400 characters" /><TextArea label="What is your greatest concern about moving forward?" value={data.greatestConcern} onChange={(v) => update('greatestConcern', v)} placeholder="Be candid — this helps us prepare well." /><ChoiceGroup label="What would build your confidence? Choose up to two." values={['A clear operating partner', 'A staged feasibility process', 'Visible governance and reporting', 'A market-backed plan']} selected={data.confidenceFactors} onToggle={(v) => toggleArray('confidenceFactors', v, 2)} /><SelectField label="Which pillar feels most relevant?" value={data.preferredPillar} onChange={(v) => update('preferredPillar', v)} options={pillarItems.map((x) => x.title)} /><ChoiceGroup label="What support would help you prepare?" values={['A short briefing note', 'A site conversation', 'A governance workshop', 'A market or technical review']} selected={data.onboardingSupport} onToggle={(v) => toggleArray('onboardingSupport', v)} /></div>}{isReview && <div className="grid gap-7"><div className="rounded-[4px] bg-[#ebe5d9] p-5 text-sm leading-7 text-[#526074]"><p className="font-bold text-[#1d2d45]">Please review your submission</p><p className="mt-2">You can go back to any section before sending. Your answers are saved locally while you work.</p></div><ReviewList data={data} /></div>}<div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-[#d9d2c4] pt-6"><button type="button" onClick={() => setStep(Math.max(0, step - 1))} data-testid="button-questionnaire-back" className={`rounded-[4px] border border-[#b9b2a5] px-5 py-3 text-sm font-bold text-[#1d2d45] ${step === 0 ? 'invisible' : ''}`}>Back</button>{!isReview ? <button type="button" onClick={() => setStep(Math.min(steps.length - 1, step + 1))} data-testid="button-questionnaire-next" className="rounded-[4px] bg-[#1d2d45] px-5 py-3 text-sm font-bold text-[#f7f3ea]">Continue <ArrowRight className="ml-2 inline h-4 w-4" /></button> : <button type="submit" disabled={createSubmission.isPending} data-testid="button-questionnaire-submit" className="rounded-[4px] bg-[#6a865d] px-5 py-3 text-sm font-bold text-[#f7f3ea] disabled:opacity-60">{createSubmission.isPending ? 'Sending…' : 'Send questionnaire'} <ArrowRight className="ml-2 inline h-4 w-4" /></button>}</div>{createSubmission.isError && <p className="mt-4 text-sm text-[#9a4137]" data-testid="status-questionnaire-error">We could not send this just now. Please try again.</p>}</form></div></main></Shell>;
}

function Field({ label, value, onChange, placeholder, required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean }) {
  return <label className="grid gap-2 text-sm font-bold text-[#1d2d45]">{label}{required && <span className="ml-1 text-[#b68a1e]">*</span>}<input required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} data-testid={`input-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`} className="mt-1 rounded-sm border border-[#cfc7b8] bg-[#ebe5d9] px-4 py-3 font-normal outline-none transition-colors placeholder:text-[#8c918f] focus:border-[#b68a1e] focus:ring-1 focus:ring-[#b68a1e]" /></label>;
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="grid gap-2 text-sm font-bold text-[#1d2d45]">{label}<textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={4} data-testid={`textarea-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`} className="mt-1 resize-y rounded-sm border border-[#cfc7b8] bg-[#ebe5d9] px-4 py-3 font-normal leading-6 outline-none transition-colors placeholder:text-[#8c918f] focus:border-[#b68a1e] focus:ring-1 focus:ring-[#b68a1e]" /></label>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="grid gap-2 text-sm font-bold text-[#1d2d45]">{label}<div className="relative"><select value={value} onChange={(e) => onChange(e.target.value)} data-testid={`select-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`} className="w-full appearance-none rounded-sm border border-[#cfc7b8] bg-[#ebe5d9] px-4 py-3 pr-10 font-normal outline-none focus:border-[#b68a1e]"><option value="">Select one</option>{options.map((x) => <option key={x} value={x}>{x}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[#667083]" /></div></label>;
}

function ChoiceGroup({ label, values, selected, onToggle }: { label: string; values: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return <fieldset><legend className="text-sm font-bold text-[#1d2d45]">{label}</legend><div className="mt-3 grid gap-2">{values.map((x) => <label key={x} className="flex cursor-pointer items-center gap-3 rounded-sm border border-[#d9d2c4] bg-[#ebe5d9] px-4 py-3 text-sm text-[#364255] hover:border-[#b68a1e]"><input type="checkbox" checked={selected.includes(x)} onChange={() => onToggle(x)} data-testid={`checkbox-${x.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`} className="h-4 w-4 accent-[#6a865d]" />{x}</label>)}</div></fieldset>;
}

function ReviewList({ data }: { data: QuestionnaireData }) {
  const entries = useMemo(() => Object.entries(data).filter(([, value]) => Array.isArray(value) ? value.length : value), [data]);
  return <div className="divide-y divide-[#d9d2c4]">{entries.map(([key, value]) => <div key={key} className="grid gap-1 py-4 sm:grid-cols-[.7fr_1fr]"><dt className="text-xs font-bold uppercase tracking-[.1em] text-[#667083]">{key.replaceAll(/([A-Z])/g, ' $1')}</dt><dd className="text-sm leading-6 text-[#1d2d45]">{Array.isArray(value) ? value.join(', ') : value}</dd></div>)}</div>;
}

function AdminPage() {
  const { data, isLoading, isError, refetch } = useListPartnerReadinessSubmissions();
  const { data: health } = useHealthCheck();
  return <Shell><main className="min-h-[70vh] bg-[#ebe5d9]"><div className="mx-auto max-w-[1400px] px-5 py-12 lg:px-10 lg:py-20"><div className="flex flex-wrap items-end justify-between gap-6"><div><Eyebrow>Internal review surface</Eyebrow><h1 className="mt-4 font-display text-5xl tracking-[-.05em] text-[#1d2d45]">Partner readiness</h1><p className="mt-4 text-[#667083]">A private view of submitted questionnaires and their current status.</p></div><div className="flex items-center gap-3 text-xs text-[#667083]"><span className={`h-2 w-2 rounded-full ${health?.status === 'ok' ? 'bg-[#6a865d]' : 'bg-[#d9a82e]'}`} />API {health?.status ?? 'checking'}</div></div>{isLoading && <div className="mt-12 grid gap-3"><div className="h-16 animate-pulse bg-[#d9d2c4]" /><div className="h-16 animate-pulse bg-[#d9d2c4]" /></div>}{isError && <div className="mt-12 border border-[#c88d84] bg-[#f3dfda] p-6 text-[#7c312a]"><p className="font-bold">Submissions could not be loaded.</p><button type="button" onClick={() => refetch()} data-testid="button-admin-retry" className="mt-4 rounded-[4px] border border-[#7c312a] px-4 py-2 text-sm font-bold">Try again</button></div>}{!isLoading && !isError && (!data || data.length === 0) && <div className="mt-12 border border-[#d9d2c4] bg-[#f7f3ea] p-10 text-center"><ClipboardCheck className="mx-auto h-8 w-8 text-[#b68a1e]" /><h2 className="mt-5 font-display text-3xl text-[#1d2d45]">No submissions yet</h2><p className="mt-3 text-sm text-[#667083]">Completed questionnaires will appear here for review.</p></div>}{data && data.length > 0 && <div className="mt-12 overflow-x-auto border border-[#d9d2c4] bg-[#f7f3ea]"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-[#1d2d45] text-xs uppercase tracking-[.1em] text-[#d9d2c4]"><tr><th className="px-5 py-4">Diocese / organisation</th><th className="px-5 py-4">Preferred pillar</th><th className="px-5 py-4">Land</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Received</th></tr></thead><tbody>{data.map((submission) => <tr key={submission.id} data-testid={`row-submission-${submission.id}`} className="border-b border-[#d9d2c4] last:border-0"><td className="px-5 py-5 font-bold text-[#1d2d45]">{submission.dioceseName}</td><td className="px-5 py-5 text-[#526074]">{submission.preferredPillar || '—'}</td><td className="px-5 py-5 text-[#526074]">{submission.landSize || '—'}</td><td className="px-5 py-5"><span className="rounded-[4px] bg-[#dfe6dc] px-3 py-1 text-xs font-bold text-[#526074]">{submission.status}</span></td><td className="px-5 py-5 text-[#667083]">{new Date(submission.submittedAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>}</div></main></Shell>;
}

function Router() {
  return <ErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/model" component={ModelPage} /><Route path="/value-chain" component={ValueChainPage} /><Route path="/enterprises" component={EnterprisesPage} /><Route path="/infrastructure" component={InfrastructurePage} /><Route path="/markets" component={MarketsPage} /><Route path="/impact" component={ImpactPage} /><Route path="/invest" component={InvestPage} /><Route path="/projects" component={ProjectsPage} /><Route path="/projects/:slug" component={ProjectDetailPage} /><Route path="/partners" component={PartnersPage} /><Route path="/about" component={AboutPage} /><Route path="/insights" component={InsightsPage} /><Route path="/governance" component={GovernancePage} /><Route path="/partner" component={PartnerPage} /><Route path="/faq" component={FaqPage} /><Route path="/library" component={LibraryPage} /><Route path="/contact" component={ContactPage} /><Route path="/questionnaire" component={QuestionnairePage} /><Route path="/admin" component={AdminPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;