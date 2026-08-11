import "./LeadInsights.css";

function LeadInsights({
  leads,
  hotCount,
  warmCount,
  coldCount,
  averageScore,
  hotLeadRate,
}) {
  return (
    <section className="lead-insights">

      <h2 className="lead-insights-title">
        Lead Insights
      </h2>

      <div className="lead-insights-grid">

        <div className="lead-insight-item">
          <span className="lead-insight-label">
            Total Leads
          </span>
          <p className="lead-insight-value">
            {leads.length}
          </p>
        </div>

        <div className="lead-insight-item">
          <span className="lead-insight-label">
            Hot Leads
          </span>
          <p className="lead-insight-value">
            {hotCount}
          </p>
        </div>

        <div className="lead-insight-item">
          <span className="lead-insight-label">
            Warm Leads
          </span>
          <p className="lead-insight-value">
            {warmCount}
          </p>
        </div>

        <div className="lead-insight-item">
          <span className="lead-insight-label">
            Cold Leads
          </span>
          <p className="lead-insight-value">
            {coldCount}
          </p>
        </div>

        <div className="lead-insight-item">
          <span className="lead-insight-label">
            Average Score
          </span>
          <p className="lead-insight-value">
            {averageScore}
          </p>
        </div>

        <div className="lead-insight-item">
          <span className="lead-insight-label">
            Hot Lead Rate
          </span>
          <p className="lead-insight-value">
            {hotLeadRate}%
          </p>
        </div>

      </div>

    </section>
  );
}

export default LeadInsights;