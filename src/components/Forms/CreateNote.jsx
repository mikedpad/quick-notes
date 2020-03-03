import React, { useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { generate } from 'shortid';
import { useNotes } from '../../hooks/useNotes';
import NoteFormFrame from './NoteFormFrame';

const TextFieldStyle = css`
  border: 1px solid #999;
  border-radius: 0.15rem;
  box-sizing: border-box;
  display: block;
  margin: 0.25rem 0;
  padding: 0.25rem;
  &::placeholder {
    color: #666;
    opacity: 1;
  }
`;

const NoteTitle = styled.input`
  ${TextFieldStyle}
  width: 100%;
`;
const NoteContent = styled.textarea`
  ${TextFieldStyle}
  height: 10em;
  resize: none;
  width: 100%;
`;

const AddButton = styled.button`
  background-color: #5af29e;
  border: 1px solid #999;
  border-radius: 0.15rem;
  padding: 0.25rem 0.5rem;
`;

const CreateNote = () => {
  const titleRef = useRef();
  const contentRef = useRef();
  const addButtonRef = useRef();
  const { addNote } = useNotes();

  useEffect(() => {
    const addBtn = addButtonRef.current;
    const titleCurrentRef = titleRef.current;
    const contentCurrentRef = contentRef.current;

    const createNote = () => {
      const id = generate();
      const title = titleCurrentRef.value;
      const content = contentCurrentRef.value;
      const isValidTitle = title !== null && title !== ``;
      const isValidContent = content !== null && content !== ``;

      if (isValidTitle && isValidContent) {
        addNote({ id, title, content });
      }
    };

    addBtn.addEventListener(`click`, createNote, false);

    return () => {
      addBtn.removeEventListener(`click`, createNote, false);
    };
  });

  return (
    <NoteFormFrame label="Create">
      <NoteTitle ref={titleRef} type="textfield" placeholder="Title" maxLength="30" />
      <NoteContent ref={contentRef} placeholder="Contents" />
      <AddButton ref={addButtonRef} type="button">
        Add Note
      </AddButton>
    </NoteFormFrame>
  );
};

export default CreateNote;
