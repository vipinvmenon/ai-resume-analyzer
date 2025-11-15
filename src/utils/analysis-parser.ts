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

    // Extract skills - look for lists or mentions in specific sections
    const matchedSkillsRaw = extractSkillsFromSection(text, ['strengths', 'matched skills', 'found', 'skills that match']);
    const missingSkillsRaw = extractSkillsFromSection(text, ['gaps', 'missing skills', 'lack', 'absent', 'need', 'skills missing']);

    // Remove any skills that appear in both lists (prioritize matched skills)
    const matchedSkills = matchedSkillsRaw.filter(skill => !missingSkillsRaw.includes(skill));
    const missingSkills = missingSkillsRaw.filter(skill => !matchedSkillsRaw.includes(skill));

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
 * Extract skills from a specific section of the text
 */
function extractSkillsFromSection(text: string, sectionKeywords: string[]): string[] {
  const skills: string[] = [];
  
  // Find the section start - look for section headers with ** or numbered headers
  let sectionStart = -1;
  let sectionEnd = text.length;
  
  for (const keyword of sectionKeywords) {
    // Look for various header formats: "**Strengths**", "4. Strengths", "Strengths:", etc.
    const patterns = [
      new RegExp(`\\*\\*${keyword}\\*\\*`, 'i'),
      new RegExp(`\\d+[\.\)]\\s*${keyword}`, 'i'),
      new RegExp(`${keyword}:`, 'i'),
      new RegExp(`${keyword}`, 'i'),
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match.index !== undefined) {
        sectionStart = match.index;
        break;
      }
    }
    if (sectionStart !== -1) break;
  }
  
  if (sectionStart === -1) {
    return skills; // Section not found
  }
  
  // Find the end of this section (look for next major section header)
  const nextSectionMarkers = [
    'gaps',
    'missing',
    'strengths',
    'recommendations',
    'ats issues',
    'keywords',
    'overall',
    'score',
    'key keywords',
  ];
  
  // Look for the next section after the current one (skip at least 100 chars to avoid matching the same section)
  for (let i = sectionStart + 100; i < text.length; i += 50) {
    const remainingText = text.substring(i);
    for (const marker of nextSectionMarkers) {
      // Check for section headers (with ** or numbered)
      const headerPatterns = [
        new RegExp(`\\*\\*${marker}\\*\\*`, 'i'),
        new RegExp(`\\d+[\.\)]\\s*${marker}`, 'i'),
        new RegExp(`${marker}:`, 'i'),
      ];
      
      for (const pattern of headerPatterns) {
        if (pattern.test(remainingText.substring(0, 100))) {
          sectionEnd = i;
          break;
        }
      }
      if (sectionEnd < text.length) break;
    }
    if (sectionEnd < text.length) break;
  }
  
  // Extract the section content
  const sectionText = text.substring(sectionStart, sectionEnd);
  
  // Extract skills from bullet points or numbered lists in this section
  const listPatterns = [
    /[•\-\*]\s*([^•\-\*\n]+?)(?=\n|$|[•\-\*])/gi, // Bullet points
    /\d+[\.\)]\s*([^\d\n]+?)(?=\n|$|\d+[\.\)])/gi, // Numbered lists
  ];
  
  for (const pattern of listPatterns) {
    const matches = [...sectionText.matchAll(pattern)];
    for (const match of matches) {
      let item = match[1].trim().toLowerCase();
      // Clean up the item (remove common prefixes/suffixes)
      item = item.replace(/^(the|a|an|and|or)\s+/i, '');
      item = item.replace(/\s+(is|are|was|were|has|have|had)$/i, '');
      item = item.replace(/[.,;:!?]+$/, '');
      
      if (item.length > 2 && item.length < 50 && !skills.includes(item)) {
        // Filter out common non-skill phrases
        const nonSkillPhrases = [
          'the resume',
          'the candidate',
          'this resume',
          'overall',
          'generally',
          'well',
          'good',
          'excellent',
          'strong',
          'weak',
          'lacks',
          'missing',
        ];
        
        const isNonSkill = nonSkillPhrases.some(phrase => item.includes(phrase));
        if (!isNonSkill) {
          skills.push(item);
        }
      }
    }
  }
  
  // Also check for skills mentioned in sentences (look for common skill patterns)
  const commonSkills = [
    'react', 'javascript', 'typescript', 'python', 'java', 'node.js', 'aws',
    'docker', 'kubernetes', 'git', 'sql', 'mongodb', 'postgresql', 'html',
    'css', 'angular', 'vue', 'redux', 'graphql', 'rest api', 'ci/cd',
    'agile', 'scrum', 'leadership', 'communication', 'problem solving',
    'recruitment', 'onboarding', 'payroll', 'hr', 'ats', 'compliance',
  ];
  
  for (const skill of commonSkills) {
    if (sectionText.includes(skill) && !skills.includes(skill)) {
      skills.push(skill);
    }
  }
  
  return skills.slice(0, 20); // Limit to 20 skills
}

/**
 * Extract keywords with their counts from the "Key Keywords" section
 */
function extractKeywords(text: string): KeywordDensity[] {
  const keywords: KeywordDensity[] = [];
  const textLower = text.toLowerCase();
  
  // Find the "Key Keywords" section
  const keywordSectionKeywords = [
    'key keywords',
    'keywords',
    'important keywords',
    'keyword density',
  ];
  
  let sectionStart = -1;
  
  for (const keyword of keywordSectionKeywords) {
    const patterns = [
      new RegExp(`\\*\\*${keyword}\\*\\*`, 'i'),
      new RegExp(`\\d+[\.\)]\\s*${keyword}`, 'i'),
      new RegExp(`${keyword}:`, 'i'),
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match.index !== undefined) {
        sectionStart = match.index;
        break;
      }
    }
    if (sectionStart !== -1) break;
  }
  
  // If section found, extract from it; otherwise search entire text
  const searchText = sectionStart !== -1 
    ? text.substring(sectionStart, Math.min(sectionStart + 1000, text.length))
    : text;
  
  // Filter out non-keyword words that shouldn't be displayed
  const nonKeywordWords = new Set([
    'score', 'rate', 'graduation', 'overall', 'match', 'compatibility',
    'ats', 'applicant', 'tracking', 'system', 'resume', 'job', 'description',
    'the', 'and', 'or', 'for', 'with', 'from', 'that', 'this', 'these',
    'are', 'is', 'was', 'were', 'has', 'have', 'had', 'will', 'would',
    'should', 'could', 'may', 'might', 'can', 'must', 'need', 'required',
    'provide', 'include', 'mention', 'list', 'format', 'section', 'header',
  ]);
  
  // Extract keywords with counts from patterns like:
  // - "keyword: 5" or "keyword (5)" or "keyword - 5"
  // - Bullet points with keywords and counts
  // - "keyword appears 5 times" or "keyword: 5 times"
  const keywordPatterns = [
    /([a-z][a-z0-9\s-]{2,25}?)\s*[:\(-]\s*(\d+)\s*(?:times?|count|frequency)?/gi,
    /[•\-\*]\s*([a-z][a-z0-9\s-]{2,25}?)\s*[:\(-]\s*(\d+)/gi,
    /([a-z][a-z0-9\s-]{2,25}?)\s+(?:appears|mentioned|found)\s+(\d+)/gi,
  ];
  
  const keywordMap = new Map<string, number>();
  
  for (const pattern of keywordPatterns) {
    const matches = [...searchText.matchAll(pattern)];
    for (const match of matches) {
      let keyword = (match[1] || match[2] || '').trim().toLowerCase();
      const count = parseInt(match[2] || match[3] || match[4] || '1');
      
      // Skip if count is unreasonably high (likely a year or ID, not a frequency)
      if (count > 100) continue;
      
      // Clean up keyword
      keyword = keyword.replace(/[.,;:!?()]+$/, '');
      keyword = keyword.replace(/^(the|a|an|and|or|for|with|from|of|in|on|at|to)\s+/i, '');
      keyword = keyword.replace(/\s+(times?|count|frequency|appears|mentioned|found)$/i, '');
      
      // Skip if it's a non-keyword word or too short/long
      if (
        keyword.length >= 3 && 
        keyword.length <= 30 && 
        !nonKeywordWords.has(keyword) &&
        !/^\d+$/.test(keyword) && // Not just numbers
        !keyword.includes('score') &&
        !keyword.includes('rate') &&
        !keyword.includes('graduation') &&
        !keyword.includes('overall') &&
        !keyword.includes('match') &&
        count > 0 &&
        count <= 100
      ) {
        // Use the count from the match
        const existingCount = keywordMap.get(keyword) || 0;
        keywordMap.set(keyword, Math.max(existingCount, count));
      }
    }
  }
  
  // Also look for common technical/professional keywords mentioned in the text
  const commonKeywords = [
    'react', 'javascript', 'typescript', 'python', 'java', 'node.js', 'aws',
    'docker', 'kubernetes', 'git', 'sql', 'mongodb', 'postgresql', 'html',
    'css', 'angular', 'vue', 'redux', 'graphql', 'rest api', 'ci/cd',
    'agile', 'scrum', 'leadership', 'communication', 'problem solving',
    'recruitment', 'onboarding', 'payroll', 'hr', 'compliance', 'ats',
    'management', 'development', 'engineering', 'design', 'analysis',
  ];
  
  for (const keyword of commonKeywords) {
    if (!keywordMap.has(keyword)) {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const count = (textLower.match(regex) || []).length;
      if (count > 0) {
        keywordMap.set(keyword, count);
      }
    }
  }
  
  // Convert to array, filter out invalid keywords, and sort by count
  for (const [keyword, count] of keywordMap.entries()) {
    // Final validation - skip if it looks like a non-keyword
    if (
      keyword.length >= 3 &&
      keyword.length <= 30 &&
      !nonKeywordWords.has(keyword) &&
      !/^\d+$/.test(keyword) &&
      count > 0
    ) {
      keywords.push({
        keyword: keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        count,
        isPresent: count > 0,
      });
    }
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

