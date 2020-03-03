import React from 'react';
import styled from 'styled-components';
import { useNotes } from '../hooks/useNotes';
import Note from './Note';

const ListOfNotes = styled.section`
  display: grid;
  gap: 1rem 1rem;
  grid-template: repeat(auto-fill, 200px) / repeat(auto-fill, 200px);
`;

const NoteList = () => {
  const { notes } = useNotes();

  return (
    <ListOfNotes>
      {notes.map(({ id, title, content }) => (
        <Note key={id} id={id} title={title} content={content} />
      ))}
    </ListOfNotes>
  );
};

export default NoteList;
