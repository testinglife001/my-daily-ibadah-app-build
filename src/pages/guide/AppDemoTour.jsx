import React from "react";
import { Link } from "react-router-dom";
import "./AppDemoTour.css";

const tourSteps = [
  {
    title: "Step 1 — Start at Main Home",
    route: "/",
    description: "Use the home sections to discover content, trends, and the most important modules quickly.",
    checklist: ["Scan featured + trending", "Open Playbook", "Use search/category filters"],
  },
  {
    title: "Step 2 — Publish Content (Admin)",
    route: "/add-blog-post",
    description: "Create a complete blog post with media, tags, metadata, and preview before publish.",
    checklist: ["Add title/description", "Upload media", "Set category + tags", "Publish"],
  },
  {
    title: "Step 3 — Capture Knowledge",
    route: "/apps/notes",
    description: "Store ideas and reusable knowledge in structured notes and share with team/users.",
    checklist: ["Create note", "Assign category", "Share/public note"],
  },
  {
    title: "Step 4 — Plan Execution",
    route: "/apps/todosapp",
    description: "Convert goals to todo tasks, group by category/project, and execute by today/week views.",
    checklist: ["Create category", "Create project", "Add todos", "Track completion"],
  },
  {
    title: "Step 5 — Monitor Delivery",
    route: "/apps/taskboard",
    description: "Track assignments by stage and quickly detect blocked or overdue work.",
    checklist: ["Review stats", "Filter by stage", "Update status"],
  },
  {
    title: "Step 6 — Share Resources",
    route: "/upload-pdf",
    description: "Upload guides/pdfs to build a reusable knowledge/resource center for users.",
    checklist: ["Upload PDF", "Verify viewer", "Share route"],
  },
];

export default function AppDemoTour() {
  return (
    <div className="tour-page container py-4">
      <header className="tour-header mb-4">
        <p className="tour-chip">Guided Demo Tour</p>
        <h1>Use the Full Webapp Without Mixing Things Up</h1>
        <p>
          Follow this route-by-route flow to get the best value from every app module in one consistent
          working pattern.
        </p>
      </header>

      <section className="row g-3">
        {tourSteps.map((step, index) => (
          <div className="col-lg-6" key={step.title}>
            <article className="tour-card h-100">
              <div className="d-flex align-items-center justify-content-between gap-2">
                <h2>{index + 1}. {step.title}</h2>
                <Link to={step.route} className="btn btn-sm btn-outline-primary">Open</Link>
              </div>
              <p className="tour-route">Route: {step.route}</p>
              <p>{step.description}</p>
              <ul>
                {step.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        ))}
      </section>

      <section className="tour-footer mt-4">
        <article className="tour-card">
          <h2>Fast Navigation</h2>
          <div className="d-flex flex-wrap gap-2">
            <Link className="btn btn-primary btn-sm" to="/playbook">Open Playbook</Link>
            <Link className="btn btn-outline-primary btn-sm" to="/dashboard/admin">Open Admin</Link>
            <Link className="btn btn-outline-secondary btn-sm" to="/all-blogs">Open Blogs</Link>
            <Link className="btn btn-outline-secondary btn-sm" to="/">Main Home</Link>
          </div>
        </article>
      </section>
    </div>
  );
}
