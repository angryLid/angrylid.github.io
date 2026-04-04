#!/usr/bin/env node

const fs = require('fs');

function formatNotionMarkdown(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Find frontmatter boundaries
  let frontmatterEnd = -1;
  let frontmatterStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (frontmatterStart === -1) {
        frontmatterStart = i;
      } else {
        frontmatterEnd = i;
        break;
      }
    }
  }

  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
    const prevLine = i > 0 ? result[result.length - 1] || '' : '';

    // Preserve frontmatter exactly as-is
    if (i <= frontmatterEnd && frontmatterEnd !== -1) {
      result.push(line);
      continue;
    }

    // Skip empty lines
    if (line.trim() === '') {
      result.push(line);
      continue;
    }

    // Check if this is a heading

    const isHeading = line.trim().match(/^#{1,6}\s+/);
    const nextIsHeading = nextLine.trim().match(/^#{1,6}\s+/);

    // Blank line before headings (if previous isn't empty or heading)
    if (isHeading && prevLine.trim() !== '' && !prevLine.trim().match(/^#{1,6}\s+/)) {
      if (result.length > 0 && result[result.length - 1].trim() !== '') {
        result.push('');
      }
    }

    result.push(line);

    // Determine if we need a blank line after this line
    let needBlankLine = false;

    // Blank line after headings (if next is not heading and not empty)
    if (isHeading && !nextIsHeading && nextLine.trim() !== '') {
      needBlankLine = true;
    }

    // Blank line between paragraphs
    // Condition: current line ends with sentence-ending punctuation AND next line starts with uppercase
    const endsWithPeriod = /[.!?。！？]$/.test(line.trim().replace(/\*\*/g, ''));
    const nextStartsWithUppercase = nextLine.trim().length > 0 && /^[A-Z\u4e00-\u9fa5]/.test(nextLine.trim());

    if (endsWithPeriod && nextStartsWithUppercase && !nextIsHeading && nextLine.trim() !== '') {
      needBlankLine = true;
    }

    // Special case: Chinese text - add blank line when switching between Chinese and English
    const endsWithChinese = /[\u4e00-\u9fa5]$/.test(line.trim().replace(/\*\*/g, ''));
    const nextStartsWithEnglish = nextLine.trim().length > 0 && /^[A-Za-z]/.test(nextLine.trim());

    if (endsWithChinese && nextStartsWithEnglish && nextLine.trim() !== '') {
      needBlankLine = true;
    }

    if (needBlankLine) {
      result.push('');
    }
  }

  // Remove excessive blank lines (more than 2 consecutive)
  const finalResult = [];
  let blankCount = 0;
  for (const line of result) {
    if (line.trim() === '') {
      blankCount++;
      if (blankCount <= 2) {
        finalResult.push(line);
      }
    } else {
      blankCount = 0;
      finalResult.push(line);
    }
  }

  const formattedContent = finalResult.join('\n');
  fs.writeFileSync(filePath, formattedContent, 'utf8');
  console.log(`Formatted: ${filePath}`);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node format-notion-markdown.js <file-path>');
  process.exit(1);
}

formatNotionMarkdown(filePath);