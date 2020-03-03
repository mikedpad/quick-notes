import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNotes } from '../../hooks/useNotes';

const SaveButton = styled.button`
  background-color: #5af29e;
  border: 1px solid #999;
  border-radius: 0.15rem;
  padding: 0.25rem 0.5rem;
`;

const SaveNotes = () => {
  const saveButtonRef = useRef();
  const { saveNotes } = useNotes();

  useEffect(() => {
    const saveBtn = saveButtonRef.current;
    const saveNotesFunc = () => saveNotes();
    saveBtn.addEventListener(`click`, saveNotesFunc, false);
    return () => saveBtn.removeEventListener(`click`, saveNotesFunc, false);
  });

  return (
    <SaveButton ref={saveButtonRef} type="button">
      Save Notes
    </SaveButton>
  );
};

export default SaveNotes;
