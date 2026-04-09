export const appUsageTracks = [
  {
    id: "blog-cms",
    title: "Blog & Content Publishing",
    route: "/add-blog-post",
    goal: "Publish expert content consistently and repurpose it across formats.",
    workflow: [
      "Create a post with title, category/subcategory, tags, hashtags, and segment metadata.",
      "Upload multiple images, mark a primary image, then add optional audio/video.",
      "Use preview mode before publishing and confirm metadata in All Blog Posts.",
    ],
    portfolioWin: "Shows CMS thinking, editorial workflow, metadata strategy, and media publishing.",
  },
  {
    id: "notes-knowledge",
    title: "Notes Knowledge Base",
    route: "/apps/notes",
    goal: "Capture ideas, share reusable notes, and build a categorized knowledge hub.",
    workflow: [
      "Create personal notes by category type and rich blocks (headers, lists, embeds, images).",
      "Share notes with other users or publish public notes.",
      "Filter by own/shared/public to quickly retrieve information.",
    ],
    portfolioWin: "Demonstrates collaboration workflows and structured knowledge management.",
  },
  {
    id: "todos-execution",
    title: "Todos & Execution",
    route: "/apps/todosapp",
    goal: "Turn plans into tasks with project/category organization.",
    workflow: [
      "Create categories and projects for work streams.",
      "Add todos with due dates and move between today/week/project views.",
      "Track progress from quick-add and modal editors.",
    ],
    portfolioWin: "Shows practical productivity UX with filtering and operational control.",
  },
  {
    id: "taskboard-team",
    title: "Team Task Board",
    route: "/apps/taskboard",
    goal: "Manage assigned tasks and stage-based execution.",
    workflow: [
      "Assign tasks from admin flows and maintain stage (todo/in progress/completed).",
      "Review user-level dashboard metrics and task table summaries.",
      "Use stage filters to focus on pending blockers.",
    ],
    portfolioWin: "Highlights role-based collaboration and dashboard reporting.",
  },
  {
    id: "pdf-library",
    title: "PDF Library",
    route: "/upload-pdf",
    goal: "Build a searchable document library for guides or resources.",
    workflow: [
      "Upload PDF with title and store in Firebase Storage + Firestore metadata.",
      "Open viewer route and share knowledge material with users.",
      "Use for ebooks, policies, onboarding docs, or learning packs.",
    ],
    portfolioWin: "Demonstrates file workflow and content distribution patterns.",
  },
  {
    id: "creative-tools",
    title: "Creative Tools (AI Drafts + Banner Editor)",
    route: "/dashboard/post-creator",
    goal: "Speed up social content production and campaign design.",
    workflow: [
      "Generate caption drafts from topic ideas and save to ai-posts.",
      "Use Banner Editor to produce shareable visual creatives.",
      "Publish final outputs through your blog + social channels.",
    ],
    portfolioWin: "Shows end-to-end content pipeline from idea to visual distribution.",
  },
];

export const adminDemoScenario = {
  profile: {
    role: "admin",
    displayName: "Portfolio Admin",
    objective: "Run a complete 1-day content and productivity demonstration.",
  },
  timeline: [
    {
      time: "09:00",
      action: "Publish blog post: '5 Productivity Habits for Developers'.",
      apps: ["Blog CMS", "AI Drafts"],
      output: "One long-form article + 2 social captions + 1 banner visual.",
    },
    {
      time: "10:30",
      action: "Capture meeting learnings in Notes and share to team.",
      apps: ["Notes"],
      output: "Public summary note + 3 private action notes.",
    },
    {
      time: "12:00",
      action: "Break tasks into category/project-based todos.",
      apps: ["Todos"],
      output: "Prioritized today/week task list.",
    },
    {
      time: "14:00",
      action: "Assign tasks and monitor progress in Task Board.",
      apps: ["Task Board"],
      output: "Clear stage view across todo/in-progress/completed.",
    },
    {
      time: "16:00",
      action: "Upload PDF playbook for user onboarding.",
      apps: ["PDF Library"],
      output: "One accessible onboarding resource for all users.",
    },
  ],
};
