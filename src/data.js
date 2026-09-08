export const services = [
  {
    slug: "custom-software",
    name: "Custom Software Development",
    short: "Software that fits the way you work.",
    category: "Software & Systems",
    icon: "layers",
    description:
      "Replace fragmented tools with a connected business system. We design and build software around your workflows, users and operational goals.",
    deliverables: [
      "Workflow discovery and system architecture",
      "Business portals and role-based access",
      "Database design and reporting dashboards",
      "Integration with existing tools and APIs",
      "Testing, deployment and handover",
      "Ongoing maintenance planning",
    ],
    stack: ["Laravel", "Python", "PostgreSQL", "React"],
  },
  {
    slug: "website-development",
    name: "Website Development & Design",
    short: "A better first impression. A clearer path to enquiry.",
    category: "Web & Applications",
    icon: "globe",
    description:
      "Build a responsive business website that communicates your offering clearly and makes it easy for customers to take the next step.",
    deliverables: [
      "Content structure and page planning",
      "Responsive interface design",
      "Reusable website components",
      "Accessible forms and navigation",
      "Search metadata and performance optimisation",
      "Content editing and team handover",
    ],
    stack: ["React", "HTML & CSS", "WordPress", "Node.js"],
  },
  {
    slug: "web-applications",
    name: "Web Application Development",
    short: "Turn complex operations into intuitive workflows.",
    category: "Web & Applications",
    icon: "code",
    description:
      "Bring your product or internal platform to the browser with a focused user experience and a maintainable foundation.",
    deliverables: [
      "Product discovery and MVP scope",
      "User roles and authentication",
      "Interactive dashboards and workflows",
      "API design and integration",
      "Automated checks and release planning",
      "Operational monitoring and support",
    ],
    stack: ["React", "Node.js", "Laravel", "PostgreSQL"],
  },
  {
    slug: "mobile-applications",
    name: "Mobile Application Development",
    short: "Useful experiences wherever work happens.",
    category: "Mobile Solutions",
    icon: "phone",
    description:
      "Give your customers and field teams access to the tools they need on mobile, with journeys designed around real-world use.",
    deliverables: [
      "Mobile user journeys and prototypes",
      "Cross-platform application development",
      "Backend and device integrations",
      "Offline behaviour where required",
      "Device testing and release preparation",
      "Maintenance and iteration planning",
    ],
    stack: ["React Native", "Flutter", "REST APIs", "SQLite"],
  },
  {
    slug: "wordpress",
    name: "WordPress Development",
    short: "A flexible website your team can manage.",
    category: "Web & Applications",
    icon: "layout",
    description:
      "Create a business website with thoughtful design and straightforward content management, without making every update a development task.",
    deliverables: [
      "Custom themes and reusable blocks",
      "Content management configuration",
      "Plugin and integration assessment",
      "Responsive layouts and accessible navigation",
      "Performance and security configuration",
      "Editor training and maintenance planning",
    ],
    stack: ["WordPress", "PHP", "MySQL", "JavaScript"],
  },
  {
    slug: "ai-automation",
    name: "AI Automation & Support Systems",
    short: "Less repetitive work. More room for your team.",
    category: "AI Automation",
    icon: "spark",
    description:
      "Connect AI to practical business workflows with clear boundaries, human review and useful measures of success.",
    deliverables: [
      "Automation opportunity assessment",
      "Document and information processing",
      "Workflow and application integrations",
      "Knowledge-assisted support tools",
      "Human review and escalation paths",
      "Evaluation, monitoring and refinement",
    ],
    stack: ["Python", "LLM APIs", "PostgreSQL", "Workflow tools"],
  },
];
export const stages = [
  [
    "Discovery & Feasibility",
    "Understand the work before building the system.",
    "We map your users, current workflows, constraints and success measures. Together we separate the essential first release from later improvements.",
    "Agreed scope, priorities and feasibility notes",
  ],
  [
    "Architecture & Design",
    "Make the solution tangible.",
    "We create user flows, interface designs and a technical plan. You review the approach before it becomes application code.",
    "Approved designs and architecture plan",
  ],
  [
    "Development",
    "Build in visible, reviewable stages.",
    "We implement focused milestones and demonstrate progress. Feedback informs the next stage while agreed scope changes remain visible.",
    "Working features and milestone demonstrations",
  ],
  [
    "Testing & Quality",
    "Check the journeys that matter.",
    "We test core workflows, integrations, access controls and responsive behaviour. Issues are recorded, prioritised and resolved before release.",
    "Test results and release readiness review",
  ],
  [
    "Launch & Handover",
    "Move into production with a plan.",
    "We prepare deployment, configuration, monitoring and rollback steps, then guide your team through the completed system.",
    "Production release, source code and documentation",
  ],
  [
    "Support & Improvement",
    "Keep the system useful as your business grows.",
    "We agree a maintenance approach and use real feedback to plan improvements, updates and the next release.",
    "Support plan and prioritised improvement backlog",
  ],
];
export const projects = [
  {
    slug: "order-automation",
    category: "AI Automation",
    title: "From incoming orders to a connected workflow",
    industry: "Manufacturing & Distribution",
    icon: "spark",
    challenge:
      "Orders arrive in different formats and require repeated manual entry before fulfilment.",
    solution:
      "Extract order details, validate product references, route exceptions to a team member and pass approved orders into the business system.",
    features: [
      "Document processing",
      "Human review queue",
      "Order system integration",
    ],
    stack: ["Python", "React", "PostgreSQL"],
  },
  {
    slug: "business-portal",
    category: "Custom Software",
    title: "One workspace for customers and operations",
    industry: "Business Services",
    icon: "layers",
    challenge:
      "Teams and customers depend on email threads to track requests, approvals and delivery status.",
    solution:
      "A role-based portal brings request intake, documents, approvals and status updates into a shared view.",
    features: ["Customer portal", "Role-based access", "Status reporting"],
    stack: ["Laravel", "React", "MySQL"],
  },
  {
    slug: "inventory-platform",
    category: "Web Applications",
    title: "A clearer view of stock across locations",
    industry: "Retail & Logistics",
    icon: "code",
    challenge:
      "Separate stock records make transfers and replenishment difficult to coordinate.",
    solution:
      "Connect inventory events to a central dashboard, with movement history, transfer approvals and exception reporting.",
    features: ["Inventory dashboard", "Transfer workflows", "Audit history"],
    stack: ["Node.js", "React", "PostgreSQL"],
  },
  {
    slug: "field-operations",
    category: "Mobile Solutions",
    title: "Field work that keeps moving offline",
    industry: "Field Services",
    icon: "phone",
    challenge:
      "Field teams need to record job details in locations with intermittent connectivity.",
    solution:
      "A mobile workflow captures tasks and notes locally, then reconciles changes with the central system when a connection returns.",
    features: ["Offline task capture", "Sync status", "Supervisor dashboard"],
    stack: ["React Native", "SQLite", "REST APIs"],
  },
];
export const articles = [
  {
    slug: "scope-your-software-project",
    category: "Project Planning",
    title: "How to scope a custom software project",
    intro:
      "A useful first release starts with a clear description of the work it needs to improve.",
    minutes: 4,
    sections: [
      [
        "Start with a workflow",
        "Describe a real task from start to finish. Identify who performs it, the information they need, where they wait and how they know the work is complete. A workflow is a more useful starting point than a long list of screens.",
      ],
      [
        "Define the first useful release",
        "Separate essential capabilities from improvements that can wait. Choose a complete, valuable journey for the first release, including its less visible needs such as permissions, errors and reporting.",
      ],
      [
        "Agree how success will be checked",
        "Use observable acceptance criteria. For example, an authorised team member should be able to review a request, approve it and see the resulting status without entering the same information twice.",
      ],
      [
        "Identify dependencies early",
        "List integrations, data sources, decision makers and content owners. These dependencies affect delivery as much as the development work itself.",
      ],
    ],
  },
  {
    slug: "practical-ai-automation",
    category: "Practical AI",
    title: "Choose an AI workflow with a useful human checkpoint",
    intro:
      "The best starting point is a repetitive task with clear inputs, reviewable outputs and a manageable cost of error.",
    minutes: 5,
    sections: [
      [
        "Choose a bounded task",
        "Start with one repeatable activity, such as extracting fields from an incoming document. Avoid giving an initial automation broad authority over unrelated business actions.",
      ],
      [
        "Make uncertainty visible",
        "An automated result should retain enough context for review. Let a person compare the extracted result with its source and handle missing or conflicting information.",
      ],
      [
        "Separate suggestions from actions",
        "Keep consequential actions behind explicit approval until the workflow has been evaluated. Model output should not automatically become an instruction to transfer money, change access or delete records.",
      ],
      [
        "Evaluate with representative examples",
        "Use examples from the actual workflow, including difficult inputs. Measure correct results, manual corrections, time spent reviewing and failed runs before expanding scope.",
      ],
    ],
  },
  {
    slug: "replace-spreadsheets",
    category: "Business Systems",
    title: "When your spreadsheet needs a business application",
    intro:
      "Look for coordination problems before deciding that a spreadsheet needs to be replaced.",
    minutes: 4,
    sections: [
      [
        "Recognise the friction",
        "Multiple copies, unclear ownership and repeated reconciliation are signs that the process needs a shared system. The number of rows alone is not a sufficient reason to rebuild.",
      ],
      [
        "Preserve what already works",
        "Observe how people use the existing sheet. Capture useful calculations, shortcuts and reports before redesigning the workflow.",
      ],
      [
        "Plan access and history",
        "An application should make it clear who can view, edit and approve information. Record meaningful changes so the team can understand how a record reached its current state.",
      ],
      [
        "Migrate in stages",
        "Clean and map the source data, test an import and reconcile a sample with the original. Agree when the old workflow stops accepting updates to avoid two competing records.",
      ],
    ],
  },
  {
    slug: "website-launch-checklist",
    category: "Web Development",
    title: "A practical checklist before your business website launches",
    intro:
      "A launch review should cover the customer journey, not just the appearance of each page.",
    minutes: 4,
    sections: [
      [
        "Walk through every enquiry path",
        "Try the primary call to action on a phone and a desktop. Submit valid and invalid form data and check that the team receives or can retrieve accepted enquiries.",
      ],
      [
        "Check content and navigation",
        "Remove placeholders and verify company details, links and claims. Make sure someone arriving on a service page can understand the company and find a next step.",
      ],
      [
        "Review accessible interaction",
        "Use the keyboard through the navigation and forms. Confirm that focus is visible, fields have labels and errors explain how to recover.",
      ],
      [
        "Prepare operations",
        "Assign responsibility for domain renewal, hosting, backups and updates. Keep deployment and rollback instructions with the project so the website can be maintained after handover.",
      ],
    ],
  },
  {
    slug: "plan-system-integration",
    category: "Business Systems",
    title: "Questions to ask before connecting two business systems",
    intro:
      "A reliable integration needs agreement about data ownership, failures and recovery.",
    minutes: 4,
    sections: [
      [
        "Name the source of truth",
        "For each important field, decide which system owns the value and which systems receive a copy. Conflicting ownership creates difficult reconciliation problems.",
      ],
      [
        "Describe failure behaviour",
        "Plan for unavailable services, expired credentials and rejected records. A failed request should be visible and retryable without duplicating a business action.",
      ],
      [
        "Agree the exchange contract",
        "Document field formats, required values and identifiers. Test with realistic examples and define how changes to either system will be managed.",
      ],
      [
        "Make operations observable",
        "Keep a useful record of transfers and errors without exposing sensitive information. Give the responsible team a clear way to identify and resolve an exception.",
      ],
    ],
  },
  {
    slug: "mobile-offline-workflows",
    category: "Web Development",
    title: "Designing mobile workflows for intermittent connectivity",
    intro:
      "Offline support is a product decision about what a user can safely do without a connection.",
    minutes: 4,
    sections: [
      [
        "Choose the offline actions",
        "Identify tasks that must continue without a network and the information needed to complete them. Download only the data required by the authorised user.",
      ],
      [
        "Make state understandable",
        "Show whether a change is saved locally, waiting to sync or confirmed by the server. Avoid implying that an unsubmitted action is already available to the wider team.",
      ],
      [
        "Plan conflicting edits",
        "Decide how to handle two people updating the same record. Some fields can merge, while others need a person to choose the intended result.",
      ],
      [
        "Test the interruptions",
        "Test lost connections, app restarts and repeated retries. Make sure local work survives and that synchronisation does not create duplicate operations.",
      ],
    ],
  },
];
