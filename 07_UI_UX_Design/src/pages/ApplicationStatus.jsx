
import { useMemo } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getApplicationsForUser } from "../utils/localStore.js";

function ApplicationStatus() {
  const { user } = useAuth();

  const applications = useMemo(
    () => (user ? getApplicationsForUser(user.id) : []),
    [user]
  );

  const statusCounts = useMemo(() => {
    return {
      total: applications.length,
      submitted: applications.filter(
        (app) => String(app.status).toLowerCase() === "submitted"
      ).length,
      approved: applications.filter(
        (app) => String(app.status).toLowerCase() === "approved"
      ).length,
      rejected: applications.filter(
        (app) => String(app.status).toLowerCase() === "rejected"
      ).length,
    };
  }, [applications]);

  function getStatusClass(status) {
    const normalizedStatus = String(status).toLowerCase();

    if (normalizedStatus === "approved") return "application-approved";
    if (normalizedStatus === "rejected") return "application-rejected";

    return "application-submitted";
  }

  return (
    <>
      <PageHeader
        title="My Applications"
        subtitle="Track and review your crop storage applications."
      />

      <div className="container section my-applications-page">
        <div className="application-welcome">
          <div>
            <span className="storage-eyebrow">APPLICATION CENTRE</span>
            <h2>Your Storage Requests</h2>
            <p>Keep track of all your submitted storage applications.</p>
          </div>
          <div className="application-welcome-icon">📋</div>
        </div>

        <div className="application-summary-grid">
          <div className="application-summary-card">
            <span>📁</span>
            <small>Total Applications</small>
            <strong>{statusCounts.total}</strong>
          </div>

          <div className="application-summary-card">
            <span>⏳</span>
            <small>Submitted</small>
            <strong>{statusCounts.submitted}</strong>
          </div>

          <div className="application-summary-card">
            <span>✅</span>
            <small>Approved</small>
            <strong>{statusCounts.approved}</strong>
          </div>

          <div className="application-summary-card">
            <span>❌</span>
            <small>Rejected</small>
            <strong>{statusCounts.rejected}</strong>
          </div>
        </div>

        <div className="application-list-heading">
          <div>
            <h2>Application History</h2>
            <p>
              {applications.length}{" "}
              {applications.length === 1 ? "application" : "applications"} found
            </p>
          </div>

          <Link to="/storages" className="btn btn-primary">
            + Find Storage
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="application-empty-state">
            <div className="application-empty-icon">📂</div>
            <h3>No Applications Yet</h3>
            <p>
              You have not submitted any crop storage applications.
              Explore storage facilities and submit your first request.
            </p>
            <Link to="/storages" className="btn btn-primary">
              Explore Cold Storages →
            </Link>
          </div>
        ) : (
          <div className="application-list">
            {applications.map((app) => (
              <article className="modern-application-card" key={app.id}>
                <div className="application-card-heading">
                  <div className="application-storage-icon">🏬</div>

                  <div className="application-storage-title">
                    <h3>{app.storageName}</h3>
                    <span>Application ID: {app.id}</span>
                  </div>

                  <span
                    className={`modern-status-badge ${getStatusClass(
                      app.status
                    )}`}
                  >
                    {app.status || "Submitted"}
                  </span>
                </div>

                <div className="application-details-grid">
                  <div className="application-detail-item">
                    <span>🌾 Crop</span>
                    <strong>{app.crop}</strong>
                  </div>

                  <div className="application-detail-item">
                    <span>📦 Quantity</span>
                    <strong>{app.quantityQuintals} Quintals</strong>
                  </div>

                  <div className="application-detail-item">
                    <span>🗓️ Duration</span>
                    <strong>{app.durationMonths} Months</strong>
                  </div>

                  <div className="application-detail-item application-cost-item">
                    <span>💰 Estimated Cost</span>
                    <strong>
                      ₹{Number(app.estimatedCost).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="application-card-footer">
                  <span>
                    <span className="application-date-icon">🕒</span>
                    Submitted on: {app.submittedOn}
                  </span>
                  <span className="application-record-label">
                    Application Record
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="application-demo-disclaimer">
          <span>ℹ️</span>
          <p>
            Demo platform: application records are stored in this browser.
            These statuses do not represent real government or cold-storage
            approval decisions.
          </p>
        </div>
      </div>
    </>
  );
}

export default ApplicationStatus;
