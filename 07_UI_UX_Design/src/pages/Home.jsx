
import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard.jsx";

function Home() {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-tag">
            Supporting Indian Farmers
          </span>

          <h1>
            Smart Crop Storage Solutions
            <br />
            for Every Farmer
          </h1>

          <p>
            Find nearby cold storages, compare storage prices,
            explore government schemes and manage your
            agricultural storage needs in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/storages" className="btn-primary">
              Find Cold Storage
            </Link>

            <Link to="/register" className="btn-secondary">
              Join as Farmer
            </Link>
          </div>
        </div>
      </section>

      {/* Problem and Solution Section */}
      <section className="features-section">
        <div className="section-heading">
          <h2>Problems We Solve</h2>
          <p>
            Everything farmers need to make better storage decisions.
          </p>
        </div>

        <div className="features-grid">

          <FeatureCard
            icon="🏬"
            title="Find Nearby Cold Storage"
            description="Discover nearby cold storage facilities and find suitable places to store your crops."
          />

          <FeatureCard
            icon="💰"
            title="Compare Storage Prices"
            description="Compare storage charges and facilities to make better financial decisions."
          />

          <FeatureCard
            icon="🌾"
            title="Government Schemes"
            description="Explore agricultural government schemes and learn about available benefits."
          />

          <FeatureCard
            icon="📋"
            title="Track Applications"
            description="Keep track of your submitted applications and check their current status."
          />

        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-heading">
          <h2>How It Works</h2>
          <p>Get started in just four simple steps.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span>01</span>
            <h3>Register</h3>
            <p>Create your farmer account.</p>
          </div>

          <div className="step-card">
            <span>02</span>
            <h3>Search</h3>
            <p>Find suitable cold storage facilities.</p>
          </div>

          <div className="step-card">
            <span>03</span>
            <h3>Compare</h3>
            <p>Compare prices and available facilities.</p>
          </div>

          <div className="step-card">
            <span>04</span>
            <h3>Apply</h3>
            <p>Submit your application and track its status.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to Simplify Your Crop Storage?</h2>

        <p>
          Join our platform and explore smarter storage
          opportunities for your agricultural products.
        </p>

        <Link to="/register" className="btn-primary">
          Register Now
        </Link>
      </section>

    </div>
  );
}

export default Home;
