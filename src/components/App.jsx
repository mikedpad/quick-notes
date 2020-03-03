import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';
import Form from './Form';
import { NoteProvider } from '../hooks/useNotes';
import NoteList from './NoteList';

const GlobalStyle = createGlobalStyle`
  ${normalize()};
`;

const Headline = styled.h1`
  font-family: 'Londrina Shadow', sans-serif;
  font-size: 2.5rem;
  font-weight: 400;
  margin: 0;
  padding: 0.2em 0;
  text-align: center;
  white-space: nowrap;
`;

const SideForm = styled.aside`
  flex: 0 1 20%;
  padding: 1rem;
`;

const NoteSection = styled.section`
  flex: 1 1;
`;

const Main = styled.main`
  display: flex;
  flex-flow: row nowrap;
`;

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
