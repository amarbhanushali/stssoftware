import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { services, stages, projects, articles } from "./data.js";
import { getMetadata } from "./metadata.js";

const paths = {
  arrow: "M5 12h14m-6-6 6 6-6 6",
  check: "m5 12 4 4L19 6",
  code: "m8 5-7 7 7 7m8-14 7 7-7 7m-3-16-2 18",
  layers: "m12 2 10 5-10 5L2 7l10-5ZM2 12l10 5 10-5M2 17l10 5 10-5",
  globe:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z",
  phone:
    "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm4 16h2",
  layout: "M3 3h18v18H3V3Zm0 6h18M9 9v12",
  spark: "m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z",
  shield: "m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Zm-4 9 3 3 5-6",
  menu: "M3 6h18M3 12h18M3 18h18",
  close: "m6 6 12 12M6 18 18 6",
  search: "M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2",
  database:
    "M3 5c0-4 18-4 18 0s-18 4-18 0Zm0 0v14c0 4 18 4 18 0V5M3 12c0 4 18 4 18 0",
  mail: "M2 4h20v16H2V4Zm0 0 10 9L22 4",
};
function Icon({ name = "arrow", ...props }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.code} />
    </svg>
  );
}
function Button({
  to = "/consultation",
  children = "Request a Consultation",
  outline = false,
  ...props
}) {
  return (
    <Link to={to} className={`button ${outline ? "outline" : ""}`} {...props}>
      {children}
      <Icon name="arrow" />
    </Link>
  );
}
function Tag({ children }) {
  return <span className="tag">{children}</span>;
}
function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const onEscape = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" aria-label="Samarth Tech Software home" className="brand">
          <img
            src="/sts-logo.png"
            alt="Samarth Tech Software"
            width="600"
            height="400"
          />
        </Link>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={open ? "nav open" : "nav"}
        >
          {[
            ["/", "Home"],
            ["/services", "Services"],
            ["/work", "Our Work"],
            ["/about", "About"],
            ["/process", "Process"],
            ["/technology", "Technology"],
            ["/insights", "Insights"],
          ].map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"}>
              {label}
            </NavLink>
          ))}
          <Link to="/contact" className="mobile-contact">
            Contact
          </Link>
        </nav>
        <div className="header-actions">
          <Button />
          <button
            ref={toggleRef}
            className="menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}
function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Link to="/" className="footer-brand">
            Samarth<span>Tech</span>
            <small>SOFTWARE</small>
          </Link>
          <p>
            Practical software. Connected systems.
            <br />
            Built around your business.
          </p>
          <Link className="footer-contact" to="/contact">
            Let’s talk about your project <Icon />
          </Link>
        </div>
        <div>
          <h3>Capabilities</h3>
          {services.map((s) => (
            <Link key={s.slug} to={`/services/${s.slug}`}>
              {s.name.replace(" Development", "")}
            </Link>
          ))}
        </div>
        <div>
          <h3>Company</h3>
          {[
            ["/about", "About us"],
            ["/process", "Our process"],
            ["/technology", "Technology stack"],
            ["/work", "Solution examples"],
            ["/insights", "Insights"],
            ["/contact", "Contact"],
          ].map(([p, t]) => (
            <Link key={p} to={p}>
              {t}
            </Link>
          ))}
        </div>
        <div>
          <h3>Start a conversation</h3>
          <p>
            Have a workflow to improve or a product to build? Tell us what you
            have in mind.
          </p>
          <Button>Discuss Your Project</Button>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Samarth Tech Software. All rights
          reserved.
        </span>
        <div>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}
function Hero({ eyebrow, title, description, children }) {
  return (
    <section className="page-hero tech-grid">
      <div className="container">
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{eyebrow}</span>
        </div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
        {children}
      </div>
    </section>
  );
}
function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
function CTA() {
  return (
    <section className="cta">
      <div className="container cta-inner">
        <div>
          <span className="eyebrow">LET’S BUILD SOMETHING USEFUL</span>
          <h2>Have a business challenge in mind?</h2>
          <p>Tell us where you are today and what you want to make possible.</p>
        </div>
        <Button>Discuss Your Project</Button>
      </div>
    </section>
  );
}
function Architecture() {
  return (
    <div className="architecture">
      <div className="console-top">
        <div className="window-dots">
          <i />
          <i />
          <i />
        </div>
        <span>YOUR CONNECTED BUSINESS</span>
        <Tag>System blueprint</Tag>
      </div>
      <div className="architecture-node">
        <Icon name="shield" />
        <div>
          <strong>Your team. The right access.</strong>
          <small>Secure, role-based workspace</small>
        </div>
        <span className="status-dot" />
      </div>
      <div className="connector-line" />
      <div className="architecture-columns">
        <div>
          <span className="icon-tile">
            <Icon name="database" />
          </span>
          <strong>Business systems</strong>
          <p>One source of information</p>
          <div className="mini-bars">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div>
          <span className="icon-tile orange">
            <Icon name="spark" />
          </span>
          <strong>Practical AI</strong>
          <p>Automation with oversight</p>
          <span className="mini-status">
            <Icon name="check" />
            Human review built in
          </span>
        </div>
      </div>
      <div className="connector-line" />
      <div className="code-panel">
        <span className="code-label">
          THE DELIVERY PLAN <span>STS</span>
        </span>
        <p>
          <span>01</span> understand
          <span className="code-orange">(your_business)</span>
        </p>
        <p>
          <span>02</span> build
          <span className="code-orange">(the_right_solution)</span>
        </p>
        <p>
          <span>03</span> improve<span className="code-orange">(together)</span>
        </p>
      </div>
      <div className="console-bottom">
        <span>
          <Icon name="check" />
          Designed around your workflow
        </span>
        <span>01 — 06</span>
      </div>
    </div>
  );
}
function ServiceCard({ service: s }) {
  return (
    <article
      className={`card service-card ${s.category === "AI Automation" ? "accent-card" : ""}`}
    >
      <span
        className={`icon-tile ${s.category === "AI Automation" ? "orange" : ""}`}
      >
        <Icon name={s.icon} />
      </span>
      <h3>
        <Link to={`/services/${s.slug}`}>{s.name}</Link>
      </h3>
      <p>{s.short}</p>
      <div className="tags">
        {s.stack.slice(0, 3).map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <Link className="text-link" to={`/services/${s.slug}`}>
        Explore service <Icon />
      </Link>
    </article>
  );
}
function Home() {
  return (
    <>
      <section className="home-hero tech-grid">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow badge">
              <span className="status-dot" />
              BUSINESS-FOCUSED ENGINEERING
            </span>
            <h1>
              Custom Software and Practical <span>AI Automation</span> for Your
              Business
            </h1>
            <p className="lead">
              From business websites and web applications to custom systems and
              practical AI workflows, Samarth Tech Software helps you turn
              business requirements into reliable digital solutions.
            </p>
            <div className="hero-actions">
              <Button />
              <Button to="/services" outline>
                Explore Our Services
              </Button>
            </div>
            <div className="trust-row">
              {[
                "Clear milestones",
                "Connected systems",
                "Practical automation",
                "Ongoing support",
              ].map((t) => (
                <span key={t}>
                  <Icon name="check" />
                  {t}
                </span>
              ))}
            </div>
          </div>
          <Architecture />
        </div>
      </section>
      <section className="section white">
        <div className="container">
          <SectionHeading
            eyebrow="LESS FRICTION. MORE FOCUS."
            title="Solving real operational bottlenecks"
            description="Technology should make your work simpler. Start with the challenges slowing your business down."
          />
          <div className="grid three">
            {[
              [
                "layers",
                "Disconnected tools & spreadsheets",
                "Bring information and teams into one coherent business workflow.",
                "custom-software",
              ],
              [
                "spark",
                "Repetitive manual work",
                "Connect practical automation to the tasks that take up your team’s time.",
                "ai-automation",
              ],
              [
                "code",
                "Systems that hold you back",
                "Modernise the experience, connect your tools and make room to grow.",
                "web-applications",
              ],
            ].map(([icon, title, copy, slug]) => (
              <Link
                to={`/services/${slug}`}
                className="problem-card"
                key={slug}
              >
                <Icon name={icon} />
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="text-link">
                  Find a solution <Icon />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="heading-row">
            <SectionHeading
              eyebrow="OUR CAPABILITIES"
              title="Engineering services built for your business"
              description="From your first website to the systems behind your operations."
            />
            <Link className="text-link" to="/services">
              All services <Icon />
            </Link>
          </div>
          <div className="grid three">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>
      <section className="section white">
        <div className="container">
          <SectionHeading
            eyebrow="A CLEAR PATH FROM IDEA TO DELIVERY"
            title="Six stages. Shared understanding."
            description="Know what happens next, what you will review and what each stage delivers."
          />
          <div className="process-strip">
            {stages.map(([title], i) => (
              <Link to={`/process#stage-${i + 1}`} key={title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <Icon />
              </Link>
            ))}
          </div>
          <div className="center-action">
            <Button to="/process" outline>
              Explore Our Process
            </Button>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="THE TOOLS BEHIND THE WORK"
            title="A practical technology stack"
            description="Selected for your requirements, the people maintaining the system and the life of your product."
          />
          <div className="grid four">
            {[
              ["Backend core", "Laravel", "Python", "Node.js"],
              ["Frontend & UI", "React", "JavaScript", "Accessible HTML"],
              ["Data & systems", "PostgreSQL", "MySQL", "REST APIs"],
              [
                "Practical AI",
                "LLM integration",
                "Workflow automation",
                "Human review",
              ],
            ].map(([title, ...items]) => (
              <div className="stack-tile" key={title}>
                <h3>{title}</h3>
                {items.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            ))}
          </div>
          <div className="center-action">
            <Link className="text-link" to="/technology">
              Explore our technology approach <Icon />
            </Link>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
function Filters({ options, value, onChange, label = "Filter results" }) {
  return (
    <div className="filters" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={value === o ? "selected" : ""}
          aria-pressed={value === o}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
function Services() {
  const [filter, setFilter] = useState("All Services");
  const filtered = services.filter(
    (s) => filter === "All Services" || s.category === filter,
  );
  return (
    <>
      <Hero
        eyebrow="Services"
        title="Engineering services designed for business impact"
        description="Build the right solution for your operational stage, from a focused first release to a connected business platform."
      />
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="OUR CAPABILITIES"
            title="Comprehensive service offerings"
          />
          <Filters
            options={[
              "All Services",
              ...new Set(services.map((s) => s.category)),
            ]}
            value={filter}
            onChange={setFilter}
          />
          <p className="result-count" aria-live="polite">
            {filtered.length} services
          </p>
          <div className="grid three">
            {filtered.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>
      <section className="section white">
        <div className="container">
          <SectionHeading
            eyebrow="RIGHT-SIZED DELIVERY"
            title="Built for your next stage"
          />
          <div className="grid three">
            {[
              [
                "Startups",
                "Define the essential first release and get a useful product into the hands of your users.",
              ],
              [
                "Small & medium businesses",
                "Replace disconnected workflows with tools that make day-to-day operations easier.",
              ],
              [
                "Manufacturing & retail",
                "Connect orders, inventory and reporting to give your teams a clearer operational view.",
              ],
            ].map(([t, p]) => (
              <div className="card" key={t}>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
function FAQ({ items }) {
  return (
    <div className="faq-list">
      {items.map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <span>+</span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
const commonFAQ = [
  [
    "How is the project price decided?",
    "We first review your requirements, integrations, priorities and constraints. The proposal then describes the scope, delivery milestones and commercial terms.",
  ],
  [
    "How long will development take?",
    "The timeline depends on the size of the release, required integrations and the availability of decisions and content. We agree a plan after scoping rather than promising a date before understanding the work.",
  ],
  [
    "Can you work with our existing system?",
    "Yes, we can start with a review of your current application and integrations. The discovery stage identifies what can be retained, improved or replaced.",
  ],
  [
    "What happens after launch?",
    "We discuss maintenance, updates and support needs during project planning. The agreed support scope and response terms form part of the engagement.",
  ],
];
function ServiceDetail() {
  const { slug } = useParams();
  const s = services.find((s) => s.slug === slug);
  if (!s) return <NotFound />;
  return (
    <>
      <Hero eyebrow={s.name} title={s.short} description={s.description}>
        <div className="hero-actions">
          <Button to={`/consultation?service=${s.slug}`}>
            Discuss This Service
          </Button>
          <Button to="/services" outline>
            All Services
          </Button>
        </div>
      </Hero>
      <section className="section">
        <div className="container detail-layout">
          <div>
            <SectionHeading eyebrow="WHAT WE DELIVER" title={s.name} />
            <div className="grid two">
              {s.deliverables.map((t, i) => (
                <article className="card deliverable" key={t}>
                  <span className="step-small">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{t}</h3>
                  <p>
                    Defined around your requirements and reviewed as part of the
                    agreed project milestones.
                  </p>
                </article>
              ))}
            </div>
          </div>
          <aside className="sidebar-card">
            <Icon name={s.icon} />
            <h3>A clear starting point</h3>
            <p>
              Share the process you want to improve, your existing tools and
              your priorities.
            </p>
            <div className="tags">
              {s.stack.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
            <Button to={`/consultation?service=${s.slug}`}>
              Request a Consultation
            </Button>
            <Link to="/process" className="text-link">
              How we deliver <Icon />
            </Link>
          </aside>
        </div>
      </section>
      <section className="section white">
        <div className="container narrow">
          <SectionHeading eyebrow="BEFORE WE BEGIN" title="Common questions" />
          <FAQ items={commonFAQ} />
        </div>
      </section>
      <CTA />
    </>
  );
}
function Process() {
  return (
    <>
      <Hero
        eyebrow="Our Process"
        title="A clear engineering process, from discovery to support"
        description="Six stages keep the work visible and give your team meaningful decisions at the right time."
      />
      <section className="section">
        <div className="container stages">
          {stages.map(([title, sub, copy, output], i) => (
            <article id={`stage-${i + 1}`} className="stage" key={title}>
              <div className="stage-number">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <span className="eyebrow">STAGE {i + 1}</span>
                <h2>{title}</h2>
                <h3>{sub}</h3>
                <p>{copy}</p>
                <div className="stage-output">
                  <Icon name="check" />
                  <span>
                    <strong>You receive</strong>
                    {output}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section white">
        <div className="container">
          <SectionHeading
            eyebrow="WAYS TO WORK TOGETHER"
            title="An engagement model that fits the work"
          />
          <div className="grid two">
            <article className="card">
              <h3>Defined scope and milestones</h3>
              <p>
                Useful when the first release can be clearly specified. Agree
                deliverables, review points and change handling before the
                build.
              </p>
            </article>
            <article className="card">
              <h3>Iterative product development</h3>
              <p>
                Useful when the roadmap evolves with feedback. Prioritise a
                backlog together and review working features at agreed
                intervals.
              </p>
            </article>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
function Technology() {
  const [selected, setSelected] = useState("Custom Web App");
  const stacks = {
    "Custom Web App": [
      ["React", "User interface"],
      ["Node.js or Laravel", "Application layer"],
      ["PostgreSQL", "Business data"],
      ["REST APIs", "System integration"],
    ],
    "Enterprise Portal": [
      ["React", "Role-based workspace"],
      ["Laravel", "Business workflows"],
      ["MySQL or PostgreSQL", "Structured data"],
      ["Identity integration", "Access management"],
    ],
    "Mobile Application": [
      ["React Native or Flutter", "Mobile experience"],
      ["SQLite", "Local data where needed"],
      ["REST APIs", "Data synchronisation"],
      ["Node.js or Laravel", "Backend services"],
    ],
  };
  return (
    <>
      <Hero
        eyebrow="Technology"
        title="The right tools for a maintainable system"
        description="We start with your requirements, data and operational needs. Technology choices should serve the product and the team that will maintain it."
      />
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="TECHNOLOGY BY DOMAIN"
            title="A connected engineering toolkit"
          />
          <div className="grid three">
            {[
              [
                "code",
                "Backend & APIs",
                "Laravel, Python and Node.js",
                "Business logic, integrations and reliable application services.",
              ],
              [
                "layout",
                "Frontend & experience",
                "React, HTML, CSS and JavaScript",
                "Responsive, understandable interfaces for the work your users need to do.",
              ],
              [
                "database",
                "Data & reporting",
                "PostgreSQL, MySQL and SQLite",
                "Structured information with clear ownership, access and reporting.",
              ],
              [
                "phone",
                "Mobile applications",
                "React Native and Flutter",
                "Mobile experiences designed for the device and working environment.",
              ],
              [
                "shield",
                "Deployment & operations",
                "Source control, automation and monitoring",
                "Repeatable releases and practical tools to maintain your application.",
              ],
              [
                "spark",
                "AI & automation",
                "Python, LLM APIs and workflow tools",
                "Bounded automation with evaluation, review and escalation paths.",
              ],
            ].map(([icon, t, stack, p]) => (
              <article className="card" key={t}>
                <span className="icon-tile">
                  <Icon name={icon} />
                </span>
                <h3>{t}</h3>
                <strong className="blue-copy">{stack}</strong>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section white">
        <div className="container">
          <SectionHeading
            eyebrow="EXPLORE A STARTING POINT"
            title="Example stacks by solution"
            description="These are starting points for a discussion, rather than fixed requirements for every project."
          />
          <div
            role="tablist"
            aria-label="Solution stack"
            className="filters"
            onKeyDown={(e) => {
              const keys = Object.keys(stacks);
              const current = keys.indexOf(selected);
              let next = current;
              if (e.key === "ArrowRight") next = (current + 1) % keys.length;
              else if (e.key === "ArrowLeft")
                next = (current + keys.length - 1) % keys.length;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = keys.length - 1;
              else return;
              e.preventDefault();
              setSelected(keys[next]);
              document.getElementById(`stack-tab-${next}`)?.focus();
            }}
          >
            {Object.keys(stacks).map((t, i) => (
              <button
                id={`stack-tab-${i}`}
                key={t}
                role="tab"
                tabIndex={t === selected ? 0 : -1}
                aria-controls="stack-panel"
                aria-selected={t === selected}
                className={t === selected ? "selected" : ""}
                onClick={() => setSelected(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div
            className="stack-panel"
            role="tabpanel"
            id="stack-panel"
            aria-labelledby={`stack-tab-${Object.keys(stacks).indexOf(selected)}`}
          >
            <div>
              <span className="eyebrow">SOLUTION BLUEPRINT</span>
              <h2>{selected}</h2>
              <p>
                Each layer has a clear responsibility and a defined connection
                to the next.
              </p>
              <Button to="/consultation">Discuss Your Architecture</Button>
            </div>
            <div className="stack-layers">
              {stacks[selected].map(([t, p], i) => (
                <div key={t}>
                  <span>0{i + 1}</span>
                  <strong>{t}</strong>
                  <small>{p}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
function About() {
  return (
    <>
      <Hero
        eyebrow="About STS"
        title="Practical software engineering. Shared understanding."
        description="Samarth Tech Software builds digital solutions around the way businesses work, bringing planning, design, development and support into one delivery process."
      />
      <section className="section white">
        <div className="container about-grid">
          <div>
            <span className="eyebrow">OUR APPROACH</span>
            <h2>
              Understand the business.
              <br />
              Then build the software.
            </h2>
            <p>
              Every project starts with people: the team doing the work, the
              customers using the service and the decisions the business needs
              to make.
            </p>
            <p>
              We translate those needs into clear requirements and useful
              software. Our aim is a system your team understands, can operate
              and can keep improving.
            </p>
            <Button to="/process" outline>
              Meet Our Process
            </Button>
          </div>
          <div className="about-mark">
            <img
              src="/sts-logo.png"
              alt="Samarth Tech Software"
              width="600"
              height="400"
            />
            <span>SOFTWARE · SYSTEMS · AUTOMATION</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="HOW WE WORK"
            title="Clear principles. Practical decisions."
          />
          <div className="grid two">
            {[
              [
                "01",
                "Business value before features",
                "Start with an operational problem and define what a useful outcome looks like.",
              ],
              [
                "02",
                "Visible, staged delivery",
                "Review progress at clear milestones and make scope decisions together.",
              ],
              [
                "03",
                "Maintainable foundations",
                "Choose understandable architecture and provide the documentation needed for handover.",
              ],
              [
                "04",
                "Security and usability in the plan",
                "Consider permissions, sensitive data, error recovery and accessible interaction during design.",
              ],
            ].map(([n, t, p]) => (
              <article className="card" key={n}>
                <span className="step-small">{n}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
function Work() {
  const [filter, setFilter] = useState("All Solutions");
  const list = projects.filter(
    (p) => filter === "All Solutions" || p.category === filter,
  );
  return (
    <>
      <Hero
        eyebrow="Our Work"
        title="Explore what a connected business system can look like"
        description="Illustrative solution examples show how we approach common operational challenges. These are concepts, not published client case studies or measured customer results."
      />
      <section className="section">
        <div className="container">
          <Filters
            value={filter}
            onChange={setFilter}
            options={[
              "All Solutions",
              ...new Set(projects.map((p) => p.category)),
            ]}
          />
          <p className="result-count" aria-live="polite">
            {list.length} solution examples
          </p>
          <div className="grid two">
            {list.map((p, i) => (
              <article className="card project-card" key={p.slug}>
                <Link
                  to={`/work/${p.slug}`}
                  className={`project-visual visual-${i % 2}`}
                  aria-label={`Explore ${p.title}`}
                >
                  <span className="visual-label">ILLUSTRATIVE SOLUTION</span>
                  <div className="flow-nodes">
                    <span>
                      <Icon name={p.icon} />
                    </span>
                    <i />
                    <span>
                      <Icon name="code" />
                    </span>
                    <i />
                    <span>
                      <Icon name="check" />
                    </span>
                  </div>
                  <span className="visual-caption">
                    CAPTURE → CONNECT → CLARITY
                  </span>
                </Link>
                <div className="project-content">
                  <span className="eyebrow">{p.industry}</span>
                  <h2>
                    <Link to={`/work/${p.slug}`}>{p.title}</Link>
                  </h2>
                  <p>{p.challenge}</p>
                  <div className="tags">
                    {p.stack.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  <Link to={`/work/${p.slug}`} className="text-link">
                    Explore solution <Icon />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
function WorkDetail() {
  const { slug } = useParams();
  const p = projects.find((p) => p.slug === slug);
  if (!p) return <NotFound />;
  return (
    <>
      <Hero
        eyebrow="Solution Example"
        title={p.title}
        description={`${p.industry} · Illustrative concept, not a client case study.`}
      />
      <section className="section">
        <div className="container narrow">
          <h2>The operational challenge</h2>
          <p className="lead">{p.challenge}</p>
          <h2>A possible approach</h2>
          <p>{p.solution}</p>
          <h2>Core capabilities</h2>
          <ul className="check-list">
            {p.features.map((f) => (
              <li key={f}>
                <Icon name="check" />
                {f}
              </li>
            ))}
          </ul>
          <h2>How we would evaluate it</h2>
          <p>
            During discovery, agree a baseline and acceptance criteria with the
            team doing the work. Compare the completed workflow with that
            baseline, including time spent, error handling and the effort
            required to maintain the system.
          </p>
          <div className="tags">
            {p.stack.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <div className="hero-actions">
            <Button>Discuss a Similar Challenge</Button>
            <Button to="/work" outline>
              All Solutions
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
function Insights() {
  const [filter, setFilter] = useState("All Articles");
  const [search, setSearch] = useState("");
  const list = articles.filter(
    (a) =>
      (filter === "All Articles" || a.category === filter) &&
      `${a.title} ${a.intro}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <Hero
        eyebrow="Insights"
        title="Useful thinking for your next digital project"
        description="Practical guides to scoping, software workflows and responsible automation. Written to help you ask better questions before you build."
      />
      <section className="section">
        <div className="container">
          <div className="filter-toolbar">
            <Filters
              value={filter}
              onChange={setFilter}
              options={[
                "All Articles",
                ...new Set(articles.map((a) => a.category)),
              ]}
            />
            <label className="search-field">
              <Icon name="search" />
              <span className="sr-only">Search articles</span>
              <input
                type="search"
                placeholder="Search insights…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
          <p className="result-count" aria-live="polite">
            {list.length} articles
          </p>
          <div className="grid three">
            {list.map((a, i) => (
              <article className="card article-card" key={a.slug}>
                <div className={`article-cover cover-${i % 3}`}>
                  <span>{a.category}</span>
                  <Icon
                    name={
                      a.category === "Practical AI"
                        ? "spark"
                        : a.category === "Business Systems"
                          ? "layers"
                          : "code"
                    }
                  />
                </div>
                <div className="article-content">
                  <div className="article-meta">
                    <Tag>{a.category}</Tag>
                    <span>{a.minutes} min read</span>
                  </div>
                  <h2>
                    <Link to={`/insights/${a.slug}`}>{a.title}</Link>
                  </h2>
                  <p>{a.intro}</p>
                  <Link className="text-link" to={`/insights/${a.slug}`}>
                    Read guide <Icon />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {!list.length && (
            <div className="empty-state">
              <Icon name="search" />
              <h2>No matching articles</h2>
              <p>Try a different search or browse all our guides.</p>
              <button
                className="button"
                onClick={() => {
                  setSearch("");
                  setFilter("All Articles");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
      <CTA />
    </>
  );
}
function Article() {
  const { slug } = useParams();
  const a = articles.find((a) => a.slug === slug);
  if (!a) return <NotFound />;
  return (
    <>
      <Hero eyebrow={a.category} title={a.title} description={a.intro}>
        <div className="article-byline">
          <Icon name="clock" />
          {a.minutes} min read <span>·</span> STS Editorial
        </div>
      </Hero>
      <section className="section white">
        <article className="container reading-column">
          {a.sections.map(([h, p]) => (
            <section key={h}>
              <h2>{h}</h2>
              <p>{p}</p>
            </section>
          ))}
          <div className="article-end">
            <p>Planning a related project?</p>
            <Button>Talk Through Your Requirements</Button>
          </div>
          <Link className="text-link" to="/insights">
            Back to all insights <Icon />
          </Link>
        </article>
      </section>
    </>
  );
}

function Consultation() {
  const [search] = useSearchParams();
  const service = services.find((s) => s.slug === search.get("service"));
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState(null);
  const key = useRef(crypto.randomUUID());
  const formRef = useRef(null);
  useEffect(() => {
    let active = true;
    fetch("/api/session", { credentials: "same-origin" })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((d) => {
        if (active) setToken(d.token);
      })
      .catch(() => {
        if (active)
          setError(
            "The enquiry service is unavailable. Please try again shortly.",
          );
      });
    return () => {
      active = false;
    };
  }, []);
  async function submit(e) {
    e.preventDefault();
    if (status === "sending") return;
    setError("");
    setStatus("sending");
    const values = Object.fromEntries(new FormData(e.currentTarget));
    try {
      let csrf = token;
      if (!csrf) {
        const r = await fetch("/api/session");
        if (!r.ok)
          throw Error("The enquiry service is unavailable. Please try again.");
        csrf = (await r.json()).token;
        setToken(csrf);
      }
      const r = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrf,
          "Idempotency-Key": key.current,
        },
        body: JSON.stringify(values),
      });
      const data = await r.json();
      if (!r.ok) {
        if (r.status === 403) setToken("");
        throw Error(
          data.error || "Your enquiry could not be saved. Please try again.",
        );
      }
      setReceipt(data.reference);
      setStatus("success");
      if (window.gtag && window.localStorage.getItem("sts_analytics_consent") === "accepted")
        window.gtag("event", "generate_lead", {
          service: values.service,
          timeline: values.timeline,
        });
      formRef.current?.reset();
    } catch (err) {
      setError(
        err.message ||
          "We could not connect. Your details are still here; please try again.",
      );
      setStatus("error");
    }
  }
  return (
    <>
      <Hero
        eyebrow="Contact & Consultation"
        title="Let’s understand what you want to build"
        description="Tell us about your business, the problem you are solving and where you want to go next."
      />
      <section className="section">
        <div className="container consultation-grid">
          <aside>
            <span className="eyebrow">WHAT HAPPENS NEXT</span>
            <h2>A conversation with a clear purpose.</h2>
            {[
              [
                "01",
                "We review your requirements",
                "We look at your goals, current tools and the kind of help you need.",
              ],
              [
                "02",
                "We clarify the right approach",
                "We discuss scope, constraints, integrations and the most useful starting point.",
              ],
              [
                "03",
                "We outline the next steps",
                "We agree whether discovery or a project proposal is the right next move.",
              ],
            ].map(([n, t, p]) => (
              <div className="next-step" key={n}>
                <span>{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{p}</p>
                </div>
              </div>
            ))}
            <div className="privacy-note">
              <Icon name="shield" />
              <p>
                Please share a high-level overview. Leave passwords, financial
                records and other confidential data out of this form.
              </p>
            </div>
            <div className="privacy-note">
              <Icon name="globe" />
              <p>
                Based in Nashik, Maharashtra. <a href="https://www.google.com/maps/search/?api=1&query=16+Shukhakarta+Row+Houses%2C+Ganpati+Temple%2C+Shivajinagar+Dharmaji+Colony%2C+Ashok+Nagar%2C+Nashik+422012" target="_blank" rel="noopener noreferrer">View our address on Google Maps</a>.
              </p>
            </div>
          </aside>
          <div className="form-card">
            {status === "success" ? (
              <div className="success-state" role="status">
                <span className="success-icon">
                  <Icon name="check" />
                </span>
                <h2>Your enquiry has been received.</h2>
                <p>
                  Thank you for sharing your project. Keep this reference for
                  any follow-up.
                </p>
                <strong className="receipt">{receipt}</strong>
                <p>
                  We will review the details and use the email address you
                  provided to discuss next steps.
                </p>
                <Button to="/services" outline>
                  Explore Our Services
                </Button>
              </div>
            ) : (
              <>
                <span className="eyebrow">START THE CONVERSATION</span>
                <h2>Tell us about your project</h2>
                <p className="form-intro">Fields marked * are required.</p>
                <form ref={formRef} onSubmit={submit}>
                  <div className="form-row">
                    <label>
                      Your name *
                      <input
                        name="name"
                        autoComplete="name"
                        required
                        minLength={2}
                        maxLength={100}
                        placeholder="Full name"
                      />
                    </label>
                    <label>
                      Email address *
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={200}
                        placeholder="you@company.com"
                      />
                    </label>
                  </div>
                  <div className="form-row">
                    <label>
                      Company
                      <input
                        name="company"
                        autoComplete="organization"
                        maxLength={150}
                        placeholder="Company name"
                      />
                    </label>
                    <label>
                      Phone number
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        maxLength={30}
                        placeholder="Optional"
                      />
                    </label>
                  </div>
                  <label>
                    Service you are interested in *
                    <select
                      name="service"
                      defaultValue={service?.slug || ""}
                      required
                    >
                      <option value="" disabled>
                        Select a service
                      </option>
                      {services.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.name}
                        </option>
                      ))}
                      <option value="not-sure">I’m not sure yet</option>
                    </select>
                  </label>
                  <fieldset>
                    <legend>Project timeline</legend>
                    <div className="radio-options">
                      {[
                        "As soon as possible",
                        "1–3 months",
                        "3–6 months",
                        "Exploring options",
                      ].map((t) => (
                        <label key={t}>
                          <input
                            type="radio"
                            name="timeline"
                            value={t}
                            defaultChecked={t === "Exploring options"}
                          />
                          <span>{t}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label>
                    What would you like to build or improve? *
                    <textarea
                      name="message"
                      rows={5}
                      required
                      minLength={20}
                      maxLength={5000}
                      placeholder="Tell us about your goals, current workflow and any tools we should know about…"
                    />
                  </label>
                  <div className="honeypot" aria-hidden="true">
                    <label>
                      Leave this empty
                      <input name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="privacy"
                      value="accepted"
                      required
                    />
                    <span>
                      I have read the{" "}
                      <Link to="/privacy" target="_blank" rel="noopener">
                        privacy notice
                      </Link>{" "}
                      and agree to the use of my details to respond to this
                      enquiry. *
                    </span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" name="whatsapp" value="accepted" />
                    <span>
                      Send me a WhatsApp confirmation and follow-up about this
                      enquiry.
                    </span>
                  </label>
                  {error && (
                    <div className="form-error" role="alert">
                      {error}
                    </div>
                  )}
                  <button
                    className="button submit-button"
                    disabled={status === "sending"}
                    type="submit"
                  >
                    {status === "sending"
                      ? "Saving your enquiry…"
                      : "Send Project Enquiry"}
                    <Icon />
                  </button>
                  <p className="form-footnote">
                    Your details are used to discuss your request. No newsletter
                    sign-up.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
      <section className="section white">
        <div className="container narrow">
          <SectionHeading
            eyebrow="A LITTLE MORE CLARITY"
            title="Before you get in touch"
          />
          <FAQ items={commonFAQ} />
        </div>
      </section>
    </>
  );
}
function Policy({ terms = false }) {
  return (
    <>
      <Hero
        eyebrow={terms ? "Terms of Use" : "Privacy Notice"}
        title={
          terms ? "Using this website" : "How this website handles your enquiry"
        }
        description="Samarth Tech Software"
      />
      <section className="section white">
        <div className="container reading-column">
          {terms ? (
            <>
              <h2>Website information</h2>
              <p>
                The website describes services and illustrative solutions.
                Solution examples are concepts and are not representations of
                completed client projects.
              </p>
              <h2>Project engagements</h2>
              <p>
                Submitting an enquiry does not create a service contract.
                Deliverables, pricing, timelines, intellectual property and
                support terms are agreed separately in a project agreement.
              </p>
              <h2>Responsible use</h2>
              <p>
                Do not use the website to submit harmful content, impersonate
                someone else or attempt unauthorised access to systems or data.
              </p>
              <h2>Content and changes</h2>
              <p>
                Information may be updated as services change. Contact the team
                to confirm the scope and availability of a service before
                relying on it for a project decision.
              </p>
            </>
          ) : (
            <>
              <h2>Information you provide</h2>
              <p>
                The enquiry form collects your name, email address, optional
                company and phone number, selected service, timeline and project
                description. These details are stored to review and respond to
                your request.
              </p>
              <h2>Technical data</h2>
              <p>
                A short-lived, first-party security cookie protects form
                submissions. The service also uses a request identifier to
                prevent duplicate enquiries and temporary request-rate controls
                to reduce abuse.
              </p>
              <h2>How information is used</h2>
              <p>
                Enquiry details are used to understand your requirements and
                contact you about the project. If email notifications are
                configured, those details are sent to the company’s enquiry
                mailbox through its email provider. The form does not subscribe
                you to marketing.
              </p>
              <h2>Analytics and external services</h2>
              <p>
                With your consent, this website uses Google Analytics to measure
                aggregate page visits and navigation. It does not use advertising
                trackers or session replay. You can decline analytics without
                affecting the website or enquiry form. Website assets and fonts
                are served locally.
              </p>
              <h2>Questions about your information</h2>
              <p>
                Use the <Link to="/contact">contact form</Link> to request
                access, correction or deletion of an enquiry, quoting your
                reference if available. Do not send sensitive documents through
                the form.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
function NotFound() {
  return (
    <section className="section">
      <div className="container empty-state">
        <span className="eyebrow">404 · PAGE NOT FOUND</span>
        <h1>Let’s get you back on track.</h1>
        <p>The page may have moved or the link may be incorrect.</p>
        <Button to="/">Back to Home</Button>
      </div>
    </section>
  );
}
function PageState() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const { title, description } = getMetadata(pathname);
    document.title = `${title} | Samarth Tech Software`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = new URL(pathname, canonical.href).href;
    if (hash) {
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView(),
      );
    } else window.scrollTo(0, 0);
  }, [pathname, hash]);
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const targets = [
      ...document.querySelectorAll(
        ".home-hero, .page-hero, main > .section, main > .cta",
      ),
    ];
    document.documentElement.classList.add("reveal-ready");
    targets.forEach((target, index) => {
      target.classList.add("reveal-section");
      target.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 35, 140)}ms`,
      );
      if (reduceMotion || index < 2) target.classList.add("is-visible");
    });
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6%" },
    );
    targets
      .filter((target) => !target.classList.contains("is-visible"))
      .forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
function AnalyticsConsent() {
  const location = useLocation();
  const [consent, setConsent] = useState(null);
  const measurementId = typeof document === "undefined" ? "" : document.querySelector('meta[name="google-analytics-id"]')?.content || "";
  useEffect(() => setConsent(window.localStorage.getItem("sts_analytics_consent")), []);
  useEffect(() => {
    if (!measurementId || window.stsConsentModeSet) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    window.gtag("config", measurementId, { send_page_view: false });
    const script = document.createElement("script");
    script.id = "google-analytics-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
    window.stsConsentModeSet = true;
  }, [measurementId]);
  useEffect(() => {
    if (consent !== "accepted" || !measurementId) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("event", "page_view", { page_location: window.location.href, page_path: location.pathname, page_title: document.title });
  }, [consent, measurementId, location.pathname]);
  const decide = (value) => { window.localStorage.setItem("sts_analytics_consent", value); setConsent(value); };
  if (!measurementId || consent !== null) return null;
  return <aside className="analytics-consent" aria-label="Analytics cookie choice"><p>We use optional Google Analytics to understand website visits and improve our services. It does not affect your enquiry.</p><div><button type="button" className="text-button" onClick={() => decide("denied")}>No thanks</button><button type="button" className="button" onClick={() => decide("accepted")}>Accept analytics</button></div></aside>;
}
export default function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <PageState />
      <AnalyticsConsent />
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/process" element={<Process />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:slug" element={<Article />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/contact" element={<Consultation />} />
          <Route path="/privacy" element={<Policy />} />
          <Route path="/terms" element={<Policy terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
