import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNotes } from '../../hooks/useNotes';

const LoadButton = styled.button`
  background-color: #5af29e;
  border: 1px solid #999;
  border-radius: 0.15rem;
  padding: 0.25rem 0.5rem;
`;

const LoadNotes = () => {
  const loadButtonRef = useRef();
  const { loadNotes } = useNotes();

  useEffect(() => {
    const loadBtn = loadButtonRef.current;
    const loadNotesFunc = () => loadNotes();
    loadBtn.addEventListener(`click`, loadNotesFunc, false);
    return () => loadBtn.removeEventListener(`click`, loadNotesFunc, false);
  });

  return (
    <LoadButton ref={loadButtonRef} type="button">
      Load Notes
    </LoadButton>
  );
};

export default LoadNotes;
