import { jsPDF } from "jspdf";
import { CourseContentDetail, CourseModule } from "../data/courseContentData";

/**
 * Helper to ensure text wrapping and automatic pagination in jsPDF
 */
function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  bottomMargin: number = 275
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  for (let i = 0; i < lines.length; i++) {
    if (y > bottomMargin) {
      doc.addPage();
      y = 20;
    }
    doc.text(lines[i], x, y);
    y += lineHeight;
  }
  return y;
}

/**
 * Adds page numbering and standard statutory footer to all pages
 */
function addFootersAndHeaders(doc: jsPDF, title: string) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Header rule & micro-text on pages > 1
    if (i > 1) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("StatKarmayogi · National Statistical Systems Training Academy (NSSTA)", 15, 10);
      doc.text(title.slice(0, 45) + (title.length > 45 ? "…" : ""), 195, 10, { align: "right" });
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(15, 12, 195, 12);
    }

    // Footer rule
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(15, 284, 195, 284);

    // Footer text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(
      "Official Curriculum Document · MoSPI / iGOT Karmayogi Accredited · ISS & SSS Cadre Training",
      15,
      289
    );

    doc.setFont("helvetica", "bold");
    doc.text(`Page ${i} of ${pageCount}`, 195, 289, { align: "right" });
  }
}

/**
 * Generates an official, publication-quality Course Syllabus PDF for any of the 50 courses.
 */
export function generateCourseSyllabusPdf(course: CourseContentDetail) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const contentWidth = 180;
  const leftMargin = 15;
  let y = 16;

  // --- Top Decorative Header Bar ---
  doc.setFillColor(15, 39, 68); // #0F2744 deep navy
  doc.rect(0, 0, pageWidth, 5, "F");

  // --- Government & Institution Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 39, 68);
  doc.text("STATKARMAYOGI COMPETENCY INTELLIGENCE PLATFORM", leftMargin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Ministry of Statistics & Programme Implementation (MoSPI) · NSSTA & iGOT Standards", leftMargin, y);
  y += 4;

  doc.setDrawColor(15, 39, 68);
  doc.setLineWidth(0.7);
  doc.line(leftMargin, y, leftMargin + contentWidth, y);
  y += 8;

  // --- Course Title ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 39, 68);
  y = addWrappedText(doc, course.title, leftMargin, y, contentWidth, 7);
  y += 3;

  // --- Metadata Box ---
  const metaBoxY = y;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.rect(leftMargin, metaBoxY, contentWidth, 24, "FD");

  const colWidth = contentWidth / 4;
  
  // Col 1: Stream
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("STREAM / DOMAIN", leftMargin + 4, metaBoxY + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(doc.splitTextToSize(course.domainName, colWidth - 6), leftMargin + 4, metaBoxY + 11);

  // Col 2: Level
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("CADRE TIER", leftMargin + colWidth + 4, metaBoxY + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Level ${course.level} (${course.category})`, leftMargin + colWidth + 4, metaBoxY + 11);

  // Col 3: Provider
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("ACCREDITED PROVIDER", leftMargin + colWidth * 2 + 4, metaBoxY + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(doc.splitTextToSize(course.provider, colWidth - 6), leftMargin + colWidth * 2 + 4, metaBoxY + 11);

  // Col 4: Duration
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("CURRICULUM DURATION", leftMargin + colWidth * 3 + 4, metaBoxY + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(226, 92, 72); // coral
  doc.text(`${course.duration_hours} Training Hours`, leftMargin + colWidth * 3 + 4, metaBoxY + 12);

  y = metaBoxY + 28;

  // --- Section 1: Course Overview ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 39, 68);
  doc.text("1. COURSE OVERVIEW & CADRE OBJECTIVE", leftMargin, y);
  y += 2;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(leftMargin, y, leftMargin + contentWidth, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  y = addWrappedText(doc, course.overview, leftMargin, y, contentWidth, 4.8);
  y += 6;

  // --- Section 2: Statutory Learning Objectives ---
  if (y > 240) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 39, 68);
  doc.text("2. STATUTORY LEARNING OBJECTIVES", leftMargin, y);
  y += 2;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(leftMargin, y, leftMargin + contentWidth, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  course.learningObjectives.forEach((obj) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(226, 92, 72);
    doc.circle(leftMargin + 2, y - 1, 1, "F");
    y = addWrappedText(doc, obj, leftMargin + 6, y, contentWidth - 8, 4.6);
    y += 2;
  });
  y += 6;

  // --- Section 3: Module Curriculum Breakdown ---
  if (y > 230) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 39, 68);
  doc.text(`3. MODULE-WISE CURRICULUM BREAKDOWN (${course.modules.length} MODULES)`, leftMargin, y);
  y += 2;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(leftMargin, y, leftMargin + contentWidth, y);
  y += 6;

  course.modules.forEach((mod: CourseModule, idx: number) => {
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    // Module box header
    doc.setFillColor(241, 245, 249);
    doc.rect(leftMargin, y, contentWidth, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 39, 68);
    const cleanModTitle = mod.title.replace(/^Module \d+:\s*/, "");
    doc.text(`Module ${idx + 1}: ${cleanModTitle}`, leftMargin + 3, y + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(226, 92, 72);
    doc.text(`Duration: ${mod.duration}`, leftMargin + contentWidth - 3, y + 5, { align: "right" });
    y += 10;

    // Module content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    y = addWrappedText(doc, mod.content, leftMargin + 2, y, contentWidth - 4, 4.4);
    y += 3;

    // Key points
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("CORE COMPETENCY TAKEAWAYS:", leftMargin + 2, y);
    y += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    mod.keyPoints.forEach((pt) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text("• " + pt, leftMargin + 4, y);
      y += 4;
    });
    y += 5;
  });

  // --- Section 4: 3-Tier Assessment Blueprint ---
  if (y > 210) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 39, 68);
  doc.text("4. 3-TIER ASSESSMENT BLUEPRINT & PASSING STANDARDS", leftMargin, y);
  y += 2;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(leftMargin, y, leftMargin + contentWidth, y);
  y += 6;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(leftMargin, y, contentWidth, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 39, 68);
  doc.text("Tier / Difficulty", leftMargin + 3, y + 5);
  doc.text("Assessment Scope & Focus", leftMargin + 38, y + 5);
  doc.text("Time Limit", leftMargin + 130, y + 5);
  doc.text("Passing Benchmark", leftMargin + 155, y + 5);
  y += 7;

  // Table rows
  const tiers = [
    { name: "Tier 1: Foundational (Easy)", data: course.assessments.easy },
    { name: "Tier 2: Intermediate (Medium)", data: course.assessments.medium },
    { name: "Tier 3: Advanced (Difficult)", data: course.assessments.difficult },
  ];

  tiers.forEach((t) => {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.rect(leftMargin, y, contentWidth, 14, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 39, 68);
    doc.text(t.name, leftMargin + 3, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const scopeLines = doc.splitTextToSize(t.data.description, 85);
    doc.text(scopeLines, leftMargin + 38, y + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`${t.data.timeLimitMinutes} Mins`, leftMargin + 130, y + 7);

    doc.setTextColor(16, 185, 129); // emerald
    doc.text(`${t.data.passingScore}% Pass`, leftMargin + 155, y + 7);

    y += 14;
  });

  // Final statutory headers and footers across all pages
  addFootersAndHeaders(doc, course.title);

  // Save the PDF directly to Downloads with sanitized file name
  const safeTitle = course.title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
  doc.save(`${safeTitle}_Syllabus.pdf`);
}

/**
 * Generates an official Study Notes PDF for an individual course module.
 */
export function generateModulePdf(course: CourseContentDetail, moduleIndex: number) {
  const moduleItem: CourseModule | undefined = course.modules[moduleIndex];
  if (!moduleItem) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const contentWidth = 180;
  const leftMargin = 15;
  let y = 16;

  // Header band
  doc.setFillColor(15, 39, 68);
  doc.rect(0, 0, pageWidth, 5, "F");

  // Institution title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 39, 68);
  doc.text("STATKARMAYOGI · OFFICIAL MODULE STUDY NOTES", leftMargin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Course: ${course.title} (${course.provider})`, leftMargin, y);
  y += 4;

  doc.setDrawColor(15, 39, 68);
  doc.setLineWidth(0.6);
  doc.line(leftMargin, y, leftMargin + contentWidth, y);
  y += 8;

  // Module Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 39, 68);
  y = addWrappedText(doc, moduleItem.title, leftMargin, y, contentWidth, 6.5);
  y += 3;

  // Metadata Bar
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(leftMargin, y, contentWidth, 10, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("STREAM:", leftMargin + 4, y + 6.5);
  doc.setTextColor(30, 41, 59);
  doc.text(course.domainName, leftMargin + 20, y + 6.5);

  doc.setTextColor(100, 116, 139);
  doc.text("LEVEL:", leftMargin + 90, y + 6.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Level ${course.level} (${course.category})`, leftMargin + 104, y + 6.5);

  doc.setTextColor(100, 116, 139);
  doc.text("STUDY DURATION:", leftMargin + 140, y + 6.5);
  doc.setTextColor(226, 92, 72);
  doc.text(moduleItem.duration, leftMargin + 168, y + 6.5);
  y += 16;

  // Module Curriculum & Detailed Content
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 39, 68);
  doc.text("MODULE CURRICULUM & STUDY GUIDE", leftMargin, y);
  y += 2;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(leftMargin, y, leftMargin + contentWidth, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  y = addWrappedText(doc, moduleItem.content, leftMargin, y, contentWidth, 5);
  y += 8;

  // Core Competency Checklist
  if (y > 230) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 39, 68);
  doc.text("KEY STATUTORY & TECHNICAL TAKEAWAYS", leftMargin, y);
  y += 2;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(leftMargin, y, leftMargin + contentWidth, y);
  y += 6;

  // Takeaways Card Box
  moduleItem.keyPoints.forEach((pt) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(226, 92, 72);
    doc.circle(leftMargin + 2, y - 1, 1, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    y = addWrappedText(doc, pt, leftMargin + 6, y, contentWidth - 8, 4.6);
    y += 2;
  });

  addFootersAndHeaders(doc, `${course.title} — Module ${moduleIndex + 1}`);

  const safeModTitle = moduleItem.title.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 35);
  doc.save(`${safeModTitle}_Notes.pdf`);
}
