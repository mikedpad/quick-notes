import faker from '@faker-js/faker';

const random = (range: number, min = 1): number => Math.floor(Math.random() * range + min);

const createID = (): string => faker.datatype.uuid();

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

const createContent = (): string => {
  return faker.lorem.sentences();
};

export const createNote = (): Note => ({
  id: createID(),
  title: createTitle(),
  content: createContent(),
  hidden: false,
  createdAt: new Date(),
  updatedAt: undefined,
});
