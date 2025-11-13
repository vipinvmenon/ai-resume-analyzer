import type { StructuredAnalysisData, KeywordDensity, ATSIssue } from '@/types';

/**
 * Extract structured data from AI analysis text
 */
export function parseAnalysisResponse(analysisText: string): StructuredAnalysisData | null {
  try {
    const text = analysisText.toLowerCase();

    // Extract scores (looking for patterns like "85%", "Score: 85", etc.)
    const overallFitScore = extractScore(text, ['overall', 'match score', 'compatibility', 'fit']);
    const atsCompatibility = extractScore(text, ['ats', 'applicant tracking', 'ats score']);
    const skillMatchRate = extractScore(text, ['skill', 'skills match', 'skills']);

    // Extract skills - look for lists or mentions
    const matchedSkills = extractSkills(text, ['strengths', 'skills', 'matched', 'found']);
    const missingSkills = extractSkills(text, ['gaps', 'missing', 'lack', 'absent', 'need']);

    // Extract keywords with counts
    const keywordDensity = extractKeywords(analysisText);

    // Extract ATS issues
    const atsIssues = extractATSIssues(analysisText);

    // Extract recommendations
    const recommendations = extractRecommendations(analysisText);

    return {
      overallFitScore: overallFitScore || 0,
      atsCompatibility: atsCompatibility || 0,
      skillMatchRate: skillMatchRate || 0,
      matchedSkills: matchedSkills.length > 0 ? matchedSkills : ['No skills detected'],
      missingSkills,
      keywordDensity: keywordDensity.length > 0 ? keywordDensity : [],
      atsIssues,
      recommendations,
    };
  } catch (error) {
    console.error('Error parsing analysis response:', error);
    return null;
  }
}

/**
 * Extract a score from text by looking for patterns
 */
function extractScore(text: string, keywords: string[]): number | null {
  // Look for percentage patterns
  const percentagePattern = /(\d+)%/gi;
  const percentages = [...text.matchAll(percentagePattern)].map((m) => parseInt(m[1]));

  // Look for score mentions near keywords
  for (const keyword of keywords) {
    const keywordIndex = text.indexOf(keyword);
    if (keywordIndex !== -1) {
      const context = text.substring(keywordIndex, keywordIndex + 100);
      const match = context.match(/(\d+)\s*%?/i);
      if (match) {
        const score = parseInt(match[1]);
        if (score >= 0 && score <= 100) {
          return score;
        }
      }
    }
  }

  // Return first reasonable percentage found
  if (percentages.length > 0) {
    const score = percentages.find((p) => p >= 0 && p <= 100);
    return score || null;
  }

  return null;
}

/**
 * Extract skills from text
 */
function extractSkills(text: string, keywords: string[]): string[] {
  const skills: string[] = [];
  const commonSkills = [
    'react',
    'javascript',
    'typescript',
    'python',
    'java',
    'node.js',
    'aws',
    'docker',
    'kubernetes',
    'git',
    'sql',
    'mongodb',
    'postgresql',
    'html',
    'css',
    'angular',
    'vue',
    'redux',
    'graphql',
    'rest api',
    'ci/cd',
    'agile',
    'scrum',
    'leadership',
    'communication',
    'problem solving',
  ];

  for (const keyword of keywords) {
    const keywordIndex = text.indexOf(keyword);
    if (keywordIndex !== -1) {
      const context = text.substring(keywordIndex, keywordIndex + 500);
      // Look for skills in the context
      for (const skill of commonSkills) {
        if (context.includes(skill) && !skills.includes(skill)) {
          skills.push(skill);
        }
      }
    }
  }

  // Also extract skills from bullet points or lists
  const listPattern = /[•\-\*]\s*([a-z\s]+(?:\.js|\.net|api|ci\/cd)?)/gi;
  const matches = [...text.matchAll(listPattern)];
  for (const match of matches) {
    const item = match[1].trim().toLowerCase();
    if (item.length > 2 && item.length < 30 && !skills.includes(item)) {
      skills.push(item);
    }
  }

  return skills.slice(0, 20); // Limit to 20 skills
}

/**
 * Extract keywords with their counts
 */
function extractKeywords(text: string): KeywordDensity[] {
  const keywords: KeywordDensity[] = [];
  const keywordPattern = /(\w+)\s*:?\s*(\d+)/gi;

  // Extract keyword mentions with counts
  const matches = [...text.matchAll(keywordPattern)];
  const keywordMap = new Map<string, number>();

  for (const match of matches) {
    const keyword = match[1].toLowerCase();
    const count = parseInt(match[2]);
    if (keyword.length > 2 && keyword.length < 30) {
      keywordMap.set(keyword, count);
    }
  }

  // Also count occurrences of common tech keywords
  const commonKeywords = [
    'react',
    'javascript',
    'typescript',
    'aws',
    'docker',
    'kubernetes',
    'python',
    'java',
    'node',
    'git',
    'agile',
    'leadership',
    'communication',
  ];

  const textLower = text.toLowerCase();
  for (const keyword of commonKeywords) {
    if (!keywordMap.has(keyword)) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const count = (textLower.match(regex) || []).length;
      if (count > 0) {
        keywordMap.set(keyword, count);
      }
    }
  }

  // Convert to array and sort by count
  for (const [keyword, count] of keywordMap.entries()) {
    keywords.push({
      keyword: keyword.charAt(0).toUpperCase() + keyword.slice(1),
      count,
      isPresent: count > 0,
    });
  }

  return keywords.sort((a, b) => b.count - a.count).slice(0, 15); // Top 15 keywords
}

/**
 * Extract ATS issues from text
 */
function extractATSIssues(text: string): ATSIssue[] {
  const issues: ATSIssue[] = [];
  const textLower = text.toLowerCase();

  // Look for ATS-related issues
  const highPatterns = [
    /missing\s+(\w+)/gi,
    /lack\s+of\s+(\w+)/gi,
    /no\s+(\w+)/gi,
    /absent\s+(\w+)/gi,
  ];

  // Extract HIGH severity issues
  for (const pattern of highPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const context = text.substring(Math.max(0, match.index! - 50), match.index! + 100);
      if (context.toLowerCase().includes('ats') || context.toLowerCase().includes('tracking')) {
        issues.push({
          severity: 'HIGH',
          message: match[0].charAt(0).toUpperCase() + match[0].slice(1),
        });
      }
    }
  }

  // Add some default issues if none found
  if (issues.length === 0) {
    if (textLower.includes('missing') || textLower.includes('lack')) {
      issues.push({
        severity: 'HIGH',
        message: 'Missing industry-specific terms or keywords',
      });
    }
    if (textLower.includes('quantify') || textLower.includes('metrics')) {
      issues.push({
        severity: 'MEDIUM',
        message: 'Lack of quantifiable achievements',
      });
    }
    if (textLower.includes('format') || textLower.includes('structure')) {
      issues.push({
        severity: 'LOW',
        message: 'Section headers could be clearer',
      });
    }
  }

  return issues.slice(0, 5); // Limit to 5 issues
}

/**
 * Extract recommendations from text
 */
function extractRecommendations(text: string): string[] {
  const recommendations: string[] = [];
  const lines = text.split('\n');

  // Look for numbered lists or bullet points
  const patterns = [
    /^\d+[\.\)]\s*(.+)$/i, // Numbered lists
    /^[•\-\*]\s*(.+)$/i, // Bullet points
    /^recommendation\s*\d*:?\s*(.+)$/i, // Recommendation headers
  ];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length < 20 || trimmed.length > 200) continue;

    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) {
        const rec = match[1].trim();
        if (
          rec.length > 20 &&
          rec.length < 200 &&
          (rec.toLowerCase().includes('add') ||
            rec.toLowerCase().includes('improve') ||
            rec.toLowerCase().includes('include') ||
            rec.toLowerCase().includes('strengthen') ||
            rec.toLowerCase().includes('consider'))
        ) {
          recommendations.push(rec);
        }
      }
    }
  }

  // If no structured recommendations found, look for sentences with action words
  if (recommendations.length === 0) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (
        trimmed.length > 30 &&
        trimmed.length < 200 &&
        (trimmed.toLowerCase().startsWith('add') ||
          trimmed.toLowerCase().startsWith('include') ||
          trimmed.toLowerCase().startsWith('improve') ||
          trimmed.toLowerCase().startsWith('strengthen'))
      ) {
        recommendations.push(trimmed);
      }
    }
  }

  return recommendations.slice(0, 5); // Limit to 5 recommendations
}

