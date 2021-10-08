import React, { useState } from 'react';
import PropTypes from 'prop-types';
import hipsum from 'lorem-hipsum';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { generate } from 'shortid';
import { makeStyles } from '@material-ui/styles';
import { useNotes } from '../../hooks/useNotes';

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(2, 2, 0, 2),
    textAlign: `center`,
  },
  count: {
    width: `50px`,
    textAlign: `center`,
  },
  content: {
    alignItems: `center`,
    display: `flex`,
    justifyContent: `center`,
  },
  iconButton: {
    backgroundColor: theme.palette.primary.light,
    color: `white`,
    margin: theme.spacing(0, 1),
    '&:hover': {
      backgroundColor: theme.palette.gray.main,
    },
  },
  actions: {
    alignItems: `center`,
    display: `flex`,
    justifyContent: `space-between`,
  },
}));

const clamp = (min, max, value) => Math.min(max, Math.max(min, value));

const GenerateNoteDialog = ({ isOpen, handleClose }) => {
  const [count, setCount] = useState(1);
  const max = 10;
  const { addNote } = useNotes();
  const classes = useStyles();

  const genDecrement = () => setCount(clamp(0, max, count - 1));
  const genIncrement = () => setCount(clamp(0, max, count + 1));
  function handleGenerateNotes() {
    addNote(
      Array.from({ length: count }, (_, i) => i).map(() => ({
        id: generate(),
        title: hipsum({ sentenceLowerBound: 2, sentenceUpperBound: 6 }),
        content: hipsum({ units: `paragraphs` }),
      })),
    );
    handleClose();
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="add-note-dialog-title">
      <DialogTitle id="add-note-dialog-title" className={classes.header}>
        Generate Note
      </DialogTitle>
      <DialogContent className={classes.content}>
        <IconButton
          aria-label="Decrement"
          color="primary"
          size="small"
          className={classes.iconButton}
          disabled={count < 1}
          onClick={genDecrement}
        >
          <RemoveIcon />
        </IconButton>
        <Typography variant="body1" className={classes.count}>
          {count}
        </Typography>
        <IconButton
          aria-label="Increment"
          color="primary"
          size="small"
          className={classes.iconButton}
          disabled={count > max - 1}
          onClick={genIncrement}
        >
          <AddIcon />
        </IconButton>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={handleClose} color="default">
          Cancel
        </Button>
        <Button onClick={handleGenerateNotes} color="secondary">
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerateNoteDialog;

GenerateNoteDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
