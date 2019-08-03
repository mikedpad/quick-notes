import React from 'react';
import { useNotes } from '../hooks/useNotes';
import Note from './Note';
import { ListOfNotes } from './styles/noteListStyles';

const NoteList = () => {
  const { notes } = useNotes();

  return (
    <ListOfNotes>
      {notes.map(n => (
        <Note key={n.id} {...n} />
      ))}
    </ListOfNotes>
  );
};

export default NoteList;
