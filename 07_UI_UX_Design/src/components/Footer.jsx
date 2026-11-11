import { Link } from "react-router-dom";
import { resetDemoData } from "../utils/localStore.js";

function Footer() {
  const handleReset = () => {
    const sure = window.confirm(
      "This will delete all demo registrations, demo applications and your demo login from this browser. Continue?"
    );
    if (sure) {
      resetDemoData();
      window.location.assign("/");
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <ul className="footer-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/storages">Cold Storages</Link></li>
          <li><Link to="/schemes">Govt Schemes</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
        <p>
          <strong>Crop Storage and Farmer Assistance Platform</strong> -
          college innovation competition frontend prototype.
        </p>
        <p>
          No backend is connected. Storage availability, prices, logins and
          applications are demonstrations only and must not be relied on.
        </p>
        <button type="button" className="link-button" onClick={handleReset}>
          Reset demo data
        </button>
      </div>
    </footer>
  );
}

export default Footer;