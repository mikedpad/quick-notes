import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FormFieldSet = styled.fieldset`
  background-color: #edf9ff;
  border: 1px solid #999;
  border-radius: 0.25rem;
  font-family: 'Roboto', sans-serif;
  font-size: 0.825rem;
  margin: 0;
  padding: 0.5rem 1rem 0.75rem;

  & + & {
    margin-top: 2rem;
  }
`;

const FormLegend = styled.legend`
  background: #edf9ff;
  border-left: 1px solid #999;
  border-radius: 0.25rem 0.25rem 0 0;
  border-right: 1px solid #999;
  border-top: 1px solid #999;
  color: #666;
  font-weight: 400;
  padding: 0.35rem 0.5rem 0.25rem;
`;

const NoteFormFrame = ({ label, children }) => (
  <FormFieldSet>
    <FormLegend>{label}</FormLegend>
    {children}
  </FormFieldSet>
);

export default NoteFormFrame;

NoteFormFrame.propTypes = {
  label: PropTypes.string.isRequired,
};
