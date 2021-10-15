/// <reference types="@sveltejs/kit" />

type Note = {
  id: string;
  title?: string;
  content?: string;
  // onModalClick?: () => void;
};

type Icon = `add` | `generate` | `save` | `load` | `more` | `hamburger`;
