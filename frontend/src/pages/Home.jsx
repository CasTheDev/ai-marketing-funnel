import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  BarChart3,
  Users,
  Activity,
  Target,
  CheckCircle2,
} from "lucide-react";

import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-page">

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <header className="home-nav">

        <div className="home-nav-inner">

          <button
            type="button"
            className="home-logo"
            onClick={() => navigate("/")}
          >
            <span className="home-logo-icon">
              <BrainCircuit size={21} />
            </span>

            <span className="home-logo-text">
              <strong>VOXA</strong>
              <small>AI CRM</small>
            </span>
          </button>

          <nav className="home-nav-links">

            <a href="#features">
              Features
            </a>

            <a href="#cas-ai">
              CAS AI
            </a>

            <button
              type="button"
              className="home-nav-signin"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>

          </nav>

        </div>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="home-hero">

        <div className="home-hero-glow home-hero-glow-one" />
        <div className="home-hero-glow home-hero-glow-two" />

        <div className="home-hero-content">

          <div className="home-hero-badge">
            <BrainCircuit size={15} />
            Intelligent Lead Management
          </div>

          <h1>
            Turn your marketing leads into
            <span> actionable opportunities.</span>
          </h1>

          <p className="home-hero-description">
            VOXA AI CRM gives you one place to manage your leads,
            understand engagement, monitor your pipeline and make
            better follow-up decisions.
          </p>

          <div className="home-hero-actions">

            <button
              type="button"
              className="home-primary-button"
              onClick={() => navigate("/register")}
            >
              Get started
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="home-secondary-button"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>

          </div>

          <p className="home-hero-note">
            Built for businesses that want more from their leads.
          </p>

        </div>


        {/* HERO PRODUCT PREVIEW */}

        <div className="home-product-preview">

          <div className="home-preview-window">

            <div className="home-preview-topbar">

              <div className="home-preview-dots">
                <span />
                <span />
                <span />
              </div>

              <span>
                VOXA AI CRM
              </span>

            </div>

            <div className="home-preview-content">

              <div className="home-preview-heading">
                <div>
                  <span>CRM OVERVIEW</span>
                  <h3>Good morning</h3>
                </div>

                <div className="home-preview-ai">
                  <BrainCircuit size={15} />
                  CAS AI
                </div>
              </div>

              <div className="home-preview-stats">

                <div>
                  <span>Total Leads</span>
                  <strong>128</strong>
                </div>

                <div>
                  <span>Hot Leads</span>
                  <strong>14</strong>
                </div>

                <div>
                  <span>Pipeline</span>
                  <strong>Healthy</strong>
                </div>

              </div>

              <div className="home-preview-chart">

                <div className="home-preview-chart-header">
                  <span>Lead Activity</span>
                  <span>Last 7 days</span>
                </div>

                <div className="home-chart-bars">
                  <span style={{ height: "35%" }} />
                  <span style={{ height: "52%" }} />
                  <span style={{ height: "42%" }} />
                  <span style={{ height: "68%" }} />
                  <span style={{ height: "55%" }} />
                  <span style={{ height: "82%" }} />
                  <span style={{ height: "72%" }} />
                </div>

              </div>

              <div className="home-preview-recommendation">

                <div className="home-preview-recommendation-icon">
                  <BrainCircuit size={17} />
                </div>

                <div>
                  <span>CAS AI RECOMMENDATION</span>
                  <strong>
                    Prioritise your highest-intent leads.
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TRUST / VALUE STRIP
      ===================================================== */}

      <section className="home-value-strip">

        <div>
          <strong>Manage</strong>
          <span>your leads</span>
        </div>

        <div>
          <strong>Understand</strong>
          <span>your pipeline</span>
        </div>

        <div>
          <strong>Identify</strong>
          <span>your opportunities</span>
        </div>

        <div>
          <strong>Take</strong>
          <span>better action</span>
        </div>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        className="home-section home-features-section"
        id="features"
      >

        <div className="home-section-heading">

          <span className="home-section-eyebrow">
            THE CRM FOUNDATION
          </span>

          <h2>
            Everything you need to manage
            <span> your lead pipeline.</span>
          </h2>

          <p>
            VOXA AI CRM brings your core lead management and
            intelligence tools together in one workspace.
          </p>

        </div>


        <div className="home-feature-grid">

          <article className="home-feature-card">

            <div className="home-feature-icon">
              <Users size={21} />
            </div>

            <h3>
              Lead Management
            </h3>

            <p>
              Capture, organise and manage your customer leads
              from one central CRM workspace.
            </p>

            <div className="home-feature-check">
              <CheckCircle2 size={15} />
              Centralised lead records
            </div>

          </article>


          <article className="home-feature-card">

            <div className="home-feature-icon">
              <Activity size={21} />
            </div>

            <h3>
              Lead Intelligence
            </h3>

            <p>
              Understand engagement and identify the leads that
              deserve your attention.
            </p>

            <div className="home-feature-check">
              <CheckCircle2 size={15} />
              Behaviour and intent signals
            </div>

          </article>


          <article className="home-feature-card">

            <div className="home-feature-icon">
              <BarChart3 size={21} />
            </div>

            <h3>
              Analytics
            </h3>

            <p>
              See your lead sources, pipeline performance and
              activity through a clear CRM dashboard.
            </p>

            <div className="home-feature-check">
              <CheckCircle2 size={15} />
              Practical marketing insights
            </div>

          </article>


          <article className="home-feature-card">

            <div className="home-feature-icon">
              <Target size={21} />
            </div>

            <h3>
              Actionable Insights
            </h3>

            <p>
              Turn the information in your CRM into clear
              recommendations about where to focus next.
            </p>

            <div className="home-feature-check">
              <CheckCircle2 size={15} />
              Decision support
            </div>

          </article>

        </div>

      </section>


      {/* =====================================================
          CAS AI
      ===================================================== */}

      <section
        className="home-cas-section"
        id="cas-ai"
      >

        <div className="home-cas-glow" />

        <div className="home-cas-content">

          <div className="home-cas-icon">
            <BrainCircuit size={28} />
          </div>

          <span className="home-section-eyebrow">
            MEET CAS AI
          </span>

          <h2>
            Your CRM intelligence layer.
          </h2>

          <p>
            CAS AI works with the information inside VOXA AI CRM
            to help you understand your leads, pipeline and
            follow-up priorities.
          </p>

          <div className="home-cas-points">

            <div>
              <CheckCircle2 size={17} />
              Identify high-intent opportunities
            </div>

            <div>
              <CheckCircle2 size={17} />
              Understand your current pipeline
            </div>

            <div>
              <CheckCircle2 size={17} />
              Get practical next-step recommendations
            </div>

          </div>

        </div>

        <div className="home-cas-statement">

          <div className="home-cas-statement-line">
            VOXA AI CRM
          </div>

          <div className="home-cas-statement-arrow">
            +
          </div>

          <div className="home-cas-statement-line home-cas-statement-highlight">
            CAS AI
          </div>

          <p>
            The system + the intelligence layer.
          </p>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="home-section home-how-section">

        <div className="home-section-heading">

          <span className="home-section-eyebrow">
            HOW IT WORKS
          </span>

          <h2>
            From lead data to
            <span> better decisions.</span>
          </h2>

        </div>


        <div className="home-steps">

          <div className="home-step">

            <span>01</span>

            <div>
              <h3>
                Capture
              </h3>

              <p>
                Bring your leads into one organised CRM workspace.
              </p>
            </div>

          </div>


          <div className="home-step">

            <span>02</span>

            <div>
              <h3>
                Understand
              </h3>

              <p>
                Track engagement and identify meaningful intent signals.
              </p>
            </div>

          </div>


          <div className="home-step">

            <span>03</span>

            <div>
              <h3>
                Act
              </h3>

              <p>
                Use your CRM insights to prioritise your next action.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="home-final-cta">

        <div className="home-final-cta-content">

          <span className="home-section-eyebrow">
            READY TO GET STARTED?
          </span>

          <h2>
            Take control of your lead pipeline.
          </h2>

          <p>
            Start managing your leads with VOXA AI CRM.
          </p>

          <button
            type="button"
            className="home-primary-button home-final-button"
            onClick={() => navigate("/register")}
          >
            Get started
            <ArrowRight size={18} />
          </button>

        </div>

      </section>


      <Footer />

    </main>
  );
}

export default Home;