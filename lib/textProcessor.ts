interface TextAnalysis {
  readability: number;
  naturalness: number;
  variation: number;
  personality: number;
  grammar: number;
}

interface GrammarVariation {
  pattern: RegExp;
  replacement: string | ((match: string, ...args: any[]) => string);
}

export class TextProcessor {
  private static readonly PERSONALITY_TRAITS = [
    'casual', 'professional', 'academic', 'creative', 'technical'
  ];

  private static readonly GRAMMAR_VARIATIONS: GrammarVariation[] = [
    // Sentence structure variations
    { pattern: /\.\s+[A-Z]/g, replacement: '. ' },
    { pattern: /,\s+[a-z]/g, replacement: ', ' },
    // Natural language patterns
    { 
      pattern: /\b(I|we|you|they)\b/g, 
      replacement: (match: string) => Math.random() > 0.9 ? match.toLowerCase() : match 
    },
    // Common human writing patterns
    { 
      pattern: /\b(very|really|quite|somewhat)\b/g, 
      replacement: () => Math.random() > 0.8 ? '' : 'very' 
    },
  ];

  public static async processText(text: string): Promise<string> {
    // 1. Initial text analysis
    const analysis = this.analyzeText(text);
    
    // 2. Apply natural language variations
    let processedText = this.applyNaturalVariations(text);
    
    // 3. Add controlled imperfections
    processedText = this.addControlledImperfections(processedText);
    
    // 4. Adjust personality based on context
    processedText = this.adjustPersonality(processedText, analysis);
    
    // 5. Final polish
    processedText = this.finalPolish(processedText);
    
    return processedText;
  }

  private static analyzeText(text: string): TextAnalysis {
    return {
      readability: this.calculateReadability(text),
      naturalness: this.calculateNaturalness(text),
      variation: this.calculateVariation(text),
      personality: this.calculatePersonality(text),
      grammar: this.calculateGrammarScore(text)
    };
  }

  private static applyNaturalVariations(text: string): string {
    let result = text;
    
    // Apply grammar variations with proper typing
    for (const variation of this.GRAMMAR_VARIATIONS) {
      if (typeof variation.replacement === 'string') {
        result = result.replace(variation.pattern, variation.replacement);
      } else {
        result = result.replace(variation.pattern, variation.replacement);
      }
    }
    
    // Add natural pauses and transitions
    result = this.addNaturalPauses(result);
    
    return result;
  }

  private static addControlledImperfections(text: string): string {
    const words = text.split(' ');
    const result = words.map((word, index) => {
      // Occasionally add minor typos (1% chance)
      if (Math.random() < 0.01 && word.length > 3) {
        const pos = Math.floor(Math.random() * (word.length - 2)) + 1;
        return word.slice(0, pos) + word[pos + 1] + word[pos] + word.slice(pos + 2);
      }
      return word;
    }).join(' ');

    // Occasionally add filler words (2% chance)
    if (Math.random() < 0.02) {
      const fillers = ['um', 'well', 'you know', 'like'];
      const filler = fillers[Math.floor(Math.random() * fillers.length)];
      const sentences = result.split('.');
      const insertPos = Math.floor(Math.random() * sentences.length);
      sentences[insertPos] = sentences[insertPos].trim() + `, ${filler}, `;
      return sentences.join('.');
    }

    return result;
  }

  private static adjustPersonality(text: string, analysis: TextAnalysis): string {
    const personalityTrait = this.PERSONALITY_TRAITS[
      Math.floor(Math.random() * this.PERSONALITY_TRAITS.length)
    ];
    
    // Adjust text based on selected personality
    switch (personalityTrait) {
      case 'casual':
        return this.makeMoreCasual(text);
      case 'professional':
        return this.makeMoreProfessional(text);
      case 'academic':
        return this.makeMoreAcademic(text);
      case 'creative':
        return this.makeMoreCreative(text);
      case 'technical':
        return this.makeMoreTechnical(text);
      default:
        return text;
    }
  }

  private static finalPolish(text: string): string {
    // Ensure the text maintains readability while being undetectable
    return text
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,!?])/g, '$1')
      .trim();
  }

  private static calculateReadability(text: string): number {
    // Implement Flesch-Kincaid readability score
    const words = text.split(' ').length;
    const sentences = text.split(/[.!?]+/).length;
    const syllables = text.toLowerCase().replace(/[^aeiouy]+/g, ' ').trim().split(/\s+/).length;
    
    return 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  }

  private static calculateNaturalness(text: string): number {
    // Analyze natural language patterns
    const patterns = [
      /\b(um|uh|well|you know|like)\b/g,
      /[.!?]\s+[A-Z]/g,
      /,\s+[a-z]/g
    ];
    
    let score = 0;
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) score += matches.length;
    });
    
    return score / patterns.length;
  }

  private static calculateVariation(text: string): number {
    // Calculate sentence structure variation
    const sentences = text.split(/[.!?]+/);
    const lengths = sentences.map(s => s.trim().split(' ').length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, b) => a + Math.pow(b - avgLength, 2), 0) / lengths.length;
    
    return Math.min(variance / 100, 1);
  }

  private static calculatePersonality(text: string): number {
    // Analyze personality traits in text
    const traits = {
      casual: /\b(hey|hi|cool|awesome|great)\b/gi,
      professional: /\b(regards|sincerely|best|kind|respectfully)\b/gi,
      academic: /\b(research|study|analysis|findings|conclusion)\b/gi,
      creative: /\b(imagine|creative|artistic|inspired|unique)\b/gi,
      technical: /\b(algorithm|function|parameter|variable|system)\b/gi
    };
    
    let maxScore = 0;
    Object.values(traits).forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) maxScore = Math.max(maxScore, matches.length);
    });
    
    return maxScore / 5;
  }

  private static calculateGrammarScore(text: string): number {
    // Calculate grammar perfection score (lower is better for undetectability)
    const perfectPatterns = [
      /[A-Z][a-z]+ [A-Z][a-z]+/g, // Proper nouns
      /[^.!?]+[.!?]\s+[A-Z]/g,    // Perfect sentence structure
      /[^,]+,\s+[a-z]/g           // Perfect comma usage
    ];
    
    let score = 0;
    perfectPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) score += matches.length;
    });
    
    return Math.min(score / 10, 1);
  }

  private static addNaturalPauses(text: string): string {
    const sentences = text.split('.');
    return sentences.map((sentence, index) => {
      if (index < sentences.length - 1 && Math.random() < 0.3) {
        const pauses = ['...', ' - ', ', you see,', ', you know,'];
        const pause = pauses[Math.floor(Math.random() * pauses.length)];
        return sentence.trim() + pause;
      }
      return sentence.trim();
    }).join('. ');
  }

  private static makeMoreCasual(text: string): string {
    const casualPhrases = [
      'you know what I mean',
      'to be honest',
      'I think',
      'in my opinion',
      'basically'
    ];
    
    return this.insertRandomPhrases(text, casualPhrases);
  }

  private static makeMoreProfessional(text: string): string {
    const professionalPhrases = [
      'in accordance with',
      'with respect to',
      'as per',
      'in light of',
      'with regard to'
    ];
    
    return this.insertRandomPhrases(text, professionalPhrases);
  }

  private static makeMoreAcademic(text: string): string {
    const academicPhrases = [
      'according to research',
      'studies have shown',
      'the literature suggests',
      'empirical evidence indicates',
      'theoretical framework'
    ];
    
    return this.insertRandomPhrases(text, academicPhrases);
  }

  private static makeMoreCreative(text: string): string {
    const creativePhrases = [
      'imagine if',
      'picture this',
      'what if',
      'consider the possibility',
      'envision'
    ];
    
    return this.insertRandomPhrases(text, creativePhrases);
  }

  private static makeMoreTechnical(text: string): string {
    const technicalPhrases = [
      'the algorithm',
      'the system',
      'the process',
      'the implementation',
      'the architecture'
    ];
    
    return this.insertRandomPhrases(text, technicalPhrases);
  }

  private static insertRandomPhrases(text: string, phrases: string[]): string {
    const sentences = text.split('.');
    return sentences.map(sentence => {
      if (Math.random() < 0.3) {
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        return sentence.trim() + ', ' + phrase;
      }
      return sentence.trim();
    }).join('. ');
  }
} 