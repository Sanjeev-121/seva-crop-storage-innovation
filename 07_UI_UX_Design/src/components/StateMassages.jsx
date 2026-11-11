import { Link } from "react-router-dom";
import { FiAlertTriangle, FiInbox } from "react-icons/fi";

export function Loader({ message = "Loading, please wait..." }) {
  return (
    <div className="state-box" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <p>{message}</p>
    </div>
  );
}

export function EmptyState({
  title = "Nothing to show",
  message = "",
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="state-box card">
      <FiInbox className="state-icon" aria-hidden="true" />
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message = "Please try again.",
  onRetry,
}) {
  return (
    <div className="state-box card" role="alert">
      <FiAlertTriangle className="state-icon" aria-hidden="true" />
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}