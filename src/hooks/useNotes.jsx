import React, { useState, useContext, useMemo, createContext } from 'react';

const NoteContext = createContext();

function useNotes() {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error(`useNotes must be used within a NoteProvider`);
  }

  const [notes, setNotes] = context;

  return {
    notes,
    saveNotes: () => localStorage.setItem(`notes`, JSON.stringify(notes, null, 4)),
    loadNotes: () => setNotes([...JSON.parse(localStorage.getItem(`notes`))]),
    addNote: input =>
      Array.isArray(input) ? setNotes([...notes, ...input]) : setNotes([...notes, input]),
    removeNote: noteID => setNotes(notes.filter(({ id }) => id !== noteID)),
  };
}

function NoteProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const value = useMemo(() => [notes, setNotes], [notes]);
  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

export { NoteProvider, useNotes };
