import React from "react";
import { Link } from "react-router-dom";
import "./RoutePreviewPlan.css";

const plannedRoutes = [
  {
    title: "Main Home",
    path: "/",
    status: "Enhanced",
    description: "Video-first landing with responsive sections and faster content discovery.",
  },
  {
    title: "Home News",
    path: "/home-news",
    status: "Refresh Planned",
    description: "Cleaner headline hierarchy and easier scrolling for mobile readers.",
  },
  {
    title: "All Blog Posts",
    path: "/blog-posts",
    status: "Improvement Planned",
    description: "Smarter filters, stronger empty-state UX, and consistent cards/list behavior.",
  },
  {
    title: "Notes App",
    path: "/apps/notes",
    status: "Refinement Planned",
    description: "Faster note finding, better toolbar density, and touch-friendly controls.",
  },
  {
    title: "Todos App",
    path: "/apps/todosapp",
    status: "Refinement Planned",
    description: "Simplified task capture, better date views, and cleaner project navigation.",
  },
  {
    title: "App Tour",
    path: "/app-tour",
    status: "New",
    description: "Guided full-webapp route tour with actionable checklists.",
  },
  {
    title: "Playbook",
    path: "/playbook",
    status: "New",
    description: "Single-page onboarding guide with admin demo scenarios and portfolio tips.",
  },
  {
    title: "Task Board",
    path: "/apps/taskboard",
    status: "Refinement Planned",
    description: "More visual status tracking and improved workload summaries.",
  },
];

export default function RoutePreviewPlan() {
  return (
    <section className="route-preview-wrapper">
      <div className="route-preview-heading">
        <p className="route-preview-kicker">Landing/UI Plan Preview</p>
        <h2>Planned Page & Route Experience</h2>
        <p>
          These route cards preview the next UI direction: clearer information hierarchy, faster actions,
          and stronger mobile responsiveness.
        </p>
      </div>

      <div className="route-preview-grid">
        {plannedRoutes.map((route) => (
          <article key={route.path} className="route-preview-card">
            <span className="route-status">{route.status}</span>
            <h3>{route.title}</h3>
            <p className="route-path">{route.path}</p>
            <p>{route.description}</p>
            <Link to={route.path} className="route-preview-link">
              Open route
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
