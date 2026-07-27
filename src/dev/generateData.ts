/**
 * Regenerates the first-run sample notes: `pnpm generateData`.
 *
 * Build-time authoring tool, not application code. It deliberately declares its
 * own output shape rather than importing the domain model, so the generator and
 * the storage schema can change independently — `$lib/data/seed.ts` is the
 * single place that maps between them.
 */
import * as fs from 'fs';
import { faker } from '@faker-js/faker';

type SeedNote = {
  id: string;
  title: string;
  content: string[];
  createdAt: string;
  updatedAt: string;
};

const OUTPUT = './src/lib/data/seed.json';
const COUNT = 33;

const random = (range: number, min = 1): number => Math.floor(Math.random() * range + min);

const createName = (): string => {
  switch (random(3)) {
    case 1:
      return faker.person.gender();
    case 2:
      return faker.company.name();
    default:
      return `${faker.person.prefix()} ${faker.person.lastName()}`;
  }
};

const createTitle = (): string => {
  switch (random(3)) {
    case 1:
      return `${createName()} ${faker.hacker.verb()}`;
    case 2:
      return faker.hacker.phrase();
    default:
      return `${createName()} ${faker.hacker.verb()}s ${faker.word.sample()}`;
  }
};

const createContent = (): string[] => faker.lorem.paragraphs({ min: 3, max: 8 }, '\n').split('\n');

const createNote = (): SeedNote => {
  const date = faker.date.past({ years: 5 }).toISOString();
  return {
    id: crypto.randomUUID(),
    title: createTitle(),
    content: createContent(),
    createdAt: date,
    updatedAt: date,
  };
};

const notes: SeedNote[] = Array.from({ length: COUNT }, createNote);

fs.writeFileSync(OUTPUT, `${JSON.stringify(notes, null, 2)}\n`);
console.log(`Wrote ${notes.length} notes to ${OUTPUT}`);
