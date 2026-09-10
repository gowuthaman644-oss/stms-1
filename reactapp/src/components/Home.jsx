import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Building2,
  Sparkles,
  ArrowRight,
  Lock,
  Layers,
  Activity,
  Check,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const getDashboardPath = () => {
    if (!currentUser) return "/login";
    const role = (currentUser.role || "").toUpperCase();
    if (role === "TEACHER") return "/teacher";
    if (role === "STUDENT") return "/student";
    if (role === "PARENT") return "/parent";
    return "/admin";
  };

  const getRoleTitle = () => {
    if (!currentUser) return "User";
    const role = (currentUser.role || "").toUpperCase();
    if (role === "TEACHER") return "Teacher Portal";
    if (role === "STUDENT") return "Student Portal";
    if (role === "PARENT") return "Parent Portal";
    return "Admin Dashboard";
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="landing-page">
      {/* ============================================================
          1. HERO SECTION
          ============================================================ */}
      <section className="landing-hero-section">
        <div className="landing-hero-container">
          {/* Left Column: Text & CTAs */}
          <motion.div
            className="hero-left"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="hero-badge">
              <span className="badge-sparkle">🌿</span>
              <span>STMS • School Timetable Management System</span>
            </div>

            <h1 className="hero-headline">
              Smart School Scheduling, <span className="text-highlight">Simplified.</span>
            </h1>

            <p className="hero-description">
              Manage timetables, attendance, academic events and classroom resources in one simple platform.
            </p>

            <div className="hero-cta-group">
              {isAuthenticated ? (
                <button
                  type="button"
                  className="btn-hero-primary"
                  onClick={() => navigate(getDashboardPath())}
                >
                  <Sparkles size={16} />
                  <span>Go to {getRoleTitle()}</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn-hero-primary"
                    onClick={() => navigate("/register")}
                  >
                    <UserPlus size={16} />
                    <span>Get Started</span>
                  </button>

                  <button
                    type="button"
                    className="btn-hero-secondary"
                    onClick={() => navigate("/login")}
                  >
                    <LogIn size={16} />
                    <span>Sign In</span>
                  </button>
                </>
              )}
            </div>

            <div className="hero-trust-bar">
              <div className="trust-item">
                <Check size={14} color="var(--sage-primary)" />
                <span>3-Tier Conflict Check</span>
              </div>
              <div className="trust-item">
                <Check size={14} color="var(--sage-primary)" />
                <span>Role-Based Portals</span>
              </div>
              <div className="trust-item">
                <Check size={14} color="var(--sage-primary)" />
                <span>Stateless JWT Security</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Stylized UI Preview Card */}
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="ui-mockup-card">
              {/* Mockup Header */}
              <div className="mockup-header">
                <div className="mockup-window-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <div className="mockup-title">
                  <span>Class 10-A • Live Timetable Preview</span>
                </div>
                <div className="mockup-status-badge">
                  <span className="status-indicator"></span>
                  <span>Active Term</span>
                </div>
              </div>

              {/* Mockup Timetable Slots */}
              <div className="mockup-body">
                <div className="mockup-slot">
                  <div className="slot-time">
                    <Clock size={12} />
                    <span>08:30 - 09:15</span>
                  </div>
                  <div className="slot-details">
                    <div className="slot-subject">Mathematics</div>
                    <div className="slot-teacher">Priya Krishnan</div>
                  </div>
                  <span className="mockup-badge badge-room">Room 101</span>
                </div>

                <div className="mockup-slot active-period">
                  <div className="slot-time">
                    <Clock size={12} />
                    <span>09:15 - 10:00</span>
                  </div>
                  <div className="slot-details">
                    <div className="slot-subject">Science Lab</div>
                    <div className="slot-teacher">Suresh Kumar</div>
                  </div>
                  <span className="mockup-badge badge-lab">Science Lab 204</span>
                </div>

                <div className="mockup-slot">
                  <div className="slot-time">
                    <Clock size={12} />
                    <span>10:15 - 11:00</span>
                  </div>
                  <div className="slot-details">
                    <div className="slot-subject">English Literature</div>
                    <div className="slot-teacher">Meena Iyer</div>
                  </div>
                  <span className="mockup-badge badge-room">Room 102</span>
                </div>

                <div className="mockup-slot">
                  <div className="slot-time">
                    <Clock size={12} />
                    <span>11:00 - 11:45</span>
                  </div>
                  <div className="slot-details">
                    <div className="slot-subject">Computer Science</div>
                    <div className="slot-teacher">Arvind Raj</div>
                  </div>
                  <span className="mockup-badge badge-lab">Comp Lab 302</span>
                </div>
              </div>

              {/* Mockup Footer Chips */}
              <div className="mockup-footer">
                <div className="mockup-stat">
                  <Activity size={13} color="var(--sage-primary)" />
                  <span>Conflict Validation: <strong>0 Overlaps</strong></span>
                </div>
                <div className="mockup-stat">
                  <CheckCircle2 size={13} color="var(--sage-primary)" />
                  <span>Daily Attendance: <strong>96.4%</strong></span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          2. USER ROLES SECTION
          ============================================================ */}
      <section className="landing-roles-section">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-kicker">Role-Based Access Control</span>
            <h2 className="section-title">Designed for Every Academic Stakeholder</h2>
            <p className="section-subtitle">
              Seamless access tailored with secure permissions for administrators, faculty, students, and parents.
            </p>
          </div>

          <motion.div
            className="roles-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={staggerContainer}
          >
            {/* Admin Role */}
            <motion.div className="role-card" variants={fadeInUp}>
              <div className="role-icon-box">👑</div>
              <h3 className="role-name">Admin</h3>
              <p className="role-desc">Manage school operations, schedules, facilities, and academic calendar.</p>
              <div className="role-tag">Full Governance</div>
            </motion.div>

            {/* Teacher Role */}
            <motion.div className="role-card" variants={fadeInUp}>
              <div className="role-icon-box">👩‍🏫</div>
              <h3 className="role-name">Teacher</h3>
              <p className="role-desc">Manage classes, teaching schedules, and record student attendance in real time.</p>
              <div className="role-tag">Faculty Portal</div>
            </motion.div>

            {/* Student Role */}
            <motion.div className="role-card" variants={fadeInUp}>
              <div className="role-icon-box">🎓</div>
              <h3 className="role-name">Student</h3>
              <p className="role-desc">View personal cohort timetable, period locations, and attendance percentages.</p>
              <div className="role-tag">Learner Hub</div>
            </motion.div>

            {/* Parent Role */}
            <motion.div className="role-card" variants={fadeInUp}>
              <div className="role-icon-box">👨‍👩‍👧</div>
              <h3 className="role-name">Parent</h3>
              <p className="role-desc">Monitor child's academic schedule, attendance status, and institutional events.</p>
              <div className="role-tag">Family Portal</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          3. FEATURE CARDS SECTION
          ============================================================ */}
      <section id="features" className="landing-features-section">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-kicker">Comprehensive Capabilities</span>
            <h2 className="section-title">Everything You Need for School Scheduling</h2>
            <p className="section-subtitle">
              Powerful, reliable scheduling tools built for institutional precision and ease of use.
            </p>
          </div>

          <motion.div
            className="features-grid-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={staggerContainer}
          >
            {/* Card 1: Timetable */}
            <motion.div className="feature-box" variants={fadeInUp}>
              <div className="feature-icon-wrapper">
                <Calendar size={26} color="var(--sage-primary)" />
              </div>
              <h3 className="feature-heading">Timetable</h3>
              <p className="feature-text">
                Create, update and manage school schedules with conflict checking.
              </p>
              <div className="feature-highlight">
                <span>Multi-criteria Day & Teacher Filters</span>
              </div>
            </motion.div>

            {/* Card 2: Attendance */}
            <motion.div className="feature-box" variants={fadeInUp}>
              <div className="feature-icon-wrapper">
                <CheckCircle2 size={26} color="var(--sage-primary)" />
              </div>
              <h3 className="feature-heading">Attendance</h3>
              <p className="feature-text">
                Record attendance and monitor student attendance percentages.
              </p>
              <div className="feature-highlight">
                <span>Automated &lt;75% Attendance Warning</span>
              </div>
            </motion.div>

            {/* Card 3: Academic Calendar */}
            <motion.div className="feature-box" variants={fadeInUp}>
              <div className="feature-icon-wrapper">
                <Clock size={26} color="var(--sage-primary)" />
              </div>
              <h3 className="feature-heading">Academic Calendar</h3>
              <p className="feature-text">
                Keep track of examinations, meetings and important school events.
              </p>
              <div className="feature-highlight">
                <span>Holidays & Term Dates Synchronization</span>
              </div>
            </motion.div>

            {/* Card 4: Resources */}
            <motion.div className="feature-box" variants={fadeInUp}>
              <div className="feature-icon-wrapper">
                <Building2 size={26} color="var(--sage-primary)" />
              </div>
              <h3 className="feature-heading">Resources</h3>
              <p className="feature-text">
                Manage classrooms, facilities and room availability.
              </p>
              <div className="feature-highlight">
                <span>Real-Time Facility Booking & Release</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================
          4. HOW STMS WORKS SECTION (3 Simple Steps)
          ============================================================ */}
      <section id="how-it-works" className="landing-workflow-section">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-kicker">Intuitive Workflow</span>
            <h2 className="section-title">How STMS Works</h2>
            <p className="section-subtitle">
              A straightforward process designed for seamless coordination across the entire school.
            </p>
          </div>

          <div className="workflow-steps-grid">
            {/* Step 1 */}
            <motion.div
              className="workflow-step-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="step-number-badge">01</div>
              <div className="step-icon-circle">
                <Lock size={20} color="var(--sage-primary)" />
              </div>
              <h3 className="step-title">Sign In</h3>
              <p className="step-description">
                Access STMS using your secure account with JWT authentication.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="workflow-step-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="step-number-badge">02</div>
              <div className="step-icon-circle">
                <Layers size={20} color="var(--sage-primary)" />
              </div>
              <h3 className="step-title">Manage</h3>
              <p className="step-description">
                Manage schedules, attendance, events and resources with real-time conflict checking.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="workflow-step-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="step-number-badge">03</div>
              <div className="step-icon-circle">
                <Activity size={20} color="var(--sage-primary)" />
              </div>
              <h3 className="step-title">Monitor</h3>
              <p className="step-description">
                View academic information according to your role with clean, responsive dashboards.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. CALL TO ACTION SECTION
          ============================================================ */}
      <section className="landing-cta-section">
        <div className="section-container">
          <motion.div
            className="cta-card"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="cta-content">
              <span className="cta-badge">🌟 Ready to Get Started?</span>
              <h2 className="cta-heading">Ready to manage your school timetable?</h2>
              <p className="cta-description">
                Access STMS and manage your academic activities from one place.
              </p>
              <div className="cta-button-wrapper">
                {isAuthenticated ? (
                  <button
                    type="button"
                    className="btn-cta-primary"
                    onClick={() => navigate(getDashboardPath())}
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-cta-primary"
                    onClick={() => navigate("/register")}
                  >
                    <span>Get Started</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;