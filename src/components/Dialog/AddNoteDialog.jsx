import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { generate } from 'shortid';
import { makeStyles } from '@material-ui/styles';
import { useNotes } from '../../hooks/useNotes';
import useTextFieldValidator from '../../hooks/useTextFieldValidator';

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(2, 2, 0, 2),
    textAlign: `center`,
  },
  actions: {
    alignItems: `center`,
    display: `flex`,
    justifyContent: `space-between`,
  },
}));

const AddNoteDialog = ({ isOpen, handleClose }) => {
  const { notes, addNote } = useNotes();
  const { hasError, errorMsg, isBlank, isInvalid, isDuplicate } = useTextFieldValidator();
  const classes = useStyles();

  function handleAddNote() {
    // Get the provided name
    const title = document.querySelector(`#note-title`).value.trim();
    const content = document.querySelector(`#note-content`).value.trim();

    // Check if the name is not an empty string (blank)
    if (isBlank(title) || isBlank(content)) return;
    // Check if the name consists of valid characters
    const regex = /^[a-zA-Z0-9 _-]+$/;
    if (isInvalid(title, regex, <span>Invalid characters detected</span>)) return;
    // Checks if the name already exists
    if (
      isDuplicate(
        title,
        notes.map(n => n.title),
      )
    )
      return;

    addNote({ id: generate(), title, content });
    handleClose();
  }

  function handleKeyPress(evt) {
    const isTitleField = evt.target.id === `note-title`;
    const isContentField = evt.target.id === `note-content`;
    const isNoteAddButton = evt.target.id === `note-add-button`;
    const isEnterPressed = evt.key === `Enter`;

    if (isEnterPressed) {
      if (isTitleField) {
        document.querySelector(`#note-content`).focus();
      }
      if (isContentField) {
        document.querySelector(`#note-add-button`).focus();
      }
      if (isNoteAddButton) {
        handleAddNote();
      }
    }
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="add-note-dialog-title">
      <DialogTitle id="add-note-dialog-title" className={classes.header}>
        Add Note
      </DialogTitle>
      <DialogContent>
        <TextField
          error={hasError}
          helperText={errorMsg}
          onKeyPress={handleKeyPress}
          label="Title"
          id="note-title"
          autoFocus
          fullWidth
          margin="dense"
          variant="outlined"
          size="small"
          type="text"
        />
        <TextField
          error={hasError}
          helperText={errorMsg}
          onKeyPress={handleKeyPress}
          label="Content"
          id="note-content"
          multiline
          fullWidth
          margin="dense"
          variant="outlined"
          size="small"
          type="text"
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={handleClose} color="default">
          Cancel
        </Button>
        <Button onClick={handleAddNote} color="secondary" id="note-add-button">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNoteDialog;

AddNoteDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
