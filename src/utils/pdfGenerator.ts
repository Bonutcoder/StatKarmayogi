import { CourseContentDetail, CourseModule } from "../data/courseContentData";

export function generateCourseSyllabusPdf(course: CourseContentDetail) {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    alert("Please allow popups to download/print the syllabus PDF.");
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${course.title} — Official Course Syllabus (MoSPI / NSSTA)</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 15mm;
    }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0f2744;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .emblem {
      font-size: 24px;
      margin-bottom: 4px;
    }
    .gov-title {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #0f2744;
      text-transform: uppercase;
    }
    .dept-title {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .course-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f2744;
      margin: 16px 0 6px 0;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 10px 12px;
      font-size: 11px;
      margin-bottom: 18px;
      border-radius: 4px;
    }
    .meta-item strong {
      display: block;
      color: #64748b;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f2744;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin: 18px 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .overview-box {
      font-size: 12px;
      color: #334155;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .objectives-list {
      font-size: 11.5px;
      padding-left: 20px;
      margin: 8px 0 16px 0;
      color: #334155;
    }
    .objectives-list li {
      margin-bottom: 4px;
    }
    .module-card {
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 12px 14px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .module-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .module-name {
      font-size: 13px;
      font-weight: 700;
      color: #0f2744;
    }
    .module-dur {
      font-size: 11px;
      font-weight: 600;
      color: #e25c48;
    }
    .module-desc {
      font-size: 11.5px;
      color: #334155;
      margin-bottom: 8px;
    }
    .takeaways-title {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .takeaways-list {
      font-size: 11px;
      padding-left: 18px;
      margin: 4px 0 0 0;
      color: #475569;
    }
    .assess-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin-top: 8px;
    }
    .assess-table th, .assess-table td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
    }
    .assess-table th {
      background: #f1f5f9;
      font-weight: 700;
      color: #0f2744;
    }
    .footer {
      margin-top: 24px;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      text-align: center;
      font-size: 9px;
      color: #94a3b8;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="emblem">🏛️</div>
    <div class="gov-title">StatKarmayogi Competency Intelligence Platform</div>
    <div class="dept-title">National Statistical Systems Training Academy (NSSTA) & iGOT Karmayogi</div>
  </div>

  <div class="course-title">${course.title}</div>

  <div class="meta-grid">
    <div class="meta-item">
      <strong>Stream / Domain</strong>
      ${course.domainName}
    </div>
    <div class="meta-item">
      <strong>Cadre Tier</strong>
      Level ${course.level} (${course.category})
    </div>
    <div class="meta-item">
      <strong>Accredited Provider</strong>
      ${course.provider}
    </div>
    <div class="meta-item">
      <strong>Course Duration</strong>
      ${course.duration_hours} Training Hours
    </div>
  </div>

  <div class="section-title">1. Course Overview</div>
  <div class="overview-box">
    ${course.overview}
  </div>

  <div class="section-title">2. Statutory Learning Objectives</div>
  <ul class="objectives-list">
    ${course.learningObjectives.map((obj) => `<li>${obj}</li>`).join("")}
  </ul>

  <div class="section-title">3. Module-Wise Curriculum Breakdown (${course.modules.length} Modules)</div>
  ${course.modules
    .map(
      (m, idx) => `
    <div class="module-card">
      <div class="module-header">
        <div class="module-name">Module ${idx + 1}: ${m.title.replace(/^Module \d+:\s*/, "")}</div>
        <div class="module-dur">Duration: ${m.duration}</div>
      </div>
      <div class="module-desc">${m.content}</div>
      <div class="takeaways-title">Key Competency Takeaways:</div>
      <ul class="takeaways-list">
        ${m.keyPoints.map((pt) => `<li>${pt}</li>`).join("")}
      </ul>
    </div>
  `
    )
    .join("")}

  <div class="section-title">4. 3-Tier Assessment Blueprint</div>
  <table class="assess-table">
    <thead>
      <tr>
        <th>Tier / Difficulty</th>
        <th>Scope & Focus Area</th>
        <th>Time Limit</th>
        <th>Passing Threshold</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Tier 1: Easy</strong></td>
        <td>${course.assessments.easy.description}</td>
        <td>${course.assessments.easy.timeLimitMinutes} Mins</td>
        <td>${course.assessments.easy.passingScore}%</td>
      </tr>
      <tr>
        <td><strong>Tier 2: Medium</strong></td>
        <td>${course.assessments.medium.description}</td>
        <td>${course.assessments.medium.timeLimitMinutes} Mins</td>
        <td>${course.assessments.medium.passingScore}%</td>
      </tr>
      <tr>
        <td><strong>Tier 3: Difficult</strong></td>
        <td>${course.assessments.difficult.description}</td>
        <td>${course.assessments.difficult.timeLimitMinutes} Mins</td>
        <td>${course.assessments.difficult.passingScore}%</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    Official StatKarmayogi AI Curriculum Document · Generated on ${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })} · Accredited for ISS / SSS Cadre Training
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function generateModulePdf(course: CourseContentDetail, moduleIndex: number) {
  const moduleItem: CourseModule | undefined = course.modules[moduleIndex];
  if (!moduleItem) return;

  const printWindow = window.open("", "_blank", "width=850,height=650");
  if (!printWindow) {
    alert("Please allow popups to download/print the module PDF.");
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Module ${moduleIndex + 1} Notes — ${course.title}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; line-height: 1.6; margin: 0; }
    .header { border-bottom: 2px solid #0f2744; padding-bottom: 10px; margin-bottom: 18px; }
    .gov-title { font-size: 11px; font-weight: 700; color: #0f2744; text-transform: uppercase; }
    .course-subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
    .module-title { font-size: 18px; font-weight: 800; color: #0f2744; margin: 12px 0 6px 0; }
    .meta-bar { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; font-size: 11px; margin-bottom: 16px; display: flex; justify-content: space-between; }
    .section-title { font-size: 13px; font-weight: 700; color: #0f2744; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin: 16px 0 8px 0; text-transform: uppercase; }
    .content-box { font-size: 12.5px; color: #334155; line-height: 1.7; margin-bottom: 16px; }
    .points-box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px 16px; border-radius: 4px; margin-bottom: 16px; }
    .points-list { font-size: 12px; padding-left: 18px; margin: 6px 0 0 0; color: #334155; }
    .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; text-align: center; font-size: 9px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="header">
    <div class="gov-title">StatKarmayogi Competency Intelligence Platform</div>
    <div class="course-subtitle">Course: ${course.title} (${course.provider})</div>
  </div>

  <div class="module-title">${moduleItem.title}</div>
  <div class="meta-bar">
    <span>Stream: <b>${course.domainName}</b></span>
    <span>Level: <b>Level ${course.level} (${course.category})</b></span>
    <span>Study Duration: <b>${moduleItem.duration}</b></span>
  </div>

  <div class="section-title">Module Curriculum & Study Notes</div>
  <div class="content-box">
    ${moduleItem.content}
  </div>

  <div class="section-title">Core Competency Checklist</div>
  <div class="points-box">
    <ul class="points-list">
      ${moduleItem.keyPoints.map((pt) => `<li>${pt}</li>`).join("")}
    </ul>
  </div>

  <div class="footer">
    Official StatKarmayogi AI Module Study Notes · ${new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
