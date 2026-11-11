import { Link } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";

function NotFound() {
  return (
    <div className="container section">
      <div className="state-box card">
        <FiMapPin className="state-icon" aria-hidden="true" />
        <h1>Page not found</h1>
        <p>Sorry, we could not find this page. The address may be wrong.</p>
        <Link to="/" className="btn btn-primary">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;