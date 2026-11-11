
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { getStorageById, CROP_OPTIONS } from "../data/sampleStorages.js";
import { useAuth } from "../context/AuthContext.jsx";
import { createApplication } from "../utils/localStore.js";

function StorageDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const storage = getStorageById(id);

  const [formData, setFormData] = useState({
    crop: "",
    quantityQuintals: "",
    durationMonths: "1",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const estimatedCost =
    Number(formData.quantityQuintals) *
    Number(formData.durationMonths) *
    (storage?.chargePerQuintalPerMonth || 0);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      navigate("/login");
      return;
    }

    const quantity = Number(formData.quantityQuintals);
    const months = Number(formData.durationMonths);

    if (!formData.crop) {
      setError("Please select a crop.");
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Enter a valid quantity.");
      return;
    }

    if (!Number.isInteger(months) || months <= 0 || months > 12) {
      setError("Enter a valid duration between 1 and 12 months.");
      return;
    }

    if (quantity > storage.availableQuintals) {
      setError(`Only ${storage.availableQuintals} quintals are available.`);
      return;
    }

    if (!storage.crops.includes(formData.crop)) {
      setError("This storage does not support the selected crop.");
      return;
    }

    const result = createApplication(user.id, formData, storage);

    if (!result.ok) {
      setError(result.error || "Application submission failed.");
      return;
    }

    setSuccess("Application submitted successfully!");

    setFormData({
      crop: "",
      quantityQuintals: "",
      durationMonths: "1",
    });
  }

  if (!storage) {
    return (
      <>
        <PageHeader
          title="Storage Not Found"
          subtitle="The requested storage facility does not exist."
        />

        <div className="container section storage-not-found">
          <div className="storage-not-found-icon">🔍</div>
          <h2>Storage Facility Not Found</h2>
          <p>Please return to the storage listing and select another facility.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/storages")}
          >
            ← Back to Storages
          </button>
        </div>
      </>
    );
  }

  const isAvailable = storage.availableQuintals > 0;

  const capacityPercentage =
    storage.totalCapacityQuintals > 0
      ? Math.min(
          100,
          Math.max(
            0,
            ((storage.totalCapacityQuintals - storage.availableQuintals) /
              storage.totalCapacityQuintals) *
              100
          )
        )
      : 0;

  return (
    <>
      <PageHeader
        title={storage.name}
        subtitle={`${storage.village}, ${storage.district}`}
      />

      <div className="container section storage-details-page">
        <div className="storage-details-top">
          <div>
            <span className="storage-eyebrow">STORAGE FACILITY DETAILS</span>
            <h2>{storage.name}</h2>
            <p className="storage-details-location">
              📍 {storage.village}, {storage.district}
            </p>
          </div>

          <span
            className={`storage-availability ${
              isAvailable ? "is-available" : "is-full"
            }`}
          >
            <span className="availability-dot"></span>
            {isAvailable ? "Currently Available" : "Storage Full"}
          </span>
        </div>

        <div className="storage-overview-grid">
          <div className="storage-overview-card">
            <span className="overview-icon">📦</span>
            <span className="overview-label">Available Capacity</span>
            <strong>{storage.availableQuintals}</strong>
            <small>Quintals</small>
          </div>

          <div className="storage-overview-card">
            <span className="overview-icon">🏭</span>
            <span className="overview-label">Total Capacity</span>
            <strong>{storage.totalCapacityQuintals}</strong>
            <small>Quintals</small>
          </div>

          <div className="storage-overview-card">
            <span className="overview-icon">📍</span>
            <span className="overview-label">Distance</span>
            <strong>{storage.distanceKm}</strong>
            <small>Kilometres</small>
          </div>

          <div className="storage-overview-card">
            <span className="overview-icon">💰</span>
            <span className="overview-label">Monthly Charge</span>
            <strong>₹{storage.chargePerQuintalPerMonth}</strong>
            <small>Per Quintal</small>
          </div>
        </div>

        <div className="storage-details-layout">
          <div className="storage-details-main">
            <section className="storage-detail-panel">
              <div className="storage-panel-heading">
                <span>🏢</span>
                <h3>About This Storage</h3>
              </div>
              <p className="storage-description">{storage.description}</p>

              <div className="storage-capacity-section">
                <div className="capacity-heading">
                  <strong>Storage Capacity Overview</strong>
                  <span>{Math.round(capacityPercentage)}% Occupied</span>
                </div>

                <div className="capacity-track">
                  <div
                    className="capacity-fill"
                    style={{ width: `${capacityPercentage}%` }}
                  ></div>
                </div>

                <div className="capacity-legend">
                  <span>
                    <i className="capacity-occupied-dot"></i>
                    Occupied
                  </span>
                  <span>
                    <i className="capacity-available-dot"></i>
                    Available
                  </span>
                </div>
              </div>
            </section>

            <section className="storage-detail-panel">
              <div className="storage-panel-heading">
                <span>🌾</span>
                <h3>Supported Crops</h3>
              </div>

              <div className="storage-detail-crops">
                {storage.crops.map((crop) => (
                  <span className="storage-detail-crop" key={crop}>
                    🌱 {crop}
                  </span>
                ))}
              </div>
            </section>

            <section className="storage-detail-panel">
              <div className="storage-panel-heading">
                <span>⚙️</span>
                <h3>Available Facilities</h3>
              </div>

              <div className="storage-facility-list">
                {storage.facilities.map((facility, index) => (
                  <div className="storage-facility-item" key={facility}>
                    <span>✓</span>
                    {facility}
                  </div>
                ))}
              </div>
            </section>

            <section className="storage-detail-panel">
              <div className="storage-panel-heading">
                <span>ℹ️</span>
                <h3>Additional Information</h3>
              </div>

              <div className="storage-extra-grid">
                <div>
                  <span>🌡️ Temperature Range</span>
                  <strong>
                    {storage.minTempC}°C – {storage.maxTempC}°C
                  </strong>
                </div>

                <div>
                  <span>🕒 Opening Hours</span>
                  <strong>{storage.openHours}</strong>
                </div>

                <div>
                  <span>📞 Contact Number</span>
                  <strong>{storage.contact}</strong>
                </div>

                <div>
                  <span>💵 Monthly Rate</span>
                  <strong>₹{storage.chargePerQuintalPerMonth} / Quintal</strong>
                </div>
              </div>
            </section>
          </div>

          <aside className="storage-application-panel">
            {isAvailable ? (
              <>
                <div className="storage-application-heading">
                  <span>📝</span>
                  <div>
                    <h3>Apply for Storage</h3>
                    <p>Submit your crop storage request.</p>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-error">{error}</div>
                )}

                {success && (
                  <div className="alert alert-success">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="crop">Select Crop</label>
                    <select
                      id="crop"
                      name="crop"
                      value={formData.crop}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose your crop</option>

                      {CROP_OPTIONS.filter((crop) =>
                        storage.crops.includes(crop)
                      ).map((crop) => (
                        <option key={crop} value={crop}>
                          {crop}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="quantityQuintals">
                      Quantity (Quintals)
                    </label>
                    <input
                      id="quantityQuintals"
                      name="quantityQuintals"
                      type="number"
                      min="0.01"
                      max={storage.availableQuintals}
                      step="any"
                      placeholder="Enter crop quantity"
                      value={formData.quantityQuintals}
                      onChange={handleChange}
                      required
                    />
                    <small>
                      Maximum available: {storage.availableQuintals} Quintals
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="durationMonths">
                      Storage Duration (Months)
                    </label>
                    <input
                      id="durationMonths"
                      name="durationMonths"
                      type="number"
                      min="1"
                      max="12"
                      step="1"
                      value={formData.durationMonths}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="storage-cost-box">
                    <span>Estimated Total Cost</span>
                    <strong>
                      ₹
                      {Number.isFinite(estimatedCost)
                        ? estimatedCost.toLocaleString("en-IN")
                        : "0"}
                    </strong>
                    <small>
                      Quantity × Months × Monthly charge per quintal
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block storage-submit-btn"
                  >
                    Submit Application <span>→</span>
                  </button>
                </form>

                <p className="storage-demo-note">
                  Demo only: submitting an application does not reserve real
                  storage.
                </p>
              </>
            ) : (
              <div className="storage-full-message">
                <span>⚠️</span>
                <h3>Storage Full</h3>
                <p>
                  This facility currently has no available capacity. Please
                  explore other storage facilities.
                </p>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => navigate("/storages")}
                >
                  Find Other Storages
                </button>
              </div>
            )}
          </aside>
        </div>

        <button
          className="btn btn-secondary storage-back-btn"
          onClick={() => navigate("/storages")}
        >
          ← Back to Storages
        </button>
      </div>
    </>
  );
}

export default StorageDetails;
