import styled, { createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';
import { noteSize } from '../utils/vars';

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

export const Card = styled.article`
  /* background: rgb(158, 158, 64); */
  /* background: linear-gradient(350deg, rgb(209, 209, 54) 0%, rgb(255, 255, 136) 20%); */
  display: flex;
  flex-flow: column nowrap;
  height: ${noteSize};
  margin: 1rem;
  opacity: 0;
  outline: 1px solid #00000011;
  width: ${noteSize};
`;

export const Header = styled.header`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  margin: 0.25rem 0;
`;

export const Title = styled.h2`
  flex: 1 0;
  font-family: 'Roboto Condensed', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0.5rem;
`;

export const Content = styled.div`
  font-family: 'Darker Grotesque', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  margin: 0.5rem;
  overflow: scroll;
`;

export const Icon = styled.img`
  align-self: flex-start;
  background-color: inherit;
  border-radius: 50%;
  height: 12px;
  margin: 0.25rem;
  opacity: 0.5;
  padding: 0.25rem;
  transition: all 0.1s ease-in;
  width: 12px;

  &:hover {
    background-color: #ff000033;
    opacity: 1;
  }
`;
