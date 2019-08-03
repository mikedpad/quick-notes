import React from 'react';
import { useNotes } from './useNotes';
import Note from './Note';
import { ListOfNotes } from './styles';

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
