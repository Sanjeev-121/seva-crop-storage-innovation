
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import {
  SAMPLE_STORAGES,
  CROP_OPTIONS,
  DISTRICT_OPTIONS,
} from "../data/sampleStorages.js";

function StorageList() {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [crop, setCrop] = useState("");

  const filteredStorages = useMemo(() => {
    return SAMPLE_STORAGES.filter((storage) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        storage.name.toLowerCase().includes(searchText) ||
        storage.village.toLowerCase().includes(searchText);

      const matchesDistrict =
        !district || storage.district === district;

      const matchesCrop =
        !crop || storage.crops.includes(crop);

      return matchesSearch && matchesDistrict && matchesCrop;
    });
  }, [search, district, crop]);

  function clearFilters() {
    setSearch("");
    setDistrict("");
    setCrop("");
  }

  return (
    <>
      <PageHeader
        title="Cold Storage Facilities"
        subtitle="Find the right storage facility to keep your crops safe."
      />

      <div className="container section storage-list-page">
        <div className="storage-filter-panel">
          <div className="storage-filter-heading">
            <div>
              <span className="storage-eyebrow">FIND YOUR STORAGE</span>
              <h2>Search & Filter</h2>
              <p>Choose a location and crop to find suitable facilities.</p>
            </div>
            <div className="storage-filter-icon">🔎</div>
          </div>

          <div className="storage-filter-grid">
            <div className="storage-filter-field">
              <label htmlFor="search">Search Storage</label>
              <input
                id="search"
                type="text"
                placeholder="Storage name or village..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="storage-filter-field">
              <label htmlFor="district">Select District</label>
              <select
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">All Districts</option>
                {DISTRICT_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="storage-filter-field">
              <label htmlFor="crop">Select Crop</label>
              <select
                id="crop"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
              >
                <option value="">All Crops</option>
                {CROP_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="storage-filter-bottom">
            <p>
              <strong>{filteredStorages.length}</strong> facilities match
              your search
            </p>
            <button
              type="button"
              className="btn btn-secondary storage-clear-btn"
              onClick={clearFilters}
            >
              ↺ Clear Filters
            </button>
          </div>
        </div>

        <div className="storage-results-heading">
          <div>
            <span className="storage-eyebrow">EXPLORE FACILITIES</span>
            <h2>Available Storage Facilities</h2>
            <p>Compare capacity, location and storage charges.</p>
          </div>
          <div className="storage-result-count">
            {filteredStorages.length} Found
          </div>
        </div>

        {filteredStorages.length > 0 ? (
          <div className="storage-card-grid">
            {filteredStorages.map((storage) => {
              const isAvailable = storage.availableQuintals > 0;

              return (
                <article className="storage-facility-card" key={storage.id}>
                  <div className="storage-card-top">
                    <div className="storage-card-icon">🏬</div>
                    <span
                      className={`storage-availability ${
                        isAvailable ? "is-available" : "is-full"
                      }`}
                    >
                      <span className="availability-dot"></span>
                      {isAvailable ? "Available" : "Full"}
                    </span>
                  </div>

                  <h3>{storage.name}</h3>

                  <p className="storage-card-location">
                    <span>📍</span> {storage.village}, {storage.district}
                  </p>

                  <div className="storage-info-grid">
                    <div className="storage-info-box">
                      <span>📦</span>
                      <small>Available Capacity</small>
                      <strong>{storage.availableQuintals} Quintals</strong>
                    </div>

                    <div className="storage-info-box">
                      <span>📍</span>
                      <small>Distance</small>
                      <strong>{storage.distanceKm} km</strong>
                    </div>

                    <div className="storage-info-box storage-price-box">
                      <span>₹</span>
                      <small>Monthly Charge</small>
                      <strong>
                        ₹{storage.chargePerQuintalPerMonth}
                        <small> / Quintal</small>
                      </strong>
                    </div>
                  </div>

                  <div className="storage-crops-section">
                    <span className="storage-crops-label">
                      SUPPORTED CROPS
                    </span>
                    <div className="storage-crop-tags">
                      {storage.crops.map((item) => (
                        <span className="storage-crop-tag" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/storages/${storage.id}`}
                    className="btn btn-primary storage-details-btn"
                  >
                    View Details <span>→</span>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="storage-empty-state">
            <div>🔍</div>
            <h3>No Storage Found</h3>
            <p>Try changing your search or selecting different filters.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default StorageList;
