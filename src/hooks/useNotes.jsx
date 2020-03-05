import React, { useContext, useMemo, createContext, useReducer } from 'react';
import { reducer, defaultState } from './reducers/notesReducer';
import useSnackMessages from './useSnackMessages';

const NoteContext = createContext();

function useNotes() {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error(`useNotes must be used within a NoteProvider`);
  }
  const [state, dispatch] = context;
  const { msgSuccess, msgError } = useSnackMessages();

  return {
    notes: state.notes,
    savedLocalNotes: state.savedLocalNotes,
    saveNotes: () => {
      if (state.notes.length < 1) {
        msgError(`There are no notes to save!`);
        return;
      }

      dispatch({ type: `SAVE_TO_LOCAL_STORAGE` });
      msgSuccess(`${state.notes.length} notes successfully saved!`);
    },
    loadNotes: () => {
      dispatch({ type: `LOAD_FROM_LOCAL_STORAGE` });
      msgSuccess(`Notes successfully restored!`);
    },
    addNote: notes => dispatch({ type: `ADD_NOTE`, payload: notes }),
    removeNote: id => dispatch({ type: `REMOVE_NOTE`, payload: id }),
    deleteNotes: () => dispatch({ type: `DELETE_ALL_NOTES` }),
  };
}

function NoteProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const value = useMemo(() => [state, dispatch], [state]);
  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

export { NoteProvider, useNotes };
