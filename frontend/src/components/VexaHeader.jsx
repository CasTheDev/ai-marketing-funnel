import { useNavigate } from "react-router-dom";
import "./VexaHeader.css";
import React, { useState } from "react";
import jsPDF from "jspdf";

function VexaHeader({
  title,
  heroImage,
  leads = [],
  hotCount = 0,
  sources = [],
}) {
  const navigate = useNavigate();

  const [showReport, setShowReport] = useState(false);

  // =====================================================
  // V1 CRM REPORT ENGINE
  // =====================================================

  function generateReport() {
    const totalLeads = leads.length;

    const hotLeads = leads.filter(
      (lead) =>
        Number(lead.score || lead.lead_score || 0) >= 50
    );

    const warmLeads = leads.filter((lead) => {
      const score = Number(
        lead.score || lead.lead_score || 0
      );

      return score >= 10 && score < 50;
    });

    const coldLeads = leads.filter((lead) => {
      const score = Number(
        lead.score || lead.lead_score || 0
      );

      return score < 10;
    });

    const scores = leads
      .map((lead) =>
        Number(
          lead.score || lead.lead_score || 0
        )
      )
      .filter((score) => !Number.isNaN(score));

    const averageScore =
      scores.length > 0
        ? Math.round(
            scores.reduce(
              (total, score) => total + score,
              0
            ) / scores.length
          )
        : 0;

    // -----------------------------------------------------
    // Determine strongest source
    // -----------------------------------------------------

    let topSource = "No data available";

    if (sources && sources.length > 0) {
      const sortedSources = [...sources].sort(
        (a, b) =>
          Number(b.count || 0) -
          Number(a.count || 0)
      );

      if (sortedSources[0]) {
        topSource =
          sortedSources[0].source ||
          sortedSources[0].name ||
          "Unknown";
      }
    }

    // -----------------------------------------------------
    // Pipeline assessment
    // -----------------------------------------------------

    let pipelineStatus = "Needs attention";

    if (totalLeads === 0) {
      pipelineStatus = "No lead data";
    } else if (hotLeads.length >= 3) {
      pipelineStatus = "Strong";
    } else if (hotLeads.length >= 1) {
      pipelineStatus = "Healthy";
    } else if (warmLeads.length > 0) {
      pipelineStatus = "Developing";
    }

    // -----------------------------------------------------
    // Recommendations
    // -----------------------------------------------------

    const recommendations = [];

    if (hotLeads.length > 0) {
      recommendations.push(
        `Prioritise follow-up with your ${hotLeads.length} high-intent ${
          hotLeads.length === 1 ? "lead" : "leads"
        }.`
      );
    }

    if (warmLeads.length > 0) {
      recommendations.push(
        `Continue nurturing ${warmLeads.length} warm ${
          warmLeads.length === 1 ? "lead" : "leads"
        } to increase conversion potential.`
      );
    }

    if (coldLeads.length > 0) {
      recommendations.push(
        `Review ${coldLeads.length} cold ${
          coldLeads.length === 1 ? "lead" : "leads"
        } and determine whether additional engagement is required.`
      );
    }

    if (totalLeads === 0) {
      recommendations.push(
        "Start adding leads to your CRM to begin generating pipeline intelligence."
      );
    }

    if (
      totalLeads > 0 &&
      hotLeads.length === 0 &&
      warmLeads.length === 0
    ) {
      recommendations.push(
        "Focus on increasing engagement signals across your current leads."
      );
    }

    setShowReport({
      totalLeads,
      hotLeads: hotLeads.length,
      warmLeads: warmLeads.length,
      coldLeads: coldLeads.length,
      averageScore,
      topSource,
      pipelineStatus,
      recommendations,
    });
  }

  // =====================================================
  // DOWNLOAD V1 CRM REPORT AS PDF
  // =====================================================

  function downloadReport() {
    if (!showReport) return;

    const doc = new jsPDF();

    const generatedAt = new Date().toLocaleString();

    // -----------------------------------------------------
    // Header
    // -----------------------------------------------------

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("VOXA AI CRM", 20, 25);

    doc.setFontSize(16);
    doc.text("Lead Intelligence Report", 20, 38);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Generated: ${generatedAt}`,
      20,
      47
    );

    doc.line(20, 54, 190, 54);

    // -----------------------------------------------------
    // CRM Overview
    // -----------------------------------------------------

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("CRM Overview", 20, 68);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(
      `Total Leads: ${showReport.totalLeads}`,
      20,
      80
    );

    doc.text(
      `Hot Leads: ${showReport.hotLeads}`,
      20,
      89
    );

    doc.text(
      `Warm Leads: ${showReport.warmLeads}`,
      20,
      98
    );

    doc.text(
      `Cold Leads: ${showReport.coldLeads}`,
      20,
      107
    );

    // -----------------------------------------------------
    // Pipeline Analysis
    // -----------------------------------------------------

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Pipeline Analysis", 20, 124);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(
      `Pipeline Status: ${showReport.pipelineStatus}`,
      20,
      136
    );

    doc.text(
      `Average Lead Score: ${showReport.averageScore}`,
      20,
      145
    );

    doc.text(
      `Leading Source: ${showReport.topSource}`,
      20,
      154
    );

    // -----------------------------------------------------
    // Recommended Actions
    // -----------------------------------------------------

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(
      "Recommended Actions",
      20,
      172
    );

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    let yPosition = 184;

    showReport.recommendations.forEach(
      (recommendation, index) => {
        const lines = doc.splitTextToSize(
          `${index + 1}. ${recommendation}`,
          165
        );

        doc.text(
          lines,
          20,
          yPosition
        );

        yPosition +=
          lines.length * 7 + 4;
      }
    );

    // -----------------------------------------------------
    // Footer
    // -----------------------------------------------------

    doc.setFontSize(9);
    doc.setTextColor(
      120,
      120,
      120
    );

    doc.text(
      "VOXA AI CRM • V1 CRM Report",
      20,
      285
    );

    doc.text(
      "Generated from current CRM data.",
      20,
      291
    );

    // -----------------------------------------------------
    // Save PDF
    // -----------------------------------------------------

    doc.save(
      "VOXA-AI-CRM-Lead-Intelligence-Report.pdf"
    );
  }

  return (
    <>
      <div className="vexa-header">

        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <div className="vexa-left">

          <h1 className="vexa-title">
            {title}
          </h1>

          <div className="vexa-message">

            <p className="vexa-greeting-message">
              Here's what's happening in your CRM today.
            </p>

            <p className="vexa-text">
              You have{" "}
              <strong>
                {hotCount} high-value{" "}
                {hotCount === 1
                  ? "lead"
                  : "leads"}
              </strong>{" "}
              ready for follow-up.
            </p>

            <p className="vexa-text">
              {leads.length > 0
                ? `Your CRM currently contains ${leads.length} ${
                    leads.length === 1
                      ? "lead"
                      : "leads"
                  }.`
                : "Your CRM is ready for your first leads."}
            </p>

            <p className="vexa-question">
              What would you like to do next?
            </p>

            <div className="vexa-buttons">

              <button
                className="vexa-primary"
                onClick={() =>
                  navigate("/leads")
                }
              >
                Review Leads
              </button>

              <button
                className="vexa-secondary"
                onClick={generateReport}
              >
                Generate AI Report
              </button>

            </div>

          </div>

        </div>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <div className="vexa-image-container">

          <img
            src={heroImage}
            alt="VEXA AI Assistant"
            className="vexa-image"
          />

        </div>

      </div>

      {/* =====================================================
          V1 REPORT MODAL
      ===================================================== */}

      {showReport && (
        <div
          className="vexa-report-overlay"
          onClick={() =>
            setShowReport(false)
          }
        >

          <div
            className="vexa-report-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =================================================
                REPORT HEADER
            ================================================= */}

            <div className="vexa-report-header">

              <div>

                <span className="vexa-report-eyebrow">
                  CAS AI · CRM ANALYSIS
                </span>

                <h2>
                  Lead Intelligence Report
                </h2>

                <p>
                  Generated from your current CRM data.
                </p>

              </div>

              <button
                className="vexa-report-close"
                onClick={() =>
                  setShowReport(false)
                }
              >
                ×
              </button>

            </div>

            {/* =================================================
                KPI GRID
            ================================================= */}

            <div className="vexa-report-grid">

              <div className="vexa-report-card">

                <span>
                  Total Leads
                </span>

                <strong>
                  {showReport.totalLeads}
                </strong>

              </div>

              <div className="vexa-report-card">

                <span>
                  Hot Leads
                </span>

                <strong>
                  {showReport.hotLeads}
                </strong>

              </div>

              <div className="vexa-report-card">

                <span>
                  Warm Leads
                </span>

                <strong>
                  {showReport.warmLeads}
                </strong>

              </div>

              <div className="vexa-report-card">

                <span>
                  Cold Leads
                </span>

                <strong>
                  {showReport.coldLeads}
                </strong>

              </div>

            </div>

            {/* =================================================
                PIPELINE
            ================================================= */}

            <div className="vexa-report-section">

              <div>

                <span className="vexa-report-label">
                  Pipeline status
                </span>

                <strong>
                  {showReport.pipelineStatus}
                </strong>

              </div>

              <div>

                <span className="vexa-report-label">
                  Average lead score
                </span>

                <strong>
                  {showReport.averageScore}
                </strong>

              </div>

              <div>

                <span className="vexa-report-label">
                  Leading source
                </span>

                <strong>
                  {showReport.topSource}
                </strong>

              </div>

            </div>

            {/* =================================================
                RECOMMENDATIONS
            ================================================= */}

            <div className="vexa-report-recommendations">

              <h3>
                Recommended actions
              </h3>

              {showReport.recommendations.map(
                (
                  recommendation,
                  index
                ) => (

                  <div
                    className="vexa-report-recommendation"
                    key={index}
                  >

                    <span>
                      {index + 1}
                    </span>

                    <p>
                      {recommendation}
                    </p>

                  </div>

                )
              )}

            </div>

            {/* =================================================
                REPORT FOOTER
            ================================================= */}

            <div className="vexa-report-footer">

              <span>
                V1 CRM Report
              </span>

              <div className="vexa-report-footer-actions">

                <button
                  className="vexa-report-download"
                  onClick={downloadReport}
                >
                  Download PDF
                </button>

                <button
                  className="vexa-report-close-button"
                  onClick={() =>
                    setShowReport(false)
                  }
                >
                  Close report
                </button>

              </div>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default VexaHeader;