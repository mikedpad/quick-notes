import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { generate } from 'shortid';
import loremHipsum from 'lorem-hipsum';
import { randomColor } from '../utils/color';
import { useNotes } from './useNotes';

const NewNoteTitle = styled.input`
  display: block;
  margin: 0.25rem 0;
  width: 100%;
`;

const NewNoteContent = styled.textarea`
  display: block;
  height: 10em;
  margin: 0.25rem 0;
  resize: none;
  width: 100%;
`;

const AddButton = styled.button``;

const GenerateButton = styled.button``;

const Form = () => {
  const title = useRef();
  const content = useRef();
  const addButton = useRef();
  const generateButton = useRef();
  const { addNote } = useNotes();

  useEffect(() => {
    const addBtn = addButton.current;
    const genBtn = generateButton.current;
    const titleRef = title.current;
    const contentRef = content.current;

    const createNote = () => {
      const id = generate();
      addNote({
        id,
        title: titleRef.value,
        content: contentRef.value,
      });
    };

    const generateNote = () => {
      const id = generate();
      addNote({
        id,
        title: loremHipsum({
          sentenceLowerBound: 2,
          sentenceUpperBound: 6,
        }),
        content: loremHipsum({
          units: `paragraphs`,
        }),
      });
    };

    addBtn.addEventListener(`click`, createNote, false);
    genBtn.addEventListener(`click`, generateNote, false);

    return () => {
      addBtn.removeEventListener(`click`, createNote, false);
      genBtn.removeEventListener(`click`, generateNote, false);
    };
  }, [addNote]);

  return (
    <>
      <NewNoteTitle ref={title} type="textfield" placeholder="Title" maxLength="30" />
      <NewNoteContent ref={content} placeholder="Contents" />

      <AddButton ref={addButton} type="button" style={{ backgroundColor: randomColor() }}>
        Add Note
      </AddButton>
      <GenerateButton ref={generateButton} type="button" style={{ backgroundColor: randomColor() }}>
        Generate Note
      </GenerateButton>
    </>
  );
};

export default Form;
