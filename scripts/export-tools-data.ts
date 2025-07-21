import { toolCategories } from '../client/src/lib/tools-config';
import fs from 'fs';
import path from 'path';

const outputPath = path.join(__dirname, 'tools-data.js');

// Write as a JS file that exports the categories
const fileContent = `// AUTO-GENERATED FILE. DO NOT EDIT.
// Run scripts/export-tools-data.ts to update.

export const toolCategories = ${JSON.stringify(toolCategories, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent);
console.log('tools-data.js generated from tools-config.ts');
