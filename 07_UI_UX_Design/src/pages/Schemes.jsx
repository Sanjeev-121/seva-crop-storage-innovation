
import PageHeader from "../components/PageHeader.jsx";

const schemes = [
  {
    id: 1,
    number: "01",
    icon: "🌾",
    name: "Krishak Bandhu (Natun)",
    department: "Government of West Bengal",
    category: "Farmer Financial Support",
    description:
      "Financial assistance to farmers for agricultural activities, along with social security support for eligible farmer families.",
    benefits: [
      "Up to ₹10,000 per year for farmers with 1 acre or more.",
      "Farmers with less than 1 acre receive proportionate assistance, subject to a ₹4,000 minimum.",
      "Assistance is paid in two instalments.",
      "Eligible families may receive death benefit support.",
    ],
    eligibility:
      "Farmers with cultivable land in West Bengal. Final eligibility is determined by the scheme authorities.",
    website: "https://krishakbandhu.wb.gov.in/",
  },
  {
    id: 2,
    number: "02",
    icon: "💰",
    name: "PM-KISAN",
    department: "Government of India",
    category: "Income Support",
    description:
      "A central government scheme providing income support to eligible landholding farmer families.",
    benefits: [
      "₹6,000 per year.",
      "Paid in three equal instalments of ₹2,000.",
      "Money is transferred directly to the beneficiary's bank account.",
    ],
    eligibility:
      "Eligible landholding farmer families, subject to scheme conditions, exclusions and verification.",
    website: "https://pmkisan.gov.in/",
  },
  {
    id: 3,
    number: "03",
    icon: "🛡️",
    name: "Pradhan Mantri Fasal Bima Yojana",
    department: "Government of India",
    category: "Crop Insurance",
    description:
      "Crop insurance protection against notified crop losses caused by natural calamities, adverse weather, pests and diseases.",
    benefits: [
      "Financial protection against covered crop losses.",
      "Insurance claims for eligible farmers.",
      "Sharecroppers and tenant farmers may also qualify with prescribed documents.",
    ],
    eligibility:
      "Farmers cultivating notified crops in notified areas, subject to applicable conditions.",
    website: "https://pmfby.gov.in/",
  },
  {
    id: 4,
    number: "04",
    icon: "🚜",
    name: "Farm Mechanisation Schemes",
    department: "Government of West Bengal",
    category: "Agricultural Equipment Support",
    description:
      "Government support schemes that help eligible farmers and rural entrepreneurs access agricultural machinery.",
    benefits: [
      "Financial support for eligible farm equipment.",
      "Assistance for small and marginal farmers under applicable schemes.",
      "Support for eligible rural entrepreneurs setting up machinery hiring centres.",
    ],
    eligibility:
      "Depends on the particular scheme, applicant category, equipment and current government notification.",
    website: "https://wbfms.wb.gov.in/",
  },
];

function Schemes() {
  return (
    <>
      <PageHeader
        title="Government Schemes"
        subtitle="Explore government support and benefits available for farmers."
      />

      <main className="container section schemes-page">
        <section className="schemes-hero">
          <div className="schemes-hero-content">
            <span className="schemes-eyebrow">
              FARMER WELFARE & SUPPORT
            </span>

            <h2>Government Support for Every Farmer</h2>

            <p>
              Discover financial assistance, crop insurance and
              agricultural equipment support. Explore the schemes
              and visit their official portals for more information.
            </p>

            <div className="schemes-hero-stats">
              <div>
                <strong>{schemes.length}</strong>
                <span>Listed Schemes</span>
              </div>
              <div>
                <strong>2</strong>
                <span>Government Levels</span>
              </div>
            </div>
          </div>

          <div className="schemes-hero-icon">🌱</div>
        </section>

        <div className="schemes-section-heading">
          <div>
            <span className="schemes-eyebrow">EXPLORE SUPPORT</span>
            <h2>Available Government Schemes</h2>
            <p>Find support that may match your farming needs.</p>
          </div>

          <span className="schemes-count">
            {schemes.length} Schemes
          </span>
        </div>

        <div className="schemes-grid">
          {schemes.map((scheme) => (
            <article className="modern-scheme-card" key={scheme.id}>
              <div className="scheme-card-top">
                <div className="scheme-icon">{scheme.icon}</div>
                <span className="scheme-number">{scheme.number}</span>
              </div>

              <span className="scheme-category">
                {scheme.category}
              </span>

              <h3>{scheme.name}</h3>

              <p className="scheme-department">
                <span>🏛️</span> {scheme.department}
              </p>

              <p className="scheme-description">
                {scheme.description}
              </p>

              <div className="scheme-information-block">
                <h4>
                  <span>✓</span> Key Benefits
                </h4>

                <ul className="scheme-benefits-list">
                  {scheme.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="scheme-eligibility">
                <h4>Who Can Apply?</h4>
                <p>{scheme.eligibility}</p>
              </div>

              <a
                href={scheme.website}
                target="_blank"
                rel="noopener noreferrer"
                className="scheme-portal-btn"
              >
                Visit Official Portal
                <span>↗</span>
              </a>
            </article>
          ))}
        </div>

        <section className="schemes-important-note">
          <div className="schemes-note-icon">ℹ️</div>
          <div>
            <h3>Important Information</h3>
            <p>
              This website provides general information only. Scheme
              availability, eligibility, benefits and application dates
              may change. Always verify details through the official
              government portal or your local Block Agriculture Office.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Schemes;
