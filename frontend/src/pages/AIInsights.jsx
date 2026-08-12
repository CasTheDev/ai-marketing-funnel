import { useEffect, useState } from "react";
import {
  Flame,
  TrendingUp,
  Target,
  Zap,
  Lightbulb,
  CircleCheck,
  TriangleAlert,
  BrainCircuit,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import DashboardLayout from "../components/DashboardLayout";
import AskCasAI from "../components/AskCasAI";
import "./AIInsights.css";

function AIInsights() {
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

    async function loadAIInsights() {
      setLoading(true);

      try {
        const { data: leadData, error: leadError } = await supabase
          .from("leads")
          .select("*")
          .eq("organization_id", organizationId);

        if (leadError) {
          throw leadError;
        }

        const { data: scoreData, error: scoreError } = await supabase
  .from("lead_scores")
  .select("*");

if (scoreError) {
  throw scoreError;
}

const { data: eventData, error: eventError } = await supabase
  .from("behavioral_events")
  .select("*");

if (eventError) {
  throw eventError;
}

setLeads(leadData || []);
setScores(scoreData || []);
setEvents(eventData || []);

      } catch (error) {
        console.error("AI Insights loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAIInsights();
  }, [organizationId]);

  const scoredLeads = leads
    .map((lead) => {
      const leadScore = scores.find(
        (score) => score.lead_id === lead.lead_id
      );

      return {
        ...lead,
        score: leadScore?.score || 0,
        status: leadScore?.status || "Cold Lead",
      };
    })
    .sort((a, b) => b.score - a.score);

  const priorityLeads = scoredLeads
    .filter((lead) => lead.score >= 10)
    .slice(0, 5);

    const hotLeads = scoredLeads.filter(
  (lead) => lead.status === "Hot Lead"
);

const warmLeads = scoredLeads.filter(
  (lead) => lead.status === "Warm Lead"
);

const totalPipelineScore = scoredLeads.reduce(
  (total, lead) => total + lead.score,
  0
);

const topEvent = Object.entries(
  events.reduce((acc, event) => {
    const type = event.event_type || "Unknown";

    acc[type] = (acc[type] || 0) + 1;

    return acc;
  }, {})
).sort((a, b) => b[1] - a[1])[0];

const closestWarmLead = warmLeads
  .sort((a, b) => b.score - a.score)[0];

  const sourceAnalysis = Object.entries(
  scoredLeads.reduce((acc, lead) => {
    const source = lead.source || "Unknown";

    if (!acc[source]) {
      acc[source] = {
        source,
        leads: 0,
        totalScore: 0,
        hotLeads: 0,
      };
    }

    acc[source].leads += 1;
    acc[source].totalScore += lead.score;

    if (lead.status === "Hot Lead") {
      acc[source].hotLeads += 1;
    }

    return acc;
  }, {})
).map(([source, data]) => ({
  ...data,
  averageScore:
    data.leads > 0
      ? Math.round(data.totalScore / data.leads)
      : 0,
  hotLeadRate:
    data.leads > 0
      ? Math.round((data.hotLeads / data.leads) * 100)
      : 0,
}));

const focusSource = [...sourceAnalysis].sort((a, b) => {
  if (b.hotLeads !== a.hotLeads) {
    return b.hotLeads - a.hotLeads;
  }

  if (b.averageScore !== a.averageScore) {
    return b.averageScore - a.averageScore;
  }

  return b.leads - a.leads;
})[0];

const focusConfidence =
  scoredLeads.length >= 20
    ? "High"
    : scoredLeads.length >= 10
    ? "Moderate"
    : "Limited";

    const hotLeadPercentage =
  scoredLeads.length > 0
    ? Math.round(
        (hotLeads.length / scoredLeads.length) * 100
      )
    : 0;

const weakSources = sourceAnalysis.filter(
  (source) =>
    source.leads > 0 &&
    source.hotLeads === 0 &&
    source.averageScore < 10
);

const focusSourceShare =
  scoredLeads.length > 0 && focusSource
    ? Math.round(
        (focusSource.leads / scoredLeads.length) * 100
      )
    : 0;

const pipelineRisks = [];

if (
  scoredLeads.length >= 5 &&
  hotLeadPercentage < 20
) {
  pipelineRisks.push({
    type: "Pipeline coverage",
    title: "Limited hot-lead coverage",
    description: `Only ${hotLeadPercentage}% of current leads are classified as Hot Leads. Most of the pipeline still requires additional engagement before it can be considered high intent.`,
    action:
      "Focus follow-up on warm leads and look for signals that indicate increasing purchase intent.",
  });
}

if (weakSources.length > 0) {
  pipelineRisks.push({
    type: "Source quality",
    title: "Some channels show weak intent",
    description: `${weakSources
      .map((source) => source.source)
      .join(
        ", "
      )} currently have leads but no Hot Leads and an average score below 10.`,
    action:
      "Review lead quality and engagement from these sources before increasing investment.",
  });
}

if (
  scoredLeads.length >= 5 &&
  focusSourceShare >= 50 &&
  sourceAnalysis.length > 1
) {
  pipelineRisks.push({
    type: "Source concentration",
    title: "Pipeline depends heavily on one source",
    description: `${focusSource.source} currently represents ${focusSourceShare}% of the scored pipeline.`,
    action:
      "Continue developing this source while testing additional channels to reduce dependency.",
  });
}

const primaryRisk = pipelineRisks[0];

const recommendation = (() => {
  if (closestWarmLead && weakSources.length > 0) {
    return {
      title:
        "Prioritise your warmest opportunity before increasing acquisition spend.",

      explanation:
        `${closestWarmLead.first_name} is currently the closest warm lead to the hot-lead threshold, while ${weakSources
          .map((source) => source.source)
          .join(
            " and "
          )} are currently showing limited intent signals.`,

      action:
        `Follow up with ${closestWarmLead.first_name} and monitor engagement before increasing investment in weaker channels.`,

      confidence: focusConfidence,
    };
  }

  if (closestWarmLead) {
    return {
      title:
        "Focus on converting your strongest warm opportunity.",

      explanation:
        `${closestWarmLead.first_name} currently has the highest score among your warm leads and is the closest opportunity to reaching the Hot Lead range.`,

      action:
        `Follow up with ${closestWarmLead.first_name} and look for additional buying signals.`,

      confidence: focusConfidence,
    };
  }

  if (hotLeads.length > 0) {
    return {
      title:
        "Prioritise follow-up with your existing hot leads.",

      explanation:
        `Your pipeline currently contains ${hotLeads.length} Hot Lead${
          hotLeads.length === 1 ? "" : "s"
        }. These leads represent the strongest current purchase-intent signals.`,

      action:
        "Make timely personal follow-up the priority before focusing on lower-intent opportunities.",

      confidence: focusConfidence,
    };
  }

  if (focusSource) {
    return {
      title:
        `Focus your next effort on ${focusSource.source}.`,

      explanation:
        `${focusSource.source} currently shows the strongest combination of lead volume and lead quality in the available data.`,

      action:
        `Prioritise high-intent opportunities from ${focusSource.source} while continuing to collect data from other channels.`,

      confidence: focusConfidence,
    };
  }

  return {
    title:
      "Collect more engagement data before making a major pipeline decision.",

    explanation:
      "The current CRM data is not yet strong enough to support a confident prioritisation decision.",

    action:
      "Continue capturing lead and behavioural activity so Voxa can identify meaningful patterns.",

    confidence: "Limited",
  };
})();

  function getReason(lead) {
    if (lead.status === "Hot Lead") {
      return "High-intent activity has pushed this lead into the hot-lead range.";
    }

    if (lead.status === "Warm Lead") {
      return "This lead is showing meaningful engagement and may be ready for further follow-up.";
    }

    return "This lead has recent engagement but currently has limited evidence of purchase intent.";
  }

  function getRecommendation(lead) {
    if (lead.status === "Hot Lead") {
      return "Prioritise personal follow-up.";
    }

    if (lead.status === "Warm Lead") {
      return "Continue engagement and look for a stronger buying signal.";
    }

    return "Monitor engagement before prioritising outreach.";
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="ai-insights-page">
          <div className="ai-insights-loading">
            CAS is analysing your CRM...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="ai-insights-page">

        {/* PAGE HEADER */}
        <div className="ai-insights-header">

          <div>
            <p className="ai-insights-eyebrow">
              VOXA AI INTELLIGENCE
            </p>

            <h1 className="ai-insights-title">
              AI Insights
            </h1>

            <p className="ai-insights-subtitle">
              Voxa has analysed your CRM data and identified
              where your attention may be needed.
            </p>
          </div>

        </div>

        {/* ACT TODAY */}
        <section className="ai-insights-section act-today">

          <div className="ai-insights-section-heading">

            <div>
              <div className="ai-insights-section-label">
                PRIORITY INTELLIGENCE
              </div>

              <h2>
                🔥 Act Today
              </h2>

              <p>
                Leads currently showing the strongest signals
                for follow-up.
              </p>
            </div>

            <div className="ai-insights-count">
              {priorityLeads.length}
            </div>

          </div>

          {priorityLeads.length === 0 ? (

            <div className="ai-insights-empty">
              <h3>
                No immediate priorities identified.
              </h3>

              <p>
                Voxa does not currently have enough evidence
                to recommend an urgent follow-up.
              </p>
            </div>

          ) : (

            <div className="ai-priority-list">

              {priorityLeads.map((lead) => (

                <div
                  className="ai-priority-card"
                  key={lead.lead_id}
                >

                  <div className="ai-priority-main">

                    <div className="ai-priority-lead">

                      <div className="ai-priority-avatar">
                        {lead.first_name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <h3>
                          {lead.first_name}
                        </h3>

                        <p>
                          {lead.company_name}
                        </p>
                      </div>

                    </div>

                    <div className="ai-priority-score">

                      <strong>
                        {lead.score}
                      </strong>

                      <span>
                        {lead.status}
                      </span>

                    </div>

                  </div>

                  <div className="ai-priority-reason">

                    <strong>
                      Why this lead?
                    </strong>

                    <p>
                      {getReason(lead)}
                    </p>

                  </div>

                  <div className="ai-priority-action">

                    <span>
                      Recommended action
                    </span>

                    <strong>
                      {getRecommendation(lead)}
                    </strong>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>
        {/* WHAT CHANGED */}
        <section className="ai-insights-section what-changed">

          <div className="ai-insights-section-heading">

            <div>
              <div className="ai-insights-section-label">
                PIPELINE INTELLIGENCE
              </div>

              <h2>
                What Changed
              </h2>

              <p>
                Notable conditions Voxa has identified in your
                current CRM data.
              </p>
            </div>

          </div>

          <div className="ai-change-grid">

            {/* PIPELINE SCORE */}
            <div className="ai-change-card">

              <div className="ai-change-icon">
                <TrendingUp size={20} strokeWidth={2} />
              </div>

              <div>

                <span className="ai-change-label">
                  Pipeline Score
                </span>

                <strong className="ai-change-value">
                  {totalPipelineScore}
                </strong>

                <p>
                  Combined score across your current leads.
                </p>

              </div>

            </div>

            {/* ENGAGEMENT */}
            <div className="ai-change-card">

              <div className="ai-change-icon">
                <Zap size={20} strokeWidth={2} />
              </div>

              <div>

                <span className="ai-change-label">
                  Most Active Signal
                </span>

                <strong className="ai-change-value">
                  {topEvent ? topEvent[0] : "No activity"}
                </strong>

                <p>
                  {topEvent
                    ? `${topEvent[1]} recorded event${
                        topEvent[1] === 1 ? "" : "s"
                      } in the current data.`
                    : "No behavioural activity has been recorded yet."}
                </p>

              </div>

            </div>

            {/* NEXT OPPORTUNITY */}
            <div className="ai-change-card">

              <div className="ai-change-icon">
                <Target size={20} strokeWidth={2} />
              </div>

              <div>

                <span className="ai-change-label">
                  Closest Opportunity
                </span>

                <strong className="ai-change-value">
                  {closestWarmLead
                    ? closestWarmLead.first_name
                    : hotLeads.length > 0
                    ? "Hot lead identified"
                    : "No warm lead"}
                </strong>

                <p>
                  {closestWarmLead
                    ? `${closestWarmLead.first_name} currently has a score of ${closestWarmLead.score} and is the closest warm lead to the hot-lead threshold.`
                    : hotLeads.length > 0
                    ? "A hot lead is already present in the current pipeline."
                    : "Voxa does not currently identify a warm lead ready for escalation."}
                </p>

              </div>

            </div>

          </div>

        </section>
            {/* WHERE TO FOCUS */}
        <section className="ai-insights-section where-to-focus">

          <div className="ai-insights-section-heading">

            <div>
              <div className="ai-insights-section-label">
                DECISION SUPPORT
              </div>

              <h2 className="ai-insights-section-title-with-icon">
                <Target size={21} strokeWidth={2} />
                Where to Focus
              </h2>

              <p>
                Voxa identifies the area currently showing the
                strongest opportunity.
              </p>
            </div>

          </div>

          {!focusSource ? (

            <div className="ai-insights-empty">

              <h3>
                Not enough data yet.
              </h3>

              <p>
                Voxa needs lead source information before it can
                recommend where to focus.
              </p>

            </div>

          ) : (

            <div className="ai-focus-card">

              <div className="ai-focus-main">

                <div className="ai-focus-icon">
                  <Target size={24} strokeWidth={2} />
                </div>

                <div className="ai-focus-content">

                  <span className="ai-focus-label">
                    CURRENT FOCUS
                  </span>

                  <h3>
                    {focusSource.source}
                  </h3>

                  <p>
                    This source currently shows the strongest
                    combination of lead quality and opportunity
                    in your pipeline.
                  </p>

                </div>

              </div>

              <div className="ai-focus-metrics">

                <div className="ai-focus-metric">

                  <span>
                    Leads
                  </span>

                  <strong>
                    {focusSource.leads}
                  </strong>

                </div>

                <div className="ai-focus-metric">

                  <span>
                    Avg. Score
                  </span>

                  <strong>
                    {focusSource.averageScore}
                  </strong>

                </div>

                <div className="ai-focus-metric">

                  <span>
                    Hot Leads
                  </span>

                  <strong>
                    {focusSource.hotLeads}
                  </strong>

                </div>

                <div className="ai-focus-metric">

                  <span>
                    Hot Rate
                  </span>

                  <strong>
                    {focusSource.hotLeadRate}%
                  </strong>

                </div>

              </div>

              <div className="ai-focus-recommendation">

                <div>
                  <Lightbulb
                    size={18}
                    strokeWidth={2}
                  />
                </div>

                <div>

                  <span>
                    Voxa's focus
                  </span>

                  <strong>
                    Prioritise follow-up on high-intent leads
                    from {focusSource.source}.
                  </strong>

                </div>

              </div>

              <div className="ai-focus-confidence">

                <span>
                  Data confidence
                </span>

                <strong className={`confidence-${focusConfidence.toLowerCase()}`}>
                  {focusConfidence}
                </strong>

                <p>
                  Based on {scoredLeads.length} current leads.
                  Voxa will become more confident as more CRM
                  data is collected.
                </p>

              </div>

            </div>

          )}

        </section>
         {/* RISKS */}
        <section className="ai-insights-section pipeline-risks">

          <div className="ai-insights-section-heading">

            <div>

              <div className="ai-insights-section-label">
                RISK DETECTION
              </div>

              <h2 className="ai-insights-section-title-with-icon">
                <TriangleAlert
                  size={21}
                  strokeWidth={2}
                />
                Risks
              </h2>

              <p>
                Potential pipeline issues Voxa believes deserve
                attention.
              </p>

            </div>

            <div className="ai-risk-count">
              {pipelineRisks.length}
            </div>

          </div>

          {pipelineRisks.length === 0 ? (

            <div className="ai-no-risk">

              <div className="ai-no-risk-icon">
                <CircleCheck
                  size={24}
                  strokeWidth={2}
                />
              </div>

              <div>

                <h3>
                  No significant pipeline risk detected
                </h3>

                <p>
                  Voxa has not identified a significant risk from
                  the current CRM data. Continue monitoring your
                  pipeline as more activity is collected.
                </p>

              </div>

            </div>

          ) : (

            <div className="ai-risk-list">

              {pipelineRisks.map((risk, index) => (

                <div
                  className="ai-risk-card"
                  key={`${risk.type}-${index}`}
                >

                  <div className="ai-risk-card-header">

                    <div className="ai-risk-icon">
                      <TriangleAlert
                        size={20}
                        strokeWidth={2}
                      />
                    </div>

                    <div>

                      <span className="ai-risk-type">
                        {risk.type}
                      </span>

                      <h3>
                        {risk.title}
                      </h3>

                    </div>

                  </div>

                  <div className="ai-risk-body">

                    <div>

                      <span className="ai-risk-label">
                        Why Voxa flagged this
                      </span>

                      <p>
                        {risk.description}
                      </p>

                    </div>

                    <div className="ai-risk-action">

                      <span>
                        Recommended response
                      </span>

                      <strong>
                        {risk.action}
                      </strong>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>
         {/* CAS AI RECOMMENDATION */}
        <section className="ai-insights-section cas AI-recommendation">

          <div className="ai-insights-section-heading">

            <div>

              <div className="ai-insights-section-label">
                DECISION SUPPORT
              </div>

              <h2 className="ai-insights-section-title-with-icon">
                <BrainCircuit
                  size={21}
                  strokeWidth={2}
                />
                CAS AI's Recommendation
              </h2>

              <p>
                If you could only take one action, CAS AI recommends
                starting here.
              </p>

            </div>

          </div>

          <div className="ai-recommendation-card">

            <div className="ai-recommendation-header">

              <div className="ai-recommendation-icon">
                <BrainCircuit
                  size={25}
                  strokeWidth={2}
                />
              </div>

              <div>

                <span className="ai-recommendation-label">
                  PRIORITY ACTION
                </span>

                <h3>
                  {recommendation.title}
                </h3>

              </div>

            </div>

            <div className="ai-recommendation-explanation">

              <span>
                Why CAS AI recommends this
              </span>

              <p>
                {recommendation.explanation}
              </p>

            </div>

            <div className="ai-recommendation-action">

              <div className="ai-recommendation-action-icon">
                <Target
                  size={19}
                  strokeWidth={2}
                />
              </div>

              <div>

                <span>
                  Recommended next action
                </span>

                <strong>
                  {recommendation.action}
                </strong>

              </div>

            </div>

            <div className="ai-recommendation-confidence">

              <span>
                Recommendation confidence
              </span>

              <strong
                className={`confidence-${recommendation.confidence.toLowerCase()}`}
              >
                {recommendation.confidence}
              </strong>

            </div>

          </div>

        </section>

      {/* ASK CAS AI */}
        <AskCasAI
          organizationId={organizationId}
        />

      </div>
    </DashboardLayout>
  );
}

export default AIInsights;