import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { generate } from 'shortid';
import loremHipsum from 'lorem-hipsum';
import { useNotes } from '../../hooks/useNotes';
import NoteFormFrame from './NoteFormFrame';

const Button = styled.button`
  background-color: #5af29e;
  border: 1px solid #999;
  border-radius: 0.15rem;
  padding: 0.25rem 0.5rem;

  &:disabled {
    background-color: #efefef;
  }
`;

const PlusButton = styled(Button)``;
const MinusButton = styled(Button)``;
const GenButton = styled(Button)``;

const GenCount = styled.input`
  border: 1px solid #999;
  border-radius: 0.15rem;
  box-sizing: border-box;
  display: inline-block;
  display: block;
  margin: 0.25rem 0.5rem;
  padding: 0.25rem;
  width: 2em;
`;

const GenerateFlex = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const clamp = (min, max, value) => Math.min(max, Math.max(min, value));

const GenerateNote = () => {
  const [genCount, setGenCount] = useState(1);
  const minusButton = useRef();
  const plusButton = useRef();
  const generateButton = useRef();
  const maxGenCount = 10;
  const { addNote } = useNotes();

  useEffect(() => {
    const genBtn = generateButton.current;
    const minBtn = minusButton.current;
    const plsBtn = plusButton.current;

    const generateNote = () => {
      addNote(
        Array.from({ length: genCount }, (_, i) => i).map(() => ({
          id: generate(),
          title: loremHipsum({ sentenceLowerBound: 2, sentenceUpperBound: 6 }),
          content: loremHipsum({ units: `paragraphs` }),
        })),
      );
    };
    const genDecrement = () => setGenCount(clamp(0, maxGenCount, genCount - 1));
    const genIncrement = () => setGenCount(clamp(0, maxGenCount, genCount + 1));

    genBtn.addEventListener(`click`, generateNote, false);
    minBtn.addEventListener(`click`, genDecrement, false);
    plsBtn.addEventListener(`click`, genIncrement, false);

    return () => {
      genBtn.removeEventListener(`click`, generateNote, false);
      minBtn.removeEventListener(`click`, genDecrement, false);
      plsBtn.removeEventListener(`click`, genIncrement, false);
    };
  }, [addNote, genCount]);

  return (
    <NoteFormFrame label="Generate">
      <GenerateFlex>
        <MinusButton ref={minusButton} type="button">
          -
        </MinusButton>
        <GenCount value={genCount} readOnly />
        <PlusButton ref={plusButton} type="button">
          +
        </PlusButton>
        <GenButton ref={generateButton} type="button">
          Generate Note
        </GenButton>
      </GenerateFlex>
    </NoteFormFrame>
  );
};

export default GenerateNote;
