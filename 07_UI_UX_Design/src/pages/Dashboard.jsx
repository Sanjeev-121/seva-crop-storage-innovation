
import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getApplicationsForUser,
  resetDemoData,
} from "../utils/localStore.js";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const applications = useMemo(
    () => (user ? getApplicationsForUser(user.id) : []),
    [user]
  );

  const totalApplications = applications.length;

  const submittedApplications = applications.filter(
    (app) => app.status === "Submitted"
  ).length;

  const approvedApplications = applications.filter(
    (app) => app.status === "Approved"
  ).length;

  const recentApplications = applications.slice(0, 5);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleResetDemoData() {
    const confirmed = window.confirm(
      "Are you sure? This will permanently clear all demo registrations and applications from this browser."
    );

    if (!confirmed) return;

    resetDemoData();
    logout();
    navigate("/login");
  }

  return (
    <>
      <PageHeader
        title="Farmer Dashboard"
        subtitle={`Welcome back, ${user?.fullName || "Farmer"}!`}
      />

      <div className="container section dashboard-page">

        {/* Farmer Profile */}
        <section className="dashboard-profile card">
          <div className="profile-heading">
            <div className="profile-avatar">👨‍🌾</div>
            <div>
              <span className="profile-label">FARMER PROFILE</span>
              <h2>{user?.fullName || "Farmer"}</h2>
              <p>Your personal farming information</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-item">
              <span>📱 Mobile Number</span>
              <strong>{user?.phone || "Not available"}</strong>
            </div>

            <div className="profile-item">
              <span>📍 Village</span>
              <strong>{user?.village || "Not available"}</strong>
            </div>

            <div className="profile-item">
              <span>🏡 District</span>
              <strong>{user?.district || "Not available"}</strong>
            </div>

            <div className="profile-item">
              <span>🌱 Land Area</span>
              <strong>{user?.landAcres ?? "Not available"} Acres</strong>
            </div>

            <div className="profile-item">
              <span>🌾 Main Crop</span>
              <strong>{user?.mainCrop || "Not available"}</strong>
            </div>
          </div>
        </section>

        {/* Application Overview */}
        <section className="dashboard-overview">
          <div className="dashboard-section-title">
            <div>
              <span className="profile-label">YOUR ACTIVITY</span>
              <h2>Application Overview</h2>
              <p>Track your storage applications at a glance.</p>
            </div>
          </div>

          <div className="dashboard-stats">
            <div className="dashboard-stat-card stat-total">
              <div className="stat-icon">📋</div>
              <span>Total Applications</span>
              <h2>{totalApplications}</h2>
              <p>All your applications</p>
            </div>

            <div className="dashboard-stat-card stat-submitted">
              <div className="stat-icon">⏳</div>
              <span>Submitted</span>
              <h2>{submittedApplications}</h2>
              <p>Waiting for review</p>
            </div>

            <div className="dashboard-stat-card stat-approved">
              <div className="stat-icon">✅</div>
              <span>Approved</span>
              <h2>{approvedApplications}</h2>
              <p>Successfully approved</p>
            </div>
          </div>
        </section>

        {/* Recent Applications */}
        <section className="dashboard-recent card">
          <div className="recent-heading">
            <div>
              <span className="profile-label">APPLICATION HISTORY</span>
              <h2>Recent Applications</h2>
            </div>

            <Link to="/applications" className="recent-view-link">
              View All →
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="dashboard-empty">
              <div>📂</div>
              <h3>No Applications Yet</h3>
              <p>
                You have not submitted any storage applications.
                Find a suitable storage facility to get started.
              </p>
              <Link to="/storages" className="btn btn-primary">
                Find Storage
              </Link>
            </div>
          ) : (
            <div className="recent-list">
              {recentApplications.map((app) => (
                <div className="recent-application" key={app.id}>
                  <div className="recent-app-icon">🌾</div>

                  <div className="recent-app-info">
                    <h3>{app.storageName}</h3>
                    <p>{app.crop} · {app.submittedOn}</p>
                    <small>Application ID: {app.id}</small>
                  </div>

                  <span
                    className={`application-status ${
                      app.status === "Approved"
                        ? "status-approved"
                        : app.status === "Rejected"
                        ? "status-rejected"
                        : "status-submitted"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="dashboard-actions">
          <h2>Quick Actions</h2>
          <p>Manage your farming activities easily.</p>

          <div className="dashboard-action-grid">
            <Link to="/storages" className="dashboard-action-card">
              <span>🏬</span>
              <strong>Find Storage</strong>
              <small>Explore available facilities →</small>
            </Link>

            <Link to="/schemes" className="dashboard-action-card">
              <span>🏛️</span>
              <strong>Government Schemes</strong>
              <small>Explore farmer assistance →</small>
            </Link>

            <Link to="/applications" className="dashboard-action-card">
              <span>📄</span>
              <strong>My Applications</strong>
              <small>Track your applications →</small>
            </Link>
          </div>
        </section>

        {/* Account Actions */}
        <section className="dashboard-account-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleLogout}
          >
            Logout
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={handleResetDemoData}
          >
            Reset Demo Data
          </button>
        </section>

      </div>
    </>
  );
}

export default Dashboard;
