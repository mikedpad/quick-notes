import * as fs from 'fs';
import type { Note } from '../types/note';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';

const random = (range: number, min = 1): number => Math.floor(Math.random() * range + min);

const createName = (): string => {
  const val = random(3);
  switch (val) {
    case 1:
      return faker.name.gender();
    case 2:
      return faker.company.companyName();
    case 3:
      return `${faker.name.prefix()} ${faker.name.lastName()}`;
  }
};

const createTitle = (): string => {
  const val = random(3);
  switch (val) {
    case 1:
      return `${createName()} ${faker.hacker.verb()}`;
    case 2:
      return faker.hacker.phrase();
    case 3:
      return `${createName()} ${faker.hacker.verb()}s ${faker.random.word()}`;
    default:
      return `bummer`;
  }
};

function createContent(): string[] {
  return faker.lorem.paragraphs(random(6, 3)).split('\n \r');
}

const createNote = (): Note => {
  const date = faker.date.past(5);
  return {
    id: nanoid(),
    title: createTitle(),
    content: createContent(),
    createdAt: date,
    updatedAt: date,
  };
};

const notes: Note[] = Array.from({ length: 33 }).map(() => createNote());

const fileName = './src/data/notes.json';
const jsonData = JSON.stringify(notes, null, 2);
fs.writeFileSync(fileName, jsonData);
