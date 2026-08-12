import { useState } from "react";
import {
  BrainCircuit,
  MessageCircle,
  X,
  Send,
} from "lucide-react";
import "./AskCasAI.css";

function AskCasAI({ organizationId = null }) {
  const [showCasAI, setShowCasAI] = useState(false);
  const [casQuestion, setCasQuestion] = useState("");
  const [casAnswer, setCasAnswer] = useState("");
  const [casLoading, setCasLoading] = useState(false);

  async function askCasAI(question) {
    if (!question.trim()) return;

    if (!organizationId) {
      setCasAnswer(
        "I can't access your CRM organization yet. Please refresh the page and try again."
      );
      return;
    }

    setCasLoading(true);
    setCasAnswer("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/cas-ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            organization_id: organizationId,
            question: question,
          }),
        }
      );

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

  return (
    <section className="ask-cas-ai-section">

      {/* HEADER */}
      <div className="ask-cas-ai-header">

        <div className="ask-cas-ai-header-left">

          <div className="ask-cas-ai-icon">
            <BrainCircuit size={23} />
          </div>

          <div>

            <div className="ask-cas-ai-label">
              CAS AI
            </div>

            <h2 className="ask-cas-ai-title">
              Ask CAS AI
            </h2>

          </div>

        </div>

        <div className="ask-cas-ai-badge">
          CRM Intelligence Assistant
        </div>

      </div>

      {/* DESCRIPTION */}
      <div className="ask-cas-ai-introduction">

        <div className="ask-cas-ai-introduction-icon">
          <MessageCircle size={21} />
        </div>

        <div>

          <strong className="ask-cas-ai-introduction-title">
            Want to understand something deeper?
          </strong>

          <p className="ask-cas-ai-introduction-text">
            Ask CAS about your leads, pipeline, sources,
            risks, or recommended actions.
          </p>

        </div>

      </div>

      {/* OPEN ASSISTANT */}
      <button
        type="button"
        className="ask-cas-ai-button"
        onClick={() => setShowCasAI(true)}
      >
        <MessageCircle size={17} />
        Ask CAS AI
      </button>

      {/* MODAL */}
      {showCasAI && (
        <div className="ask-cas-ai-modal-overlay">

          <div className="ask-cas-ai-modal">

            {/* MODAL HEADER */}
            <div className="ask-cas-ai-modal-header">

              <div className="ask-cas-ai-modal-brand">

                <div className="ask-cas-ai-modal-icon">
                  <BrainCircuit size={22} />
                </div>

                <div>

                  <div className="ask-cas-ai-modal-name">
                    CAS AI
                  </div>

                  <div className="ask-cas-ai-modal-description">
                    Your CRM Intelligence Assistant
                  </div>

                </div>

              </div>

              <button
                type="button"
                className="ask-cas-ai-close-button"
                onClick={() => setShowCasAI(false)}
                aria-label="Close CAS AI"
              >
                <X size={20} />
              </button>

            </div>

            {/* MODAL BODY */}
            <div className="ask-cas-ai-modal-body">

              <div className="ask-cas-ai-introduction">

                <div className="ask-cas-ai-introduction-icon">
                  <BrainCircuit size={21} />
                </div>

                <div>

                  <strong className="ask-cas-ai-introduction-title">
                    Hi, I'm CAS.
                  </strong>

                  <p className="ask-cas-ai-introduction-text">
                    I've analysed your CRM activity. Ask me about
                    your leads, pipeline, sources, or follow-up
                    priorities.
                  </p>

                </div>

              </div>

              {/* QUICK QUESTIONS */}
              <div className="ask-cas-ai-quick-questions">

                <button
                  type="button"
                  className="ask-cas-ai-question-button"
                  onClick={() => {
                    setCasQuestion(
                      "Who should I follow up with?"
                    );
                    askCasAI(
                      "Who should I follow up with?"
                    );
                  }}
                >
                  Who should I follow up with?
                </button>

                <button
                  type="button"
                  className="ask-cas-ai-question-button"
                  onClick={() => {
                    setCasQuestion(
                      "Which source performs best?"
                    );
                    askCasAI(
                      "Which source performs best?"
                    );
                  }}
                >
                  Which source performs best?
                </button>

                <button
                  type="button"
                  className="ask-cas-ai-question-button"
                  onClick={() => {
                    setCasQuestion(
                      "How is my pipeline?"
                    );
                    askCasAI(
                      "How is my pipeline?"
                    );
                  }}
                >
                  How is my pipeline?
                </button>

              </div>

              {/* LOADING */}
              {casLoading && (
                <div className="ask-cas-ai-loading">
                  CAS is analysing your CRM...
                </div>
              )}

              {/* RESPONSE */}
              {casAnswer && !casLoading && (
                <div className="ask-cas-ai-response">

                  <div className="ask-cas-ai-response-label">
                    <BrainCircuit size={16} />
                    CAS AI
                  </div>

                  <p>
                    {casAnswer}
                  </p>

                </div>
              )}

              {/* INPUT */}
              <div className="ask-cas-ai-input-wrapper">

                <input
                  type="text"
                  className="ask-cas-ai-input"
                  value={casQuestion}
                  onChange={(e) =>
                    setCasQuestion(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      askCasAI(casQuestion);
                    }
                  }}
                  placeholder="Ask CAS about your CRM..."
                />

                <button
                  type="button"
                  className="ask-cas-ai-send-button"
                  onClick={() =>
                    askCasAI(casQuestion)
                  }
                  disabled={casLoading}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>

              </div>

              <p className="ask-cas-ai-footer-note">
                CAS AI uses your CRM data to help you make
                better decisions.
              </p>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default AskCasAI;