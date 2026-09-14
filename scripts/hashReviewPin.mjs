import { createHash } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const prompt = createInterface({ input: stdin, output: stdout });
const value = await prompt.question('Review PIN or password: ');
prompt.close();

if (!value.trim()) {
  console.error('A value is required.');
  process.exitCode = 1;
} else {
  console.log(createHash('sha256').update(value).digest('hex'));
}
