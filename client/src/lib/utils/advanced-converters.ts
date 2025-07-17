import yaml from 'js-yaml';

// YAML/JSON conversion
export function yamlToJson(yamlString: string): string {
  try {
    const parsed = yaml.load(yamlString);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    throw new Error(`YAML parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function jsonToYaml(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    return yaml.dump(parsed, { indent: 2 });
  } catch (error) {
    throw new Error(`JSON parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// CSV/JSON conversion
export function jsonToCsv(jsonString: string): string {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) {
      throw new Error('JSON must be an array of objects');
    }

    if (data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  } catch (error) {
    throw new Error(`JSON to CSV conversion error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function csvToJson(csvString: string): string {
  try {
    const lines = csvString.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const obj: any = {};

      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });

      result.push(obj);
    }

    return JSON.stringify(result, null, 2);
  } catch (error) {
    throw new Error(`CSV to JSON conversion error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Color conversion utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error('Invalid hex color');
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// Lorem Ipsum generator
export function generateLoremIpsum(paragraphs: number, wordsPerParagraph: number): string {
  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const result = [];

  for (let p = 0; p < paragraphs; p++) {
    const paragraph = [];
    for (let w = 0; w < wordsPerParagraph; w++) {
      const word = words[Math.floor(Math.random() * words.length)];
      paragraph.push(w === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word);
    }
    result.push(paragraph.join(' ') + '.');
  }

  return result.join('\n\n');
}

// String analysis
export function analyzeString(text: string) {
  const lines = text.split('\n');
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Calculate byte size (UTF-8 encoding)
  const byteSize = new TextEncoder().encode(text).length;

  // Character frequency
  const charFreq: { [key: string]: number } = {};
  for (const char of text) {
    charFreq[char] = (charFreq[char] || 0) + 1;
  }

  return {
    characters,
    charactersNoSpaces,
    words: words.length,
    lines: lines.length,
    sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
    averageWordsPerSentence: words.length / text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 0,
    mostFrequentChar: Object.entries(charFreq).sort(([,a], [,b]) => b - a)[0]?.[0] || '',
    charFrequency: charFreq,
    byteSize
  };
}

// HTML to JSX conversion
export function htmlToJsx(html: string): string {
  return html
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/tabindex=/g, 'tabIndex=')
    .replace(/readonly=/g, 'readOnly=')
    .replace(/maxlength=/g, 'maxLength=')
    .replace(/cellpadding=/g, 'cellPadding=')
    .replace(/cellspacing=/g, 'cellSpacing=')
    .replace(/rowspan=/g, 'rowSpan=')
    .replace(/colspan=/g, 'colSpan=')
    .replace(/usemap=/g, 'useMap=')
    .replace(/frameborder=/g, 'frameBorder=')
    .replace(/contenteditable=/g, 'contentEditable=')
    .replace(/crossorigin=/g, 'crossOrigin=')
    .replace(/datetime=/g, 'dateTime=')
    .replace(/enctype=/g, 'encType=')
    .replace(/formaction=/g, 'formAction=')
    .replace(/formenctype=/g, 'formEncType=')
    .replace(/formmethod=/g, 'formMethod=')
    .replace(/formnovalidate=/g, 'formNoValidate=')
    .replace(/formtarget=/g, 'formTarget=')
    .replace(/marginheight=/g, 'marginHeight=')
    .replace(/marginwidth=/g, 'marginWidth=')
    .replace(/novalidate=/g, 'noValidate=')
    .replace(/radiogroup=/g, 'radioGroup=')
    .replace(/spellcheck=/g, 'spellCheck=')
    .replace(/srcdoc=/g, 'srcDoc=')
    .replace(/srclang=/g, 'srcLang=')
    .replace(/srcset=/g, 'srcSet=')
    .replace(/autofocus=/g, 'autoFocus=')
    .replace(/autoplay=/g, 'autoPlay=')
    .replace(/controlslist=/g, 'controlsList=')
    .replace(/<!--/g, '{/*')
    .replace(/-->/g, '*/}');
}

// Cron expression parser
export function parseCronExpression(expression: string): string {
  const parts = expression.trim().split(/\s+/);

  if (parts.length !== 5 && parts.length !== 6) {
    throw new Error('Invalid cron expression. Expected 5 or 6 parts.');
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek, year] = parts;

  const parseField = (value: string, fieldName: string, min: number, max: number): string => {
    if (value === '*') return `any ${fieldName}`;
    if (value.includes('/')) {
      const [range, step] = value.split('/');
      const baseRange = range === '*' ? `${min}-${max}` : range;
      return `every ${step} ${fieldName}(s) in range ${baseRange}`;
    }
    if (value.includes('-')) {
      return `${fieldName}(s) from ${value}`;
    }
    if (value.includes(',')) {
      return `${fieldName}(s): ${value}`;
    }
    return `${fieldName} ${value}`;
  };

  const minuteDesc = parseField(minute, 'minute', 0, 59);
  const hourDesc = parseField(hour, 'hour', 0, 23);
  const dayOfMonthDesc = parseField(dayOfMonth, 'day of month', 1, 31);
  const monthDesc = parseField(month, 'month', 1, 12);
  const dayOfWeekDesc = parseField(dayOfWeek, 'day of week', 0, 6);

  let description = `At ${minuteDesc} of ${hourDesc}, on ${dayOfMonthDesc} of ${monthDesc}, and on ${dayOfWeekDesc}`;

  if (year) {
    const yearDesc = parseField(year, 'year', 1970, 3000);
    description += `, in ${yearDesc}`;
  }

  return description;
}
