/// <reference types="@sveltejs/kit" />

type Note = {
  id: string;
  title: string;
  content?: string;
  hidden?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type Icon = `add` | `generate` | `save` | `load` | `more` | `hamburger`;
