import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, UnderlineType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import type { ServiceType } from '@/types';

// Main download function that routes to appropriate template
export async function downloadAsPDF(
  content: string,
  filename: string,
  serviceType: ServiceType,
  _template?: string
) {
  switch (serviceType) {
    case 'resume':
      return downloadResumePDF(content, filename);
    case 'cover-letter':
      return downloadCoverLetterPDF(content, filename);
    case 'sop':
      return downloadSOPPDF(content, filename);
    default:
      return downloadResumePDF(content, filename);
  }
}

// Resume PDF - Modern style with purple sidebar
function downloadResumePDF(
  content: string,
  filename: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Clean content - remove markdown symbols
  content = content
    .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove **bold**
    .replace(/__(.+?)__/g, '$1')      // Remove __underline__
    .replace(/^\* /gm, '• ')           // Replace * bullets with •
    .replace(/^- /gm, '• ');           // Replace - bullets with •

  // Optimized dimensions for 1-page fit
  const sidebarWidth = 55;
  const sidebarX = 8;
  const contentX = sidebarWidth + 13;
  const contentWidth = 190 - contentX;
  let sidebarY = 25;  // Start lower for better spacing
  let contentY = 20;
  const lineHeight = 4.5;  // Slightly increased for readability

  // Draw purple sidebar background
  doc.setFillColor(88, 28, 135);
  doc.rect(0, 0, sidebarWidth, 297, 'F');

  const lines = content.split('\n');
  let currentSection = '';
  let isInSidebar = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    const isSectionHeader = (trimmed === trimmed.toUpperCase() && trimmed.length < 60) || trimmed.endsWith(':');
    const isPhoneNumber = /^\d{7,15}$/.test(trimmed.replace(/[\s\-\(\)]/g, '')); // Detect phone numbers (7-15 digits)
    const isEmail = trimmed.includes('@') && trimmed.includes('.'); // Detect email addresses
    const isTitle = i < 3 && trimmed.length < 80 && !isEmail && !isPhoneNumber; // Exclude phone and email
    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');

    if (isSectionHeader) {
      currentSection = trimmed.toLowerCase();
      // Only CONTACT INFORMATION goes in sidebar
      isInSidebar = currentSection.includes('contact');
    }

    if (isTitle && i === 0) {
      doc.setFontSize(20);  // Larger for prominence
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(88, 28, 135);
      const split = doc.splitTextToSize(trimmed, contentWidth);
      doc.text(split, contentX, contentY);
      contentY += 10;  // More spacing after name
    } else if (isInSidebar) {
      if (isSectionHeader) {
        doc.setFontSize(10);  // Increased for better visibility
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(trimmed.replace(':', '').toUpperCase(), sidebarX + 4, sidebarY);
        sidebarY += 7;  // More spacing after header
      } else if (isBullet) {
        doc.setFontSize(9);  // Increased for readability
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(240, 240, 240);  // Lighter for better contrast
        const text = trimmed.replace(/^[•\-*]\s*/, '');
        const split = doc.splitTextToSize(text, sidebarWidth - 12);
        doc.text(split, sidebarX + 7, sidebarY);
        sidebarY += split.length * 4.5;  // Better line spacing
      } else if (isEmail) {
        // Email address - tighter spacing before phone number
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(245, 245, 245);
        const split = doc.splitTextToSize(trimmed, sidebarWidth - 10);
        doc.text(split, sidebarX + 4, sidebarY);
        sidebarY += split.length * 3.5;  // Reduced spacing after email
      } else if (isPhoneNumber) {
        // Phone number - smaller font and tighter spacing
        doc.setFontSize(8);  // Smaller font for phone number
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(245, 245, 245);
        const split = doc.splitTextToSize(trimmed, sidebarWidth - 10);
        doc.text(split, sidebarX + 4, sidebarY);
        sidebarY += split.length * 3.5;  // Reduced spacing after phone number
      } else {
        doc.setFontSize(9);  // Increased from 8
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(245, 245, 245);  // Lighter text
        const split = doc.splitTextToSize(trimmed, sidebarWidth - 10);
        doc.text(split, sidebarX + 4, sidebarY);
        sidebarY += split.length * 4.5;  // Better spacing
      }
    } else {
      if (isSectionHeader) {
        contentY += 6;  // Better spacing before section
        doc.setFontSize(12);  // Slightly larger for hierarchy
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(88, 28, 135);
        doc.text(trimmed.replace(':', '').toUpperCase(), contentX, contentY);
        contentY += 7;  // More spacing after header
      } else if (isBullet) {
        doc.setFontSize(10);  // Better readability
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        const text = trimmed.replace(/^[•\-*]\s*/, '');
        doc.setFillColor(147, 51, 234);
        doc.circle(contentX + 2, contentY - 1, 0.8, 'F');  // Slightly larger bullet
        const split = doc.splitTextToSize(text, contentWidth - 10);
        doc.text(split, contentX + 6, contentY);
        contentY += split.length * lineHeight;
      } else {
        doc.setFontSize(10);  // Better readability
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(40, 40, 40);
        const split = doc.splitTextToSize(trimmed, contentWidth);
        doc.text(split, contentX, contentY);
        contentY += split.length * lineHeight;
      }
    }
  }

  doc.save(`${filename}.pdf`);
}

// Cover Letter PDF - Clean business letter format
function downloadCoverLetterPDF(
  content: string,
  filename: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const margin = 25;
  const pageWidth = 210;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = 25;
  const lineHeight = 5.5;

  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      yPosition += 3; // Add spacing for empty lines
      continue;
    }

    // Check if new page is needed
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 25;
    }

    // Detect different parts of the letter
    const isName = i === 0 && trimmed.length < 50 && !trimmed.includes('|') && !trimmed.includes('@');
    const isRole = i === 1 && trimmed.length < 80 && !trimmed.includes('@') && !trimmed.includes('|');
    const isContactInfo = trimmed.includes('@') || trimmed.includes('|') || trimmed.includes('(');
    // Updated to match text dates like "January 12, 2025" or numeric formats
    const isDate = !isContactInfo && i < 15 && (
      trimmed.match(/^\d{1,2}-\d{1,2}-\d{4}$/) ||
      trimmed.match(/^\d{4}-\d{1,2}-\d{1,2}$/) ||
      trimmed.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}$/)
    );
    const isCompanyInfo = !isContactInfo && i > 2 && i < 20 && trimmed.length < 60 && (trimmed.toLowerCase().includes('hiring') || trimmed.toLowerCase().includes('team'));
    const isSubject = (trimmed.toLowerCase().startsWith('subject:') || trimmed.toLowerCase().startsWith('re:')) && trimmed.includes(':');
    const isSalutation = trimmed.toLowerCase().startsWith('dear') && trimmed.length < 60;
    const isClosing = trimmed.toLowerCase() === 'sincerely' || trimmed.toLowerCase() === 'sincerely,' || trimmed.toLowerCase() === 'best regards' || trimmed.toLowerCase() === 'best regards,';

    if (isName) {
      // Candidate name - larger, bold
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text(trimmed, margin, yPosition);
      yPosition += 6;
    } else if (isRole) {
      // Role/Position - medium, normal weight, gray
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(trimmed, margin, yPosition);
      yPosition += 6;

      // Draw separator line
      doc.setDrawColor(150, 150, 150);
      doc.setLineWidth(0.3);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;
    } else if (isContactInfo) {
      // Contact information - smaller, gray
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(trimmed, margin, yPosition);
      yPosition += 5;
    } else if (isDate) {
      // Date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(trimmed, margin, yPosition);
      yPosition += 10;
    } else if (isCompanyInfo) {
      // Company/recipient info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text(trimmed, margin, yPosition);
      yPosition += 5;
    } else if (isSubject) {
      // Subject line - bold
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text(trimmed, margin, yPosition);
      yPosition += 10;
    } else if (isSalutation) {
      // Salutation (Dear...)
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      doc.text(trimmed, margin, yPosition);
      yPosition += 8;
    } else if (isClosing) {
      // Closing (Sincerely, etc.)
      yPosition += 4;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      doc.text(trimmed, margin, yPosition);
      yPosition += 12;
    } else {
      // Regular paragraph text
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      const split = doc.splitTextToSize(trimmed, contentWidth);
      doc.text(split, margin, yPosition);
      yPosition += split.length * lineHeight + 2;
    }
  }

  doc.save(`${filename}.pdf`);
}

// SOP PDF - Clean academic format
function downloadSOPPDF(
  content: string,
  filename: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const margin = 25;
  const pageWidth = 210;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = 20;
  const lineHeight = 5;  // Reduced from 6.5 for tighter spacing

  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      yPosition += 3; // Reduced spacing for empty lines
      continue;
    }

    // Check if new page is needed
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    // Detect title - only "Statement of Purpose"
    const isTitle = i === 0 && trimmed.toLowerCase().includes('statement of purpose');

    if (isTitle) {
      // Main title - just "Statement of Purpose" bold and centered with gradient-like purple color
      const titleText = 'Statement of Purpose';
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(88, 28, 135); // Purple color (similar to purple-600)
      const textWidth = doc.getTextWidth(titleText);
      const xPosition = (pageWidth - textWidth) / 2;
      doc.text(titleText, xPosition, yPosition);
      yPosition += 12;
    } else {
      // Regular paragraph text - justified, smaller size
      doc.setFontSize(10);  // Reduced from 11
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      const split = doc.splitTextToSize(trimmed, contentWidth);
      doc.text(split, margin, yPosition, { align: 'justify', maxWidth: contentWidth });
      yPosition += split.length * lineHeight + 2;  // Reduced paragraph spacing
    }
  }

  doc.save(`${filename}.pdf`);
}

export async function downloadAsDOCX(
  content: string,
  filename: string,
  serviceType: ServiceType,
  _template?: string
) {
  switch (serviceType) {
    case 'resume':
      return downloadResumeDOCX(content, filename);
    case 'cover-letter':
      return downloadCoverLetterDOCX(content, filename);
    case 'sop':
      return downloadSOPDOCX(content, filename);
    default:
      return downloadResumeDOCX(content, filename);
  }
}

// Resume DOCX - Modern style with purple sidebar
async function downloadResumeDOCX(
  content: string,
  filename: string
) {
  const lines = content.split('\n');
  const paragraphs: Paragraph[] = [];
  let currentSection = '';

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    const isSectionHeader = (trimmed === trimmed.toUpperCase() && trimmed.length < 60) || trimmed.endsWith(':');
    const isPhoneNumber = /^\d{7,15}$/.test(trimmed.replace(/[\s\-\(\)]/g, '')); // Detect phone numbers
    const isEmail = trimmed.includes('@') && trimmed.includes('.'); // Detect email addresses
    const isTitle = i < 3 && trimmed.length < 80 && !isEmail && !isPhoneNumber;
    const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*');

    if (isSectionHeader) {
      currentSection = trimmed.toLowerCase();
    }

    const isInSidebar = currentSection.includes('contact') || currentSection.includes('skill') || currentSection.includes('education');

    if (isTitle && i === 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, bold: true, size: 36, color: '581C87' })],
          spacing: { after: 300 },
        })
      );
    } else if (isInSidebar) {
      if (isSectionHeader) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: trimmed.replace(':', '').toUpperCase(), bold: true, size: 22, color: 'FFFFFF' })],
            spacing: { before: 240, after: 140 },
            shading: { fill: '581C87', type: 'solid', color: '581C87' },
          })
        );
      } else if (isEmail) {
        // Email address - tighter spacing before phone number
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: trimmed, size: 18, color: 'FFFFFF' })],
            spacing: { after: 80 },
            shading: { fill: '581C87', type: 'solid', color: '581C87' },
          })
        );
      } else if (isPhoneNumber) {
        // Phone number - smaller font and tighter spacing
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: trimmed, size: 16, color: 'FFFFFF' })],
            spacing: { after: 80 },
            shading: { fill: '581C87', type: 'solid', color: '581C87' },
          })
        );
      } else {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: trimmed, size: 18, color: 'FFFFFF' })],
            spacing: { after: 120 },
            shading: { fill: '581C87', type: 'solid', color: '581C87' },
          })
        );
      }
    } else {
      if (isSectionHeader) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmed.replace(':', '').toUpperCase(),
                bold: true,
                size: 26,
                color: '581C87',
                underline: { type: UnderlineType.SINGLE },
              }),
            ],
            spacing: { before: 300, after: 200 },
          })
        );
      } else if (isBullet) {
        const text = trimmed.replace(/^[•\-*]\s*/, '');
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text, size: 20 })],
            bullet: { level: 0 },
            spacing: { after: 120 },
          })
        );
      } else {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: trimmed, size: 20 })],
            spacing: { after: 120 },
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}

// Cover Letter DOCX - Clean business letter format
async function downloadCoverLetterDOCX(
  content: string,
  filename: string
) {
  const lines = content.split('\n');
  const paragraphs: Paragraph[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      // Add spacing for empty lines
      paragraphs.push(new Paragraph({ text: '', spacing: { after: 120 } }));
      continue;
    }

    // Detect different parts of the letter
    const isName = i === 0 && trimmed.length < 50 && !trimmed.includes('|') && !trimmed.includes('@');
    const isRole = i === 1 && trimmed.length < 80 && !trimmed.includes('@') && !trimmed.includes('|');
    const isContactInfo = trimmed.includes('@') || trimmed.includes('|') || trimmed.includes('(');
    // Updated to match text dates like "January 12, 2025" or numeric formats
    const isDate = !isContactInfo && i < 15 && (
      trimmed.match(/^\d{1,2}-\d{1,2}-\d{4}$/) ||
      trimmed.match(/^\d{4}-\d{1,2}-\d{1,2}$/) ||
      trimmed.match(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}$/)
    );
    const isCompanyInfo = !isContactInfo && i > 2 && i < 20 && trimmed.length < 60 && (trimmed.toLowerCase().includes('hiring') || trimmed.toLowerCase().includes('team'));
    const isSubject = (trimmed.toLowerCase().startsWith('subject:') || trimmed.toLowerCase().startsWith('re:')) && trimmed.includes(':');
    const isSalutation = trimmed.toLowerCase().startsWith('dear') && trimmed.length < 60;
    const isClosing = trimmed.toLowerCase() === 'sincerely' || trimmed.toLowerCase() === 'sincerely,' || trimmed.toLowerCase() === 'best regards' || trimmed.toLowerCase() === 'best regards,';

    if (isName) {
      // Candidate name
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, bold: true, size: 28, color: '2C2C2C' })],
          spacing: { after: 120 },
        })
      );
    } else if (isRole) {
      // Role/Position - medium, normal weight, gray
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 22, color: '505050' })],
          spacing: { after: 120 },
        })
      );

      // Add separator line as border
      paragraphs.push(
        new Paragraph({
          text: '',
          border: {
            top: {
              color: '969696',
              space: 1,
              style: 'single',
              size: 6,
            },
          },
          spacing: { after: 240 },
        })
      );
    } else if (isContactInfo) {
      // Contact information
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 18, color: '646464' })],
          spacing: { after: 100 },
        })
      );
    } else if (isDate) {
      // Date
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 20, color: '3C3C3C' })],
          spacing: { before: 240, after: 240 },
        })
      );
    } else if (isCompanyInfo) {
      // Company/recipient info
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 20, color: '3C3C3C' })],
          spacing: { after: 100 },
        })
      );
    } else if (isSubject) {
      // Subject line
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, bold: true, size: 20, color: '2C2C2C' })],
          spacing: { before: 240, after: 200 },
        })
      );
    } else if (isSalutation) {
      // Salutation
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 22, color: '2C2C2C' })],
          spacing: { before: 200, after: 200 },
        })
      );
    } else if (isClosing) {
      // Closing
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 22, color: '2C2C2C' })],
          spacing: { before: 300, after: 300 },
        })
      );
    } else {
      // Regular paragraph text
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 22, color: '2C2C2C' })],
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}

// SOP DOCX - Clean academic format
async function downloadSOPDOCX(
  content: string,
  filename: string
) {
  const lines = content.split('\n');
  const paragraphs: Paragraph[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      // Add spacing for paragraph breaks - reduced
      paragraphs.push(new Paragraph({ text: '', spacing: { after: 120 } }));
      continue;
    }

    // Detect title - only "Statement of Purpose"
    const isTitle = i === 0 && trimmed.toLowerCase().includes('statement of purpose');

    if (isTitle) {
      // Main title - just "Statement of Purpose" bold and centered with purple color
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: 'Statement of Purpose', bold: true, size: 32, color: '581C87' })],
          spacing: { after: 240 },
          alignment: AlignmentType.CENTER,
        })
      );
    } else {
      // Regular paragraph text - justified with first line indent, smaller size
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: trimmed, size: 20, color: '2C2C2C' })],  // Reduced from 22
          spacing: { after: 180, line: 276 }, // Tighter line spacing (1.15x)
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 }, // 0.5 inch first line indent
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}

export function generateFilename(serviceType: ServiceType): string {
  const serviceNames = {
    resume: 'Resume',
    'cover-letter': 'Cover_Letter',
    sop: 'Statement_of_Purpose',
  };

  const date = new Date().toISOString().split('T')[0];
  return `${serviceNames[serviceType]}_${date}`;
}
