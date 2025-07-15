export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  component: string;
}

export const toolCategories = [
  {
    id: "converters",
    name: "Converters & Encoders",
    tools: [
      {
        id: "unix-time",
        name: "Unix Time Converter",
        description: "Convert between Unix timestamps and human-readable dates",
        icon: "Clock",
        category: "converters",
        component: "UnixTimeConverter"
      },
      {
        id: "base64-string",
        name: "Base64 String",
        description: "Encode and decode Base64 strings",
        icon: "Code",
        category: "converters",
        component: "Base64Encoder"
      },
      {
        id: "base64-image",
        name: "Base64 Image",
        description: "Convert images to Base64 and vice versa",
        icon: "Image",
        category: "converters",
        component: "Base64Image"
      },
      {
        id: "url-encode",
        name: "URL Encode/Decode",
        description: "Encode and decode URLs",
        icon: "Link",
        category: "converters",
        component: "URLEncoder"
      },
      {
        id: "html-entity",
        name: "HTML Entity",
        description: "Encode and decode HTML entities",
        icon: "Code",
        category: "converters",
        component: "HTMLEntityEncoder"
      },
      {
        id: "hex-ascii",
        name: "Hex ↔ ASCII",
        description: "Convert between hexadecimal and ASCII",
        icon: "ArrowRightLeft",
        category: "converters",
        component: "HexAsciiConverter"
      },
      {
        id: "number-base",
        name: "Number Base Converter",
        description: "Convert between different number bases",
        icon: "Calculator",
        category: "converters",
        component: "NumberBaseConverter"
      }
    ]
  },
  {
    id: "json-data",
    name: "JSON & Data Tools",
    tools: [
      {
        id: "json-format",
        name: "JSON Format/Validate",
        description: "Format, validate and beautify JSON",
        icon: "FileCode",
        category: "json-data",
        component: "JSONFormatter"
      },
      {
        id: "yaml-json",
        name: "YAML ↔ JSON",
        description: "Convert between YAML and JSON formats",
        icon: "ArrowRightLeft",
        category: "json-data",
        component: "YAMLJSONConverter"
      },
      {
        id: "json-csv",
        name: "JSON ↔ CSV",
        description: "Convert between JSON and CSV formats",
        icon: "Table",
        category: "json-data",
        component: "JSONCSVConverter"
      },
      {
        id: "json-to-code",
        name: "JSON to Code",
        description: "Generate code from JSON data",
        icon: "Code",
        category: "json-data",
        component: "JSONToCode"
      },
      {
        id: "php-json",
        name: "PHP ↔ JSON",
        description: "Convert between PHP and JSON formats",
        icon: "ArrowRightLeft",
        category: "json-data",
        component: "PHPJSONConverter"
      }
    ]
  },
  {
    id: "code-tools",
    name: "Code Tools",
    tools: [
      {
        id: "jwt-debugger",
        name: "JWT Debugger",
        description: "Debug and inspect JWT tokens",
        icon: "Key",
        category: "code-tools",
        component: "JWTDebugger"
      },
      {
        id: "html-jsx",
        name: "HTML to JSX",
        description: "Convert HTML to JSX format",
        icon: "Code",
        category: "code-tools",
        component: "HTMLJSXConverter"
      },
      {
        id: "sql-formatter",
        name: "SQL Formatter",
        description: "Format and beautify SQL queries",
        icon: "Database",
        category: "code-tools",
        component: "SQLFormatter"
      },
      {
        id: "beautify-minify",
        name: "Beautify/Minify",
        description: "Beautify or minify code (HTML, CSS, JS, etc.)",
        icon: "Wand2",
        category: "code-tools",
        component: "CodeBeautifier"
      },
      {
        id: "curl-to-code",
        name: "cURL to Code",
        description: "Convert cURL commands to code",
        icon: "Code",
        category: "code-tools",
        component: "CurlToCode"
      },
      {
        id: "svg-css",
        name: "SVG to CSS",
        description: "Convert SVG to CSS",
        icon: "Palette",
        category: "code-tools",
        component: "SVGCSSConverter"
      }
    ]
  },
  {
    id: "text-tools",
    name: "Text & String Tools",
    tools: [
      {
        id: "regex-tester",
        name: "RegExp Tester",
        description: "Test regular expressions with highlighting",
        icon: "Search",
        category: "text-tools",
        component: "RegexTester"
      },
      {
        id: "text-diff",
        name: "Text Diff Checker",
        description: "Compare text with side-by-side diff",
        icon: "GitCompare",
        category: "text-tools",
        component: "TextDiff"
      },
      {
        id: "string-case",
        name: "String Case Converter",
        description: "Convert between different string cases",
        icon: "Type",
        category: "text-tools",
        component: "StringCaseConverter"
      },
      {
        id: "lorem-ipsum",
        name: "Lorem Ipsum Generator",
        description: "Generate placeholder text",
        icon: "FileText",
        category: "text-tools",
        component: "LoremIpsum"
      },
      {
        id: "string-inspector",
        name: "String Inspector",
        description: "Analyze string properties and characters",
        icon: "Search",
        category: "text-tools",
        component: "StringInspector"
      },
      {
        id: "backslash-escape",
        name: "Backslash Escape/Unescape",
        description: "Escape and unescape backslashes",
        icon: "Code",
        category: "text-tools",
        component: "BackslashEscape"
      },
      {
        id: "line-sort-dedupe",
        name: "Line Sort/Dedupe",
        description: "Sort lines and remove duplicates",
        icon: "ArrowUpDown",
        category: "text-tools",
        component: "LineSortDedupe"
      }
    ]
  },
  {
    id: "utilities",
    name: "Utilities",
    tools: [
      {
        id: "uuid-generator",
        name: "UUID/ULID Generator",
        description: "Generate and decode UUIDs and ULIDs",
        icon: "Fingerprint",
        category: "utilities",
        component: "UUIDGenerator"
      },
      {
        id: "qr-code",
        name: "QR Code Tools",
        description: "Generate and read QR codes",
        icon: "QrCode",
        category: "utilities",
        component: "QRCodeTools"
      },
      {
        id: "hash-generator",
        name: "Hash Generator",
        description: "Generate various hash types",
        icon: "Lock",
        category: "utilities",
        component: "HashGenerator"
      },
      {
        id: "color-converter",
        name: "Color Converter",
        description: "Convert between color formats",
        icon: "Palette",
        category: "utilities",
        component: "ColorConverter"
      },
      {
        id: "random-string",
        name: "Random String Generator",
        description: "Generate random strings with options",
        icon: "Shuffle",
        category: "utilities",
        component: "RandomStringGenerator"
      },
      {
        id: "url-parser",
        name: "URL Parser",
        description: "Parse URLs and extract components",
        icon: "Link",
        category: "utilities",
        component: "URLParser"
      },
      {
        id: "cron-parser",
        name: "Cron Job Parser",
        description: "Parse and explain cron expressions",
        icon: "Clock",
        category: "utilities",
        component: "CronParser"
      },
      {
        id: "certificate-decoder",
        name: "Certificate Decoder",
        description: "Decode X.509 certificates",
        icon: "Shield",
        category: "utilities",
        component: "CertificateDecoder"
      },
      {
        id: "php-serializer",
        name: "PHP Serializer",
        description: "Serialize and unserialize PHP data",
        icon: "Code",
        category: "utilities",
        component: "PHPSerializer"
      }
    ]
  },
  {
    id: "preview-tools",
    name: "Preview Tools",
    tools: [
      {
        id: "html-preview",
        name: "HTML Preview",
        description: "Preview HTML code in real-time",
        icon: "Eye",
        category: "preview-tools",
        component: "HTMLPreview"
      },
      {
        id: "markdown-preview",
        name: "Markdown Preview",
        description: "Preview Markdown with live rendering",
        icon: "FileText",
        category: "preview-tools",
        component: "MarkdownPreview"
      }
    ]
  }
];

export const allTools = toolCategories.flatMap(category => category.tools);

export function getToolById(id: string): Tool | undefined {
  return allTools.find(tool => tool.id === id);
}

export function getToolsByCategory(categoryId: string): Tool[] {
  const category = toolCategories.find(cat => cat.id === categoryId);
  return category ? category.tools : [];
}
