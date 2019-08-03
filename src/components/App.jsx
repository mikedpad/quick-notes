import React from 'react';
import { GlobalStyle, Headline, Main, SideForm, NoteSection } from './styles/appStyles';
import Form from './Form';
import { NoteProvider } from '../hooks/useNotes';
import NoteList from './NoteList';

const App = () => {
  return (
    <>
      <GlobalStyle />
      <header>
        <Headline>Quick Notes</Headline>
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
