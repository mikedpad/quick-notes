import React, { useRef, useEffect } from 'react';
import { generate } from 'shortid';
import loremHipsum from 'lorem-hipsum';
import { useNotes } from '../hooks/useNotes';
import {
  NewNoteTitle,
  NewNoteContent,
  AddButton,
  GenerateButton,
  FormFieldSet,
  FormLegend,
} from './styles/formStyles';
import { randomColor } from '../utils/color';

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
      <FormFieldSet>
        <FormLegend>Create Note</FormLegend>
        <NewNoteTitle ref={title} type="textfield" placeholder="Title" maxLength="30" />
        <NewNoteContent ref={content} placeholder="Contents" />

        <AddButton ref={addButton} type="button" style={{ backgroundColor: randomColor() }}>
          Add Note
        </AddButton>
      </FormFieldSet>

      <FormFieldSet>
        <FormLegend>Generate Notes</FormLegend>
        <GenerateButton
          ref={generateButton}
          type="button"
          style={{ backgroundColor: randomColor() }}
        >
          Generate Note
        </GenerateButton>
      </FormFieldSet>
    </>
  );
};

export default Form;
