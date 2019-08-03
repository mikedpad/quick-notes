import styled from 'styled-components';

const borderColor = `#999`;
const placeholderColor = `#666`;
const fontFamily = `'Roboto', sans-serif`;
const formBackgroundColor = `#e3f6ff`;

export const FormFieldSet = styled.fieldset`
  background: ${formBackgroundColor};
  border: 1px solid ${borderColor};
  border-radius: 0.35rem;
  margin: 0;
  padding: 1rem;
`;

export const FormLegend = styled.legend`
  background: ${formBackgroundColor};
  border-left: 1px solid ${borderColor};
  border-radius: 0.35rem 0.35rem 0 0;
  border-right: 1px solid ${borderColor};
  border-top: 1px solid ${borderColor};
  color: ${placeholderColor};
  font-family: ${fontFamily};
  font-weight: 400;
  padding: 0.35rem 0.5rem 0.25rem;
`;

export const NewNoteTitle = styled.input`
  border: 1px solid ${borderColor};
  border-radius: 0.15rem;
  display: block;
  font-family: ${fontFamily};
  font-size: 0.825rem;
  margin: 0.25rem 0;
  padding: 0.25rem;
  width: 100%;

  &::placeholder {
    color: ${placeholderColor};
    opacity: 1;
  }
`;

export const NewNoteContent = styled.textarea`
  border: 1px solid ${borderColor};
  border-radius: 0.15rem;
  display: block;
  font-family: ${fontFamily};
  font-size: 0.825rem;
  height: 10em;
  margin: 0.25rem 0;
  padding: 0.25rem;
  resize: none;
  width: 100%;

  &::placeholder {
    color: ${placeholderColor};
    opacity: 1;
  }
`;

export const AddButton = styled.button``;

export const GenerateButton = styled.button``;
