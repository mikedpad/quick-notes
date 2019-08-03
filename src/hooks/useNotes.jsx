import React, { useState, useContext, useMemo, createContext } from 'react';

const NoteContext = createContext();

function useNotes() {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error(`useNotes must be used within a NoteProvider`);
  }

  const [notes, setNotes] = context;

  const removeNote = noteID => {
    setNotes(notes.filter(({ id }) => id !== noteID));
  };

  const addNote = note => {
    setNotes([...notes, note]);
  };

  return {
    notes,
    addNote,
    removeNote,
  };
}

function NoteProvider(props) {
  const [notes, setNotes] = useState([]);
  const value = useMemo(() => [notes, setNotes], [notes]);
  return <NoteContext.Provider value={value} {...props} />;
}

export { NoteProvider, useNotes };
