export type FormInputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export type ButtonType = 'submit' | 'reset' | 'button';

export type Note = {
  id: string;
  title: string;
  content: string[];
  createdAt: Date;
  updatedAt: Date;
};
