import React from 'react';
import CreateNote from './Forms/CreateNote';
import GenerateNote from './Forms/GenerateNote';
import SaveNotes from './Forms/SaveNotes';
import LoadNotes from './Forms/LoadNotes';

const Form = () => (
  <>
    <CreateNote />
    <GenerateNote />
    <SaveNotes />
    <LoadNotes />
  </>
);

export default Form;
