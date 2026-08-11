import { useState } from "react";
import "./CasAIInsight.css";

import {
  BrainCircuit,
  Users,
  TrendingUp,
  ShieldCheck,
  MessageCircle,
  X,
  Send,
} from "lucide-react";

function CasAIInsight({
  leads = [],
  hotCount = 0,
  sources = [],
  organizationId = null,
}) {
  const [showCasAI, setShowCasAI] = useState(false);
  const [casQuestion, setCasQuestion] = useState("");
  const [casAnswer, setCasAnswer] = useState("");
  const [casLoading, setCasLoading] = useState(false);

  const totalLeads = leads.length;

  async function askCasAI(question) {
    if (!question.trim()) return;

    if (!organizationId) {
      setCasAnswer(
        "I can't access your CRM organization yet. Please refresh the dashboard and try again."
      );
      return;
    }

    setCasLoading(true);
    setCasAnswer("");

    try {
      const response = await fetch("http://127.0.0.1:8000/cas-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_id: organizationId,
          question: question,
        }),
      });

      if (!response.ok) {
        throw new Error("CAS AI request failed");
      }

      const data = await response.json();

      setCasAnswer(data.answer);
    } catch (error) {
      console.error("CAS AI error:", error);

      setCasAnswer(
        "I'm having trouble connecting to your CRM right now. Please make sure the backend is running and try again."
      );
    } finally {
      setCasLoading(false);
    }
  }

  // Find the lead source bringing in the most leads
  const highestLeadCount =
    sources.length > 0
      ? Math.max(...sources.map((source) => source.lead_count || 0))
      : 0;

  const topSources = sources.filter(
    (source) => source.lead_count === highestLeadCount
  );

  const topSource =
    topSources.length === 1
      ? topSources[0].source
      : topSources.length > 1
      ? "Multiple sources tied"
      : "No data";

  // Simple pipeline assessment
  let pipelineStatus = "Needs Attention";

  if (hotCount >= 3) {
    pipelineStatus = "Strong";
  } else if (hotCount >= 1) {
    pipelineStatus = "Healthy";
  }

  // Generate a simple recommendation from current CRM data
  let recommendation =
    "Continue following up with your newest leads.";

  if (hotCount > 0) {
    recommendation = `You have ${hotCount} high-intent ${
      hotCount === 1 ? "lead" : "leads"
    } ready for follow-up.`;
  } else if (totalLeads === 0) {
    recommendation =
      "Your CRM is ready. Start adding leads to generate AI recommendations.";
  } else {
    recommendation =
      "No hot leads yet. Focus on increasing engagement with your current leads.";
  }

  return (
    <section className="cas-ai-section">

      {/* Header */}
      <div className="cas-ai-header">

        <div className="cas-ai-header-left">

          <div className="cas-ai-icon">
            <BrainCircuit size={23} />
          </div>

          <div>
            <div className="cas-ai-label">
              CAS AI
            </div>

            <h2 className="cas-ai-title">
              I've analysed today's CRM activity.
            </h2>
          </div>

        </div>

        <div className="cas-ai-badge">
          AI CRM Assistant
        </div>

      </div>


      {/* Intelligence Cards */}
      <div className="cas-ai-intelligence-grid">

        {/* Active Leads */}
        <div className="cas-ai-intelligence-card">

          <div className="cas-ai-card-heading">
            <Users size={18} />
            <span>Active Leads</span>
          </div>

          <strong className="cas-ai-card-value">
            {totalLeads}
          </strong>

        </div>


        {/* Top Source */}
        <div className="cas-ai-intelligence-card">

          <div className="cas-ai-card-heading">
            <TrendingUp size={18} />
            <span>Top Source</span>
          </div>

          <strong className="cas-ai-card-value">
            {topSource}
          </strong>

        </div>


        {/* Pipeline */}
        <div className="cas-ai-intelligence-card">

          <div className="cas-ai-card-heading">
            <ShieldCheck size={18} />
            <span>Pipeline</span>
          </div>

          <strong className="cas-ai-card-value">
            {pipelineStatus}
          </strong>

        </div>

      </div>


      {/* Recommendation */}
      <div className="cas-ai-recommendation">

        <div className="cas-ai-recommendation-title">
          <BrainCircuit size={18} color="#2563eb" />
          <strong>CAS AI Recommendation</strong>
        </div>

        <p className="cas-ai-recommendation-text">
          {recommendation}
        </p>

      </div>


      {/* Ask CAS AI */}
      <button
        type="button"
        className="cas-ai-ask-button"
        onClick={() => setShowCasAI(true)}
      >
        <MessageCircle size={17} />
        Ask CAS AI
      </button>


      {/* CAS AI Assistant Modal */}
      {showCasAI && (
        <div className="cas-ai-modal-overlay">

          <div className="cas-ai-modal">

            {/* Modal Header */}
            <div className="cas-ai-modal-header">

              <div className="cas-ai-modal-brand">

                <div className="cas-ai-modal-icon">
                  <BrainCircuit size={22} />
                </div>

                <div>
                  <div className="cas-ai-modal-name">
                    CAS AI
                  </div>

                  <div className="cas-ai-modal-description">
                    Your CRM Intelligence Assistant
                  </div>
                </div>

              </div>


              <button
                type="button"
                className="cas-ai-close-button"
                onClick={() => setShowCasAI(false)}
                aria-label="Close CAS AI"
              >
                <X size={20} />
              </button>

            </div>


            {/* Modal Body */}
            <div className="cas-ai-modal-body">

              {/* Introduction */}
              <div className="cas-ai-introduction">

                <div className="cas-ai-introduction-icon">
                  <BrainCircuit size={21} />
                </div>

                <div>

                  <strong className="cas-ai-introduction-title">
                    Hi, I'm CAS.
                  </strong>

                  <p className="cas-ai-introduction-text">
                    I've analysed your CRM activity. Ask me about your
                    leads, pipeline, sources, or follow-up priorities.
                  </p>

                </div>

              </div>


              {/* Quick Questions */}
              <div className="cas-ai-quick-questions">

                <button
                  type="button"
                  className="cas-ai-question-button"
                  onClick={() => {
                    setCasQuestion("Who should I follow up with?");
                    askCasAI("Who should I follow up with?");
                  }}
                >
                  Who should I follow up with?
                </button>

                <button
                  type="button"
                  className="cas-ai-question-button"
                  onClick={() => {
                    setCasQuestion("Which source performs best?");
                    askCasAI("Which source performs best?");
                  }}
                >
                  Which source performs best?
                </button>

                <button
                  type="button"
                  className="cas-ai-question-button"
                  onClick={() => {
                    setCasQuestion("How is my pipeline?");
                    askCasAI("How is my pipeline?");
                  }}
                >
                  How is my pipeline?
                </button>

              </div>


              {/* Loading */}
              {casLoading && (
                <div className="cas-ai-loading">
                  CAS is analysing your CRM...
                </div>
              )}


              {/* CAS Response */}
              {casAnswer && !casLoading && (
                <div className="cas-ai-response">

                  <div className="cas-ai-response-label">
                    <BrainCircuit size={16} />
                    CAS AI
                  </div>

                  {casAnswer}

                </div>
              )}


              {/* Chat Input */}
              <div className="cas-ai-input-wrapper">

                <input
                  type="text"
                  className="cas-ai-input"
                  value={casQuestion}
                  onChange={(e) => setCasQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      askCasAI(casQuestion);
                    }
                  }}
                  placeholder="Ask CAS about your CRM..."
                />

                <button
                  type="button"
                  className="cas-ai-send-button"
                  onClick={() => askCasAI(casQuestion)}
                  disabled={casLoading}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>

              </div>


              {/* Footer */}
              <p className="cas-ai-footer-note">
                CAS AI uses your CRM data to help you make better decisions.
              </p>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default CasAIInsight;