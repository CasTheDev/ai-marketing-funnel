import "./VexaHeader.css";
import React from "react";

function VexaHeader({
  title,
  heroImage,
}) {
  return (
    <div className="vexa-header">

      {/* LEFT SIDE */}
      <div className="vexa-left">

        <h1 className="vexa-title">
          {title}
        </h1>

        <div className="vexa-message">

          <p className="vexa-greeting-message">
            Here's your CRM summary for today.
          </p>

          <p className="vexa-text">
            I've reviewed today's CRM activity.
          </p>

          <p className="vexa-text">
            You have <strong>4 high-value leads</strong> ready for follow-up.
          </p>

          <p className="vexa-text">
            Your pipeline remains healthy and conversion performance is improving.
          </p>

          <p className="vexa-question">
            What would you like to do next?
          </p>

          <div className="vexa-buttons">

            <button className="vexa-primary">
              Review Leads
            </button>

            <button className="vexa-secondary">
              Generate AI Report
            </button>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="vexa-image-container">

        <img
          src={heroImage}
          alt="VEXA AI Assistant"
          className="vexa-image"
        />

      </div>

    </div>
  );
}

export default VexaHeader;