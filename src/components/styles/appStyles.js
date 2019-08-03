import styled, { createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';

export const GlobalStyle = createGlobalStyle`
  ${normalize()};
`;

export const Headline = styled.h1`
  font-family: 'Londrina Shadow', sans-serif;
  font-size: 2.5rem;
  font-weight: 400;
  margin: 0;
  padding: 0.2em 0;
  text-align: center;
  white-space: nowrap;
`;

export const Main = styled.main`
  display: flex;
  flex-flow: row nowrap;
`;

export const SideForm = styled.aside`
  flex: 0 1 20%;
  padding: 1rem;
`;

export const NoteSection = styled.section`
  flex: 1 1;
`;

export const ListOfNotes = styled.div`
  display: flex;
  flex-flow: row wrap;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;
