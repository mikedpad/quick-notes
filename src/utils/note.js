import loremHipsum from 'lorem-hipsum';
import { generate as generateID } from 'shortid';

export function create(title, content) {
  return {
    id: generateID(),
    title: title.value,
    content: content.value,
  };
}

export function generate(num = 1) {
  return Array.from({ length: num }, (_, i) => i).map(() => ({
    id: generateID(),
    title: loremHipsum({
      sentenceLowerBound: 2,
      sentenceUpperBound: 6,
    }),
    content: loremHipsum({
      units: `paragraphs`,
    }),
  }));
}
