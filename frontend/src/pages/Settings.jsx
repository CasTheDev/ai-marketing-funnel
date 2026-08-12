import { useEffect, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  Building2,
  Link2,
  UserCheck,
  BrainCircuit,
  Bell,
  ListFilter,
  LockKeyhole,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import DashboardLayout from "../components/DashboardLayout";
import "./Settings.css";

function Settings() {
  const { user, loading } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [organizationId, setOrganizationId] = useState(null);
const [organizationLoading, setOrganizationLoading] = useState(true);

const [preferences, setPreferences] = useState({
  casAiRecommendations: true,
  highIntentAlerts: true,
  emailNotifications: true,
  defaultLeadView: "Highest Score",
});

function togglePreference(key) {
  setPreferences((current) => ({
    ...current,
    [key]: !current[key],
  }));
}

  useEffect(() => {
    if (!user) return;

    setProfile({
      name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "",
      email: user.email || "",
    });
  }, [user]);

  useEffect(() => {
  async function getOrganization() {
    if (!user) {
      setOrganizationLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("organization_users")
      .select("organization_id")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Settings organization lookup error:", error);
      setOrganizationLoading(false);
      return;
    }

    if (data) {
      setOrganizationId(data.organization_id);
    }

    setOrganizationLoading(false);
  }

  getOrganization();
}, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="settings-page">
          <div className="settings-loading">
            Loading settings...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="settings-page">

        {/* HEADER */}
        <div className="settings-header">

          <div>
            <p className="settings-eyebrow">
              VOXA AI CRM
            </p>

            <h1 className="settings-title">
              Settings
            </h1>

            <p className="settings-subtitle">
              Manage your account and CRM preferences.
            </p>
          </div>

        </div>


        {/* PROFILE */}
        <section className="settings-section">

          <div className="settings-section-heading">

            <div className="settings-section-icon">
              <User size={20} />
            </div>

            <div>
              <h2>
                My Profile
              </h2>

              <p>
                Your personal account information.
              </p>
            </div>

          </div>


          <div className="settings-card">

            {/* NAME */}
            <div className="settings-field">

              <div className="settings-field-icon">
                <User size={18} />
              </div>

              <div className="settings-field-content">

                <span className="settings-field-label">
                  Name
                </span>

                <strong className="settings-field-value">
                  {profile.name || "Not set"}
                </strong>

              </div>

            </div>


            {/* EMAIL */}
            <div className="settings-field">

              <div className="settings-field-icon">
                <Mail size={18} />
              </div>

              <div className="settings-field-content">

                <span className="settings-field-label">
                  Email address
                </span>

                <strong className="settings-field-value">
                  {profile.email || "Not available"}
                </strong>

              </div>

            </div>


            {/* ACCOUNT STATUS */}
            <div className="settings-field">

              <div className="settings-field-icon">
                <ShieldCheck size={18} />
              </div>

              <div className="settings-field-content">

                <span className="settings-field-label">
                  Account status
                </span>

                <strong className="settings-status">
                  Active
                </strong>

              </div>

            </div>

          </div>

        </section>
         {/* WORKSPACE */}
        <section className="settings-section">

          <div className="settings-section-heading">

            <div className="settings-section-icon">
              <Building2 size={20} />
            </div>

            <div>
              <h2>
                Workspace
              </h2>

              <p>
                The VOXA AI CRM workspace you're currently connected to.
              </p>
            </div>

          </div>


          <div className="settings-card">

            {/* WORKSPACE NAME */}
            <div className="settings-field">

              <div className="settings-field-icon">
                <Building2 size={18} />
              </div>

              <div className="settings-field-content">

                <span className="settings-field-label">
                  Workspace
                </span>

                <strong className="settings-field-value">
                  VOXA AI CRM
                </strong>

              </div>

            </div>


            {/* ORGANIZATION ID */}
            <div className="settings-field">

              <div className="settings-field-icon">
                <Link2 size={18} />
              </div>

              <div className="settings-field-content">

                <span className="settings-field-label">
                  Organization ID
                </span>

                <strong className="settings-field-value">
                  {organizationLoading
                    ? "Loading..."
                    : organizationId || "Not available"}
                </strong>

              </div>

            </div>


            {/* ACCESS */}
            <div className="settings-field">

              <div className="settings-field-icon">
                <UserCheck size={18} />
              </div>

              <div className="settings-field-content">

                <span className="settings-field-label">
                  Access
                </span>

                <strong className="settings-status">
                  Administrator
                </strong>

              </div>

            </div>

          </div>

        </section>
         {/* ACCOUNT PREFERENCES */}
        <section className="settings-section">

          <div className="settings-section-heading">

            <div className="settings-section-icon">
              <BrainCircuit size={20} />
            </div>

            <div>
              <h2>
                Account Preferences
              </h2>

              <p>
                Control how VOXA AI CRM and CAS AI work for you.
              </p>
            </div>

          </div>


          <div className="settings-card">


            {/* CAS AI RECOMMENDATIONS */}
            <div className="settings-preference-row">

              <div className="settings-preference-icon">
                <BrainCircuit size={19} />
              </div>

              <div className="settings-preference-content">

                <strong>
                  CAS AI Recommendations
                </strong>

                <span>
                  Show CAS AI recommendations throughout your CRM.
                </span>

              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  preferences.casAiRecommendations
                    ? "settings-toggle-active"
                    : ""
                }`}
                onClick={() =>
                  togglePreference("casAiRecommendations")
                }
                aria-pressed={preferences.casAiRecommendations}
              >
                <span className="settings-toggle-knob" />
              </button>

            </div>


            {/* HIGH INTENT ALERTS */}
            <div className="settings-preference-row">

              <div className="settings-preference-icon">
                <Bell size={19} />
              </div>

              <div className="settings-preference-content">

                <strong>
                  High-Intent Lead Alerts
                </strong>

                <span>
                  Notify me when a lead becomes high-intent.
                </span>

              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  preferences.highIntentAlerts
                    ? "settings-toggle-active"
                    : ""
                }`}
                onClick={() =>
                  togglePreference("highIntentAlerts")
                }
                aria-pressed={preferences.highIntentAlerts}
              >
                <span className="settings-toggle-knob" />
              </button>

            </div>


            {/* EMAIL NOTIFICATIONS */}
            <div className="settings-preference-row">

              <div className="settings-preference-icon">
                <Mail size={19} />
              </div>

              <div className="settings-preference-content">

                <strong>
                  Email Notifications
                </strong>

                <span>
                  Receive important CRM notifications by email.
                </span>

              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  preferences.emailNotifications
                    ? "settings-toggle-active"
                    : ""
                }`}
                onClick={() =>
                  togglePreference("emailNotifications")
                }
                aria-pressed={preferences.emailNotifications}
              >
                <span className="settings-toggle-knob" />
              </button>

            </div>


            {/* DEFAULT LEAD VIEW */}
            <div className="settings-preference-row">

              <div className="settings-preference-icon">
                <ListFilter size={19} />
              </div>

              <div className="settings-preference-content">

                <strong>
                  Default Lead View
                </strong>

                <span>
                  Choose how your leads are ordered when you open the Leads page.
                </span>

              </div>

              <select
                className="settings-select"
                value={preferences.defaultLeadView}
                onChange={(e) =>
                  setPreferences((current) => ({
                    ...current,
                    defaultLeadView: e.target.value,
                  }))
                }
              >
                <option value="Highest Score">
                  Highest Score
                </option>

                <option value="Lowest Score">
                  Lowest Score
                </option>

                <option value="Name A-Z">
                  Name A-Z
                </option>

                <option value="Company Name">
                  Company Name
                </option>
              </select>

            </div>


          </div>

        </section>
         {/* SECURITY & ACCOUNT */}
        <section className="settings-section">

          <div className="settings-section-heading">

            <div className="settings-section-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2>
                Security & Account
              </h2>

              <p>
                Manage your account security and access to VOXA AI CRM.
              </p>
            </div>

          </div>


          <div className="settings-card">

            {/* AUTHENTICATION */}
            <div className="settings-field">

              <div className="settings-field-icon">
                <LockKeyhole size={18} />
              </div>

              <div className="settings-field-content">

                <span className="settings-field-label">
                  Authentication
                </span>

                <strong className="settings-field-value">
                  Secured by Supabase
                </strong>

              </div>

            </div>


            {/* ACCOUNT STATUS */}
            <div className="settings-field">

              <div className="settings-field-icon">
                <ShieldCheck size={18} />
              </div>

              <div className="settings-field-content">

                <span className="settings-field-label">
                  Account status
                </span>

                <strong className="settings-status">
                  Active
                </strong>

              </div>

            </div>


            {/* SIGN OUT */}
            <div className="settings-field">

              <div className="settings-field-icon settings-danger-icon">
                <LogOut size={18} />
              </div>

              <div className="settings-field-content">

                <span className="settings-field-label">
                  Sign out
                </span>

                <span>
                  Sign out of your VOXA AI CRM account on this device.
                </span>

              </div>

              <button
                type="button"
                className="settings-signout-button"
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
              >
                Sign out
              </button>

            </div>

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}

export default Settings;
