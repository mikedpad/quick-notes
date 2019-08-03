import styled, { css } from 'styled-components';

const borderColor = `#999`;
const placeholderColor = `#666`;
const fontFamily = `'Roboto', sans-serif`;
const fontSize = `0.825rem`;
const formBackgroundColor = `#edf9ff`;
const submitButtonColor = `#5af29e`;
const modifierButtonColor = `#efefef`;

const formElementBorder = css`
  border: 1px solid ${borderColor};
  border-radius: 0.15rem;
`;

export const FormFieldSet = styled.fieldset`
  background: ${formBackgroundColor};
  border: 1px solid ${borderColor};
  border-radius: 0.25rem;
  margin: 0;
  padding: 0.5rem 1rem 0.75rem;

  & + & {
    margin-top: 2rem;
  }
`;

export const FormLegend = styled.legend`
  background: ${formBackgroundColor};
  border-left: 1px solid ${borderColor};
  border-radius: 0.25rem 0.25rem 0 0;
  border-right: 1px solid ${borderColor};
  border-top: 1px solid ${borderColor};
  color: ${placeholderColor};
  font-family: ${fontFamily};
  font-size: ${fontSize};
  font-weight: 400;
  padding: 0.35rem 0.5rem 0.25rem;
`;

const TextInputStyle = css`
  ${formElementBorder}
  box-sizing: border-box;
  display: block;
  font-family: ${fontFamily};
  font-size: ${fontSize};
  padding: 0.25rem;
`;

const TextFieldStyle = css`
  ${TextInputStyle}
  margin: 0.25rem 0;
  &::placeholder {
    color: ${placeholderColor};
    opacity: 1;
  }
`;
export const NoteTitle = styled.input`
  ${TextFieldStyle}
  width: 100%;
`;
export const NoteContent = styled.textarea`
  ${TextFieldStyle}
  height: 10em;
  resize: none;
  width: 100%;
`;

const SubmitButton = styled.button`
  ${formElementBorder}
  background-color: ${submitButtonColor};
  font-family: ${fontFamily};
  font-size: ${fontSize};
  padding: 0.25rem 0.5rem;
`;
export const AddButton = styled(SubmitButton)``;
export const GenerateButton = styled(SubmitButton)``;

const ModifierButton = styled(SubmitButton)`
  background-color: ${modifierButtonColor};
`;
export const PlusButton = styled(ModifierButton)``;
export const MinusButton = styled(ModifierButton)``;
export const GenCount = styled.input`
  ${TextInputStyle}
  display: inline-block;
  margin: 0.25rem 0.5rem;
  width: 2em;
`;

export const GenerateFlex = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;
