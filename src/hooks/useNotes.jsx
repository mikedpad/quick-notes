import React, { useState, useContext, useMemo, createContext } from 'react';
import useSnackMessages from './useSnackMessages';

const NoteContext = createContext();

function useNotes() {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error(`useNotes must be used within a NoteProvider`);
  }

  const [notes, setNotes] = context;
  const { msgSuccess, msgError } = useSnackMessages();

  return {
    notes,
    saveNotes: () => {
      if (notes.length < 1) {
        msgError(`There are no notes to save!`);
        return;
      }

      localStorage.setItem(`notes`, JSON.stringify(notes, null, 4));
      msgSuccess(`${notes.length} notes successfully saved!`);
    },
    loadNotes: () => {
      try {
        const restoredNotes = JSON.parse(localStorage.getItem(`notes`));
        setNotes([...restoredNotes]);
        msgSuccess(`${restoredNotes.length} notes successfully restored!`);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        msgError(`There are no notes in storage!`);
      }
    },
    addNote: input =>
      Array.isArray(input) ? setNotes([...notes, ...input]) : setNotes([...notes, input]),
    removeNote: noteID => setNotes(notes.filter(({ id }) => id !== noteID)),
    clearNotes: () => setNotes([]),
  };
}

function NoteProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const value = useMemo(() => [notes, setNotes], [notes]);
  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

export { NoteProvider, useNotes };
