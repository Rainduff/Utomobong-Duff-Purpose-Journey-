import { jsPDF } from 'jspdf';
import { RESUME_DATA } from '../data/portfolioData';
import { ResumePreset } from '../types/portfolio';

export function generateResumePDF(preset: ResumePreset = 'all'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header: Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(24, 24, 27);
  doc.text(RESUME_DATA.name.toUpperCase(), margin, y);

  if (preset !== 'all') {
    const presetTag =
      preset === 'ai-research' ? 'AI & ML Research Focus' : 'Media & Leadership Focus';
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(113, 113, 122);
    const tagW = doc.getTextWidth(presetTag);
    doc.text(presetTag, pageWidth - margin - tagW, y);
  }
  y += 6.5;

  // Title
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(82, 82, 91);
  doc.text(RESUME_DATA.title, margin, y);
  y += 5;

  // Contact line with clickable email and phone links
  doc.setFontSize(8.5);
  const sep = '  |  ';
  let cursorX = margin;

  doc.setTextColor(113, 113, 122);
  doc.text(RESUME_DATA.location, cursorX, y);
  cursorX += doc.getTextWidth(RESUME_DATA.location);

  doc.text(sep, cursorX, y);
  cursorX += doc.getTextWidth(sep);

  doc.setTextColor(24, 24, 27);
  const emailWidth = doc.getTextWidth(RESUME_DATA.email);
  doc.text(RESUME_DATA.email, cursorX, y);
  doc.link(cursorX, y - 3.2, emailWidth, 4.2, { url: `mailto:${RESUME_DATA.email}` });
  cursorX += emailWidth;

  doc.setTextColor(113, 113, 122);
  doc.text(sep, cursorX, y);
  cursorX += doc.getTextWidth(sep);

  doc.setTextColor(24, 24, 27);
  const phoneText = RESUME_DATA.phones.join(', ');
  const phoneW = doc.getTextWidth(phoneText);
  doc.text(phoneText, cursorX, y);
  doc.link(cursorX, y - 3.2, phoneW, 4.2, { url: `tel:+234${RESUME_DATA.phones[0].slice(1)}` });
  y += 4.5;

  doc.setFontSize(8);
  doc.setTextColor(113, 113, 122);
  doc.text(`Address: ${RESUME_DATA.address}  |  Languages: ${RESUME_DATA.languages}`, margin, y);
  y += 4.5;

  // Divider
  doc.setDrawColor(228, 228, 231);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Professional Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(24, 24, 27);
  doc.text('PROFESSIONAL SUMMARY', margin, y);
  y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(63, 63, 70);
  const summaryLines = doc.splitTextToSize(RESUME_DATA.summary[preset], contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4 + 3.5;

  // Core Skills (filtered by preset)
  const filteredSkills = RESUME_DATA.skills.filter(
    (group) => preset === 'all' || group.focus.includes(preset)
  );

  checkPageBreak(28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(24, 24, 27);
  doc.text('CORE SKILLS', margin, y);
  y += 4.5;

  filteredSkills.forEach((skillGroup) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(39, 39, 42);
    const categoryLabel = `${skillGroup.category}: `;
    doc.text(categoryLabel, margin, y);

    const catWidth = doc.getTextWidth(categoryLabel);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(82, 82, 91);
    const itemsText = skillGroup.items.join(' · ');
    const itemsLines = doc.splitTextToSize(itemsText, contentWidth - catWidth);
    doc.text(itemsLines, margin + catWidth, y);
    y += Math.max(1, itemsLines.length) * 3.8 + 0.5;
  });
  y += 3;

  // Work Experience
  checkPageBreak(36);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(24, 24, 27);
  doc.text('WORK EXPERIENCE', margin, y);
  y += 5;

  RESUME_DATA.experience.forEach((job) => {
    const visibleAchievements = job.achievements.filter(
      (ach) => preset === 'all' || ach.focus.includes(preset)
    );
    const achievementsToRender =
      visibleAchievements.length > 0 ? visibleAchievements : job.achievements;

    checkPageBreak(28);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(24, 24, 27);
    doc.text(job.role, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(113, 113, 122);
    const periodWidth = doc.getTextWidth(job.period);
    doc.text(job.period, pageWidth - margin - periodWidth, y);
    y += 3.8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.3);
    doc.setTextColor(82, 82, 91);
    doc.text(`${job.company} · ${job.location}`, margin, y);
    y += 4.2;

    achievementsToRender.forEach((ach) => {
      checkPageBreak(11);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(75, 85, 99);
      doc.text('•', margin + 2, y);

      const bulletLines = doc.splitTextToSize(ach.text, contentWidth - 7);
      doc.text(bulletLines, margin + 6, y);
      y += bulletLines.length * 3.5 + 1;
    });

    y += 3;
  });

  // Projects & Achievements
  checkPageBreak(28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(24, 24, 27);
  doc.text('KEY PROJECTS & ACHIEVEMENTS', margin, y);
  y += 5;

  RESUME_DATA.projectHighlights.forEach((item) => {
    checkPageBreak(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(24, 24, 27);
    doc.text(item.project, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    const metricW = doc.getTextWidth(item.metric);
    doc.text(item.metric, pageWidth - margin - metricW, y);
    y += 3.6;

    const descLines = doc.splitTextToSize(item.description, contentWidth);
    doc.text(descLines, margin, y);
    y += descLines.length * 3.5 + 2.2;
  });

  // Education
  checkPageBreak(26);
  y += 1.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(24, 24, 27);
  doc.text('EDUCATION', margin, y);
  y += 4.8;

  RESUME_DATA.education.forEach((edu) => {
    checkPageBreak(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(24, 24, 27);
    doc.text(edu.degree, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(113, 113, 122);
    const pWidth = doc.getTextWidth(edu.period);
    doc.text(edu.period, pageWidth - margin - pWidth, y);
    y += 3.8;

    doc.setTextColor(82, 82, 91);
    doc.text(edu.institution, margin, y);
    y += 3.6;

    if (edu.notes) {
      doc.setFontSize(7.8);
      doc.setTextColor(113, 113, 122);
      doc.text(edu.notes, margin, y);
      y += 3.8;
    }
    y += 1;
  });

  // Certifications
  checkPageBreak(26);
  y += 1.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(24, 24, 27);
  doc.text('CERTIFICATES & TRAINING', margin, y);
  y += 4.8;

  RESUME_DATA.certifications.forEach((cert) => {
    checkPageBreak(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.3);
    doc.setTextColor(24, 24, 27);
    doc.text(`${cert.title} — ${cert.issuer}`, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    const dateW = doc.getTextWidth(cert.period);
    doc.text(cert.period, pageWidth - margin - dateW, y);
    y += 4;
  });

  // Referees
  checkPageBreak(22);
  y += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(24, 24, 27);
  doc.text('REFEREES', margin, y);
  y += 4.5;

  RESUME_DATA.referees.forEach((ref) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.3);
    doc.setTextColor(24, 24, 27);
    doc.text(`${ref.name} — `, margin, y);
    const nW = doc.getTextWidth(`${ref.name} — `);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(82, 82, 91);
    doc.text(`${ref.organization} (${ref.phone})`, margin + nW, y);
    y += 4;
  });

  const suffix =
    preset === 'all' ? '' : preset === 'ai-research' ? '_AI_Research' : '_Media_Leadership';
  doc.save(`Utomobong_Duff_Resume${suffix}.pdf`);
}
