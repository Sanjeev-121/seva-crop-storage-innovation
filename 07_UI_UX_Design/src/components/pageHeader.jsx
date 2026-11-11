function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header">
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}

export default PageHeader;