import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-leaf">🌿</span>
          <span className="footer-brand-name">STMS</span>
        </div>
        <p className="footer-tagline">
          BALANCE • MINDFUL • CLARITY
        </p>
        <p className="footer-copy">
          <strong>School Timetable & Attendance System</strong> | © 2026 All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;