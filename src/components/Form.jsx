import React, { useRef, useEffect, useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import clamp from '../utils/clamp';
import { generate, create } from '../utils/note';
import {
  FormFieldSet,
  FormLegend,
  NoteTitle,
  NoteContent,
  AddButton,
  GenerateButton,
  PlusButton,
  MinusButton,
  GenCount,
  GenerateFlex,
} from './styles/formStyles';

const Form = () => {
  const [genCount, setGenCount] = useState(1);
  const maxGenCount = 10;
  const title = useRef();
  const content = useRef();
  const addButton = useRef();
  const generateButton = useRef();
  const minusButton = useRef();
  const plusButton = useRef();
  const { addNote } = useNotes();

  useEffect(() => {
    const addBtn = addButton.current;
    const genBtn = generateButton.current;
    const minBtn = minusButton.current;
    const plsBtn = plusButton.current;
    const titleRef = title.current;
    const contentRef = content.current;

    const createNote = () => {
      const isValidTitle = titleRef.value !== null && titleRef.value !== ``;
      const isValidContent = contentRef.value !== null && contentRef.value !== ``;

      if (isValidTitle && isValidContent) {
        addNote(create(titleRef, contentRef));
      }
      // else {
      //   console.error(`Both Title and Content fields must not be empty!`);
      // }
    };

    const generateNote = () => {
      addNote(generate(genCount));
    };

    const genDecrement = () => setGenCount(clamp(0, maxGenCount, genCount - 1));
    const genIncrement = () => setGenCount(clamp(0, maxGenCount, genCount + 1));

    addBtn.addEventListener(`click`, createNote, false);
    genBtn.addEventListener(`click`, generateNote, false);
    minBtn.addEventListener(`click`, genDecrement, false);
    plsBtn.addEventListener(`click`, genIncrement, false);

    return () => {
      addBtn.removeEventListener(`click`, createNote, false);
      genBtn.removeEventListener(`click`, generateNote, false);
      minBtn.removeEventListener(`click`, genDecrement, false);
      plsBtn.removeEventListener(`click`, genIncrement, false);
    };
  }, [addNote, genCount]);

  return (
    <>
      <FormFieldSet>
        <FormLegend>Create</FormLegend>
        <NoteTitle ref={title} type="textfield" placeholder="Title" maxLength="30" />
        <NoteContent ref={content} placeholder="Contents" />

        <AddButton ref={addButton} type="button">
          Add Note
        </AddButton>
      </FormFieldSet>

      <FormFieldSet>
        <FormLegend>Generate</FormLegend>
        <GenerateFlex>
          <div>
            <MinusButton ref={minusButton} type="button">
              -
            </MinusButton>
            <GenCount value={genCount} readOnly />
            <PlusButton ref={plusButton} type="button">
              +
            </PlusButton>
          </div>
          <div>
            <GenerateButton ref={generateButton} type="button">
              Generate Note
            </GenerateButton>
          </div>
        </GenerateFlex>
      </FormFieldSet>
    </>
  );
};

export default Form;
