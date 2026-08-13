import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="global-footer">
      <div className="global-footer-inner">

        <div className="global-footer-brand">
          <strong>VOXA AI CRM</strong>
          <span>Intelligent Lead Management</span>
        </div>

        <div className="global-footer-links">
          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
          >
            Get started
          </button>
        </div>

      </div>

      <div className="global-footer-bottom">
        © {new Date().getFullYear()} VOXA AI CRM. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;