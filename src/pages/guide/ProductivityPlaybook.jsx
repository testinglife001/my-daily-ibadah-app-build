import React from "react";
import { Link } from "react-router-dom";
import { adminDemoScenario, appUsageTracks } from "../../data/adminDemoExamples";
import "./ProductivityPlaybook.css";

export default function ProductivityPlaybook() {
  return (
    <div className="playbook-page container py-4">
      <header className="playbook-hero mb-4">
        <p className="playbook-badge">Easy-Use Master Plan</p>
        <h1>How to Use This Webapp Without Getting Overwhelmed</h1>
        <p>
          Use this as your single source of truth for onboarding, demoing features, and showcasing
          portfolio-ready outcomes to employers and clients.
        </p>
      </header>

      <section className="mb-4">
        <h2>1) Simple way to use the platform</h2>
        <div className="row g-3">
          <div className="col-md-4">
            <article className="plan-card h-100">
              <h3>Phase A: Publish</h3>
              <p>Use Blog + AI + Banner tools to create your weekly content assets first.</p>
            </article>
          </div>
          <div className="col-md-4">
            <article className="plan-card h-100">
              <h3>Phase B: Organize</h3>
              <p>Move key ideas to Notes and convert actions into Todos + Taskboard tickets.</p>
            </article>
          </div>
          <div className="col-md-4">
            <article className="plan-card h-100">
              <h3>Phase C: Scale</h3>
              <p>Upload PDFs/checklists for repeat onboarding and team handoff.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mb-4">
        <h2>2) App-by-app demo examples (Admin)</h2>
        <div className="row g-3">
          {appUsageTracks.map((track) => (
            <div className="col-lg-6" key={track.id}>
              <article className="demo-card h-100">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <h3>{track.title}</h3>
                  <Link to={track.route} className="open-link">
                    Open
                  </Link>
                </div>
                <p className="goal"><strong>Goal:</strong> {track.goal}</p>
                <ul>
                  {track.workflow.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
                <p className="portfolio"><strong>Portfolio value:</strong> {track.portfolioWin}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-4">
        <h2>3) One-day admin walkthrough demo</h2>
        <article className="plan-card">
          <p>
            <strong>Profile:</strong> {adminDemoScenario.profile.displayName} ({adminDemoScenario.profile.role})
          </p>
          <p>
            <strong>Objective:</strong> {adminDemoScenario.profile.objective}
          </p>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>Apps</th>
                  <th>Output</th>
                </tr>
              </thead>
              <tbody>
                {adminDemoScenario.timeline.map((item) => (
                  <tr key={item.time}>
                    <td>{item.time}</td>
                    <td>{item.action}</td>
                    <td>{item.apps.join(", ")}</td>
                    <td>{item.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section>
        <h2>4) Portfolio positioning tips</h2>
        <article className="plan-card">
          <ul className="mb-2">
            <li>Demo end-to-end workflow: idea → content → planning → team execution.</li>
            <li>Show role-based flows (admin creation + user consumption).</li>
            <li>Use screenshots/video clips from each app area to present real product depth.</li>
            <li>Highlight Firebase integration: auth, data, media, and real-time updates.</li>
          </ul>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/" className="btn btn-primary btn-sm">Back to Main Home</Link>
            <Link to="/dashboard/admin" className="btn btn-outline-primary btn-sm">Open Admin</Link>
            <Link to="/all-blogs" className="btn btn-outline-secondary btn-sm">Open Blogs</Link>
          </div>
        </article>
      </section>
    </div>
  );
}
