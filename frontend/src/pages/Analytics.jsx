import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import DashboardLayout from "../components/DashboardLayout";
import "./Analytics.css";

function Analytics() {
  const [organizationId, setOrganizationId] = useState(null);
  const [leads, setLeads] = useState([]);
  const [scores, setScores] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getOrganization() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("organization_users")
        .select("organization_id")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Organization lookup error:", error);
        setLoading(false);
        return;
      }

      if (data) {
        setOrganizationId(data.organization_id);
      }
    }

    getOrganization();
  }, []);

  useEffect(() => {
    if (!organizationId) return;

    async function loadAnalytics() {
  setLoading(true);

  try {
    const { data: leadData, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("organization_id", organizationId);

    if (leadError) {
      throw leadError;
    }

    const organizationLeads = leadData || [];
    const leadIds = organizationLeads.map(
      (lead) => lead.lead_id
    );

    let scoreData = [];
    let eventData = [];

    if (leadIds.length > 0) {
      const { data: scores, error: scoreError } =
        await supabase
          .from("lead_scores")
          .select("*")
          .in("lead_id", leadIds);

      if (scoreError) {
        throw scoreError;
      }

      const { data: events, error: eventError } =
        await supabase
          .from("behavioral_events")
          .select("*")
          .in("lead_id", leadIds);

      if (eventError) {
        throw eventError;
      }

      scoreData = scores || [];
      eventData = events || [];
    }

    setLeads(organizationLeads);
    setScores(scoreData);
    setEvents(eventData);
  } catch (error) {
    console.error("Analytics loading error:", error);
  } finally {
    setLoading(false);
  }
}

    loadAnalytics();
  }, [organizationId]);

  const totalLeads = leads.length;

  const hotLeads = scores.filter(
    (score) => score.status === "Hot Lead"
  ).length;

  const warmLeads = scores.filter(
    (score) => score.status === "Warm Lead"
  ).length;

  const coldLeads = scores.filter(
    (score) => score.status === "Cold Lead"
  ).length;

  const totalEvents = events.length;

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (total, score) => total + (score.score || 0),
            0
          ) / scores.length
        )
      : 0;

  const hotLeadRate =
    totalLeads > 0
      ? Math.round((hotLeads / totalLeads) * 100)
      : 0;

  const eventCounts = events.reduce((acc, event) => {
    const type = event.event_type || "Unknown";

    acc[type] = (acc[type] || 0) + 1;

    return acc;
  }, {});

  const sourcePerformance = leads.reduce((acc, lead) => {
  const source = lead.source || "Unknown";

  const leadScore =
    scores.find(
      (score) => score.lead_id === lead.lead_id
    )?.score || 0;

  if (!acc[source]) {
    acc[source] = {
      leads: 0,
      totalScore: 0,
      hotLeads: 0,
    };
  }

  acc[source].leads += 1;
  acc[source].totalScore += leadScore;

  if (leadScore >= 50) {
    acc[source].hotLeads += 1;
  }

  return acc;
}, {});

const sourcePerformanceList = Object.entries(
  sourcePerformance
).map(([source, data]) => {
  const averageScore =
    data.leads > 0
      ? Math.round(data.totalScore / data.leads)
      : 0;

  let quality = "Low";

  if (averageScore >= 50) {
    quality = "High";
  } else if (averageScore >= 10) {
    quality = "Medium";
  }

  return {
    source,
    leads: data.leads,
    averageScore,
    hotLeads: data.hotLeads,
    quality,
  };
}).sort((a, b) => b.averageScore - a.averageScore);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="analytics-page">
          <div className="analytics-loading">
            Loading analytics...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="analytics-page">

        {/* HEADER */}
        <div className="analytics-header">
          <div>
            <p className="analytics-eyebrow">
              VOXA AI CRM
            </p>

            <h1 className="analytics-title">
              Performance Analytics
            </h1>

            <p className="analytics-subtitle">
              Understand your pipeline, lead quality and
              engagement patterns.
            </p>
          </div>
        </div>

        {/* KPI CARDS */}
        <section className="analytics-kpi-grid">

          <div className="analytics-kpi-card">
            <span className="analytics-kpi-label">
              Total Leads
            </span>

            <strong className="analytics-kpi-value">
              {totalLeads}
            </strong>
          </div>

          <div className="analytics-kpi-card">
            <span className="analytics-kpi-label">
              Total Events
            </span>

            <strong className="analytics-kpi-value">
              {totalEvents}
            </strong>
          </div>

          <div className="analytics-kpi-card">
            <span className="analytics-kpi-label">
              Average Score
            </span>

            <strong className="analytics-kpi-value">
              {averageScore}
            </strong>
          </div>

          <div className="analytics-kpi-card">
            <span className="analytics-kpi-label">
              Hot Lead Rate
            </span>

            <strong className="analytics-kpi-value">
              {hotLeadRate}%
            </strong>
          </div>

        </section>

        {/* PIPELINE QUALITY */}
        <section className="analytics-section">

          <div className="analytics-section-heading">
            <div>
              <h2>Pipeline Quality</h2>

              <p>
                Distribution of leads by engagement status.
              </p>
            </div>
          </div>

          <div className="analytics-quality-grid">

            <div className="analytics-quality-card hot">
              <span>Hot Leads</span>
              <strong>{hotLeads}</strong>
            </div>

            <div className="analytics-quality-card warm">
              <span>Warm Leads</span>
              <strong>{warmLeads}</strong>
            </div>

            <div className="analytics-quality-card cold">
              <span>Cold Leads</span>
              <strong>{coldLeads}</strong>
            </div>

          </div>

        </section>

        {/* TWO COLUMN ANALYTICS */}
        <div className="analytics-two-column">

          {/* LEAD SOURCE PERFORMANCE */}
<section className="analytics-section">

  <div className="analytics-section-heading">
    <div>
      <h2>Lead Source Performance</h2>

      <p>
        Compare lead volume, quality and high-intent prospects by source.
      </p>
    </div>
  </div>

  <div className="analytics-source-table-wrapper">

    <table className="analytics-source-table">

      <thead>
        <tr>
          <th>Source</th>
          <th>Leads</th>
          <th>Avg. Score</th>
          <th>Hot Leads</th>
          <th>Quality</th>
        </tr>
      </thead>

      <tbody>

        {sourcePerformanceList.length === 0 ? (

          <tr>
            <td
              colSpan="5"
              className="analytics-table-empty"
            >
              No lead source data available.
            </td>
          </tr>

        ) : (

          sourcePerformanceList.map((item) => (

            <tr key={item.source}>

              <td className="analytics-source-name">
                {item.source}
              </td>

              <td>
                {item.leads}
              </td>

              <td>
                {item.averageScore}
              </td>

              <td>
                {item.hotLeads}
              </td>

              <td>
                <span
                  className={`analytics-quality-badge ${item.quality.toLowerCase()}`}
                >
                  {item.quality}
                </span>
              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>

</section>

          {/* BEHAVIOURAL ACTIVITY */}
          <section className="analytics-section">

            <div className="analytics-section-heading">
              <div>
                <h2>Engagement Activity</h2>

                <p>
                  Behavioural activity recorded by Voxa.
                </p>
              </div>
            </div>

            <div className="analytics-list">

              {Object.entries(eventCounts).length === 0 ? (
                <p className="analytics-empty">
                  No behavioural events recorded yet.
                </p>
              ) : (
                Object.entries(eventCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([event, count]) => (
                    <div
                      className="analytics-list-row"
                      key={event}
                    >
                      <span>
                        {event.replaceAll("_", " ")}
                      </span>

                      <strong>{count}</strong>
                    </div>
                  ))
              )}

            </div>

          </section>

        </div>

        {/* ANALYTICS TAKEAWAY */}
        <section className="analytics-insight">

          <div>
            <span className="analytics-insight-label">
              VOXA ANALYTICS
            </span>

            <h2>
              Your pipeline currently contains{" "}
              {hotLeads} hot lead
              {hotLeads !== 1 ? "s" : ""}.
            </h2>

            <p>
              Voxa is analysing lead scores and behavioural
              activity to help identify where attention may
              be needed next.
            </p>
          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}

export default Analytics;