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
import { services, stages, projects, articles, faqs } from "./data.js";
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
          <Link
            to="/"
            className="footer-brand"
            aria-label="Samarth Tech Software home"
          >
            <img
              src="/sts-logo.png"
              alt="Samarth Tech Software"
              width="600"
              height="400"
            />
          </Link>
          <p>
            Websites, apps and business software from Nashik, built around
            the way you work.
          </p>
          <address className="footer-address">
            Ashok Nagar, Nashik 422012
            <br />
            Maharashtra, India
          </address>
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
            Have something you’d like to build or fix? Send us a few lines and
            we’ll take it from there.
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
          <span className="eyebrow">LET’S TALK</span>
          <h2>Got a problem you’d like software to solve?</h2>
          <p>
            Tell us what is going on in a few lines. We will read it properly
            and reply with honest next steps.
          </p>
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
              SOFTWARE COMPANY IN NASHIK
            </span>
            <h1>
              Websites, Custom Software and <span>AI Automation</span> for
              Growing Businesses
            </h1>
            <p className="lead">
              We are a software team in Nashik building websites, business
              software, mobile apps and AI tools. Tell us what is slowing your
              business down, and we will build something simple that fixes it,
              then stay around after launch.
            </p>
            <div className="hero-actions">
              <Button />
              <Button to="/services" outline>
                Explore Our Services
              </Button>
            </div>
            <div className="trust-row">
              {[
                "Plain-English updates",
                "Milestones you approve",
                "Your code, your data",
                "Support after launch",
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
            eyebrow="SOUND FAMILIAR?"
            title="The everyday problems we help fix"
            description="Good software starts with a real problem, not a feature list."
          />
          <div className="grid three">
            {[
              [
                "layers",
                "Too many Excel sheets and WhatsApp groups",
                "Information is scattered, copies don’t match and evenings go on reconciling them. We bring it all into one system.",
                "custom-software",
              ],
              [
                "spark",
                "Hours lost to typing and copying",
                "Retyping orders, invoices and enquiries is slow and error-prone. Let automation do the typing while your team checks.",
                "ai-automation",
              ],
              [
                "code",
                "Old software that holds you back",
                "Slow screens, no mobile access and nothing talks to anything else. We modernise or connect it without starting from scratch.",
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
                  See how we help <Icon />
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
              eyebrow="WHAT WE DO"
              title="Websites, software and apps, built in Nashik"
              description="From your first website to the systems that run your day-to-day operations."
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
            eyebrow="HOW A PROJECT RUNS"
            title="No jargon, no surprises"
            description="You always know what happens next, what we need from you and what you get at each step."
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
            eyebrow="THE TOOLS WE USE"
            title="Proven technology, chosen for the long run"
            description="We pick tools that suit your project and that other developers can maintain later. No lock-in."
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
        title="Software, website and app development in Nashik"
        description="Whether you need your first website or a system to run the whole business, we start with what you need now and leave room to grow."
      />
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="ALL SERVICES"
            title="Pick a starting point"
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
            eyebrow="WHO WE WORK WITH"
            title="Sized to fit your business"
          />
          <div className="grid three">
            {[
              [
                "Startups",
                "Get a working first version in front of real users quickly, then improve it with their feedback.",
              ],
              [
                "Small & medium businesses",
                "Replace scattered sheets and manual follow-ups with tools that make the working day easier.",
              ],
              [
                "Manufacturing & retail",
                "Connect orders, stock and reporting so you can see what is happening without chasing people.",
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
function ServiceDetail() {
  const { slug } = useParams();
  const s = services.find((s) => s.slug === slug);
  if (!s) return <NotFound />;
  return (
    <>
      <Hero
        eyebrow={s.name}
        title={`${s.name} in Nashik`}
        description={s.description}
      >
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
            <SectionHeading eyebrow="WHAT YOU GET" title={s.short} />
            <div className="grid two">
              {s.deliverables.map(([t, detail], i) => (
                <article className="card deliverable" key={t}>
                  <span className="step-small">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{t}</h3>
                  <p>{detail}</p>
                </article>
              ))}
            </div>
          </div>
          <aside className="sidebar-card">
            <Icon name={s.icon} />
            <h3>Not sure where to start?</h3>
            <p>
              Tell us what you want to improve and which tools you use today.
              We’ll suggest a sensible first step.
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
          <SectionHeading eyebrow="GOOD QUESTIONS" title="Questions you might have" />
          <FAQ items={faqs} />
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
        title="How we work, from the first call to long after launch"
        description="Six simple stages. At each one you know what we are doing, what we need from you and what you get."
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
            eyebrow="TWO WAYS TO WORK WITH US"
            title="Choose what suits your project"
          />
          <div className="grid two">
            <article className="card">
              <h3>Fixed scope and milestones</h3>
              <p>
                Best when you know what the first version needs to do. We agree
                the deliverables, review points and how changes are handled
                before we start.
              </p>
            </article>
            <article className="card">
              <h3>Build and improve as you go</h3>
              <p>
                Best when your idea will change once users try it. We keep a
                shared priority list and review working features together at
                regular intervals.
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
        title="The technology behind our work"
        description="We choose tools based on your requirements and on who will maintain the system later, not on what is fashionable this year."
      />
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="WHAT WE BUILD WITH"
            title="Reliable, well-supported tools"
          />
          <div className="grid three">
            {[
              [
                "code",
                "Backend & APIs",
                "Laravel, Python and Node.js",
                "The behind-the-scenes logic, integrations and data processing.",
              ],
              [
                "layout",
                "Frontend & experience",
                "React, HTML, CSS and JavaScript",
                "Clean, fast screens that work on phones and desktops alike.",
              ],
              [
                "database",
                "Data & reporting",
                "PostgreSQL, MySQL and SQLite",
                "Well-organised data with backups, access control and reports.",
              ],
              [
                "phone",
                "Mobile applications",
                "React Native and Flutter",
                "One codebase for both Android and iOS apps.",
              ],
              [
                "shield",
                "Deployment & operations",
                "Source control, automation and monitoring",
                "Safe, repeatable releases and monitoring once you are live.",
              ],
              [
                "spark",
                "AI & automation",
                "Python, LLM APIs and workflow tools",
                "AI that helps with specific tasks, with a person checking the results.",
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
            eyebrow="EXAMPLE SET-UPS"
            title="What a typical project might use"
            description="Every project is different. These are starting points for a conversation, not fixed rules."
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
                Each layer has one clear job, which keeps the system easier to
                fix and extend.
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
        title="A Nashik software company that starts by listening"
        description="Samarth Tech Software builds websites, apps and business software around the way your business already works, and stays with you from planning to support."
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
              Every project starts with people: the staff doing the work, the
              customers you serve and the decisions you make every day.
            </p>
            <p>
              We turn that into clear requirements and software your team can
              understand, run and keep improving, without needing us for every
              small change.
            </p>
            <Button to="/process" outline>
              See How We Work
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
            eyebrow="WHAT WE BELIEVE"
            title="A few things we don’t compromise on"
          />
          <div className="grid two">
            {[
              [
                "01",
                "Solve the problem, not the feature list",
                "We start with what is going wrong in your business and agree what ‘better’ looks like.",
              ],
              [
                "02",
                "No black boxes",
                "You see working progress at every milestone and decide on scope changes with us.",
              ],
              [
                "03",
                "Built to last",
                "Well-known technology and proper documentation, so your system is never stuck with one developer.",
              ],
              [
                "04",
                "Safe and easy to use",
                "Permissions, data protection and clear error messages are planned from day one, not added later.",
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
        title="Examples of problems we can solve"
        description="Illustrative examples based on common business problems, showing how we would approach them. They are not client case studies or measured results."
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
          <h2>The problem</h2>
          <p className="lead">{p.challenge}</p>
          <h2>How we would solve it</h2>
          <p>{p.solution}</p>
          <h2>What it would include</h2>
          <ul className="check-list">
            {p.features.map((f) => (
              <li key={f}>
                <Icon name="check" />
                {f}
              </li>
            ))}
          </ul>
          <h2>How we would know it works</h2>
          <p>
            Before building, we would agree a starting point with the team doing
            the work: how long the task takes today and how often mistakes
            happen. After launch, we compare against that, including the effort
            needed to keep the system running.
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
        title="Practical guides for business owners"
        description="Plain-English advice on planning websites, software and AI automation, written to help you ask better questions before you spend money."
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
          {a.minutes} min read <span>·</span> Samarth Tech Software team
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
            <p>Thinking about something similar for your business?</p>
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
        title="Tell us what you’d like to build"
        description="A few lines about your business and the problem you want to solve is enough. We read every enquiry and reply by email."
      />
      <section className="section">
        <div className="container consultation-grid">
          <aside>
            <span className="eyebrow">WHAT HAPPENS NEXT</span>
            <h2>Simple, and no pressure.</h2>
            {[
              [
                "01",
                "We read your message properly",
                "We look at your goals, the tools you use today and the kind of help you need.",
              ],
              [
                "02",
                "We talk it through",
                "A short call to understand the details, what needs to connect to what and the best place to start.",
              ],
              [
                "03",
                "You get honest next steps",
                "A clear proposal, a suggestion to start smaller, or an honest answer if we are not the right fit.",
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
            eyebrow="QUICK ANSWERS"
            title="Before you get in touch"
          />
          <FAQ items={faqs} />
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
