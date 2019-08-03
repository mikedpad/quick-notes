import React from 'react';
import { GlobalStyle, Headline, Main, SideForm, NoteSection } from './styles';
import Form from './Form';
import { NoteProvider } from './useNotes';
import NoteList from './NoteList';
import { randomColor } from '../utils/color';

const App = () => {
  return (
    <>
      <GlobalStyle />
      <header>
        <Headline style={{ backgroundColor: randomColor() }}>Quick Notes</Headline>
      </header>
      <Main>
        <NoteProvider>
          <SideForm>
            <Form />
          </SideForm>
          <NoteSection>
            <NoteList />
          </NoteSection>
        </NoteProvider>
      </Main>
    </>
  );
};

export default App;
