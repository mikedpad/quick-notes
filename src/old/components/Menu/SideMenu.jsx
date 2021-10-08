import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/NoteAdd';
import GenerateIcon from '@material-ui/icons/DynamicFeed';
import SaveIcon from '@material-ui/icons/Save';
import LoadIcon from '@material-ui/icons/Publish';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import NavListItem from './NavListItem';
import NavDrawer from './NavDrawer';
import AddNoteDialog from '../Dialog/AddNoteDialog';
import GenerateNoteDialog from '../Dialog/GenerateNoteDialog';
import { useNotes } from '../../hooks/useNotes';

const SideMenu = ({ titleElement }) => {
  const [addNoteDialog, setAddNoteDialog] = useState(false);
  const [generateNoteDialog, setGenerateNoteDialog] = useState(false);
  const { saveNotes, loadNotes } = useNotes();

  const handleAddNoteClick = () => setAddNoteDialog(true);
  const handleAddNoteClose = () => setAddNoteDialog(false);
  const handleGenerateNoteClick = () => setGenerateNoteDialog(true);
  const handleGenerateNoteClose = () => setGenerateNoteDialog(false);
  const handleSaveNotesClick = () => saveNotes();
  const handleLoadNotesClick = () => loadNotes();

  return (
    <>
      <NavDrawer top={titleElement}>
        <List component="nav">
          <NavListItem label="Add Note" icon={<AddIcon />} onClick={handleAddNoteClick} />
          <NavListItem
            label="Generate Note"
            icon={<GenerateIcon />}
            onClick={handleGenerateNoteClick}
          />
          <Divider />
          <NavListItem label="Save All Notes" icon={<SaveIcon />} onClick={handleSaveNotesClick} />
          <NavListItem label="Load Notes" icon={<LoadIcon />} onClick={handleLoadNotesClick} />
        </List>
      </NavDrawer>
      <AddNoteDialog isOpen={addNoteDialog} handleClose={handleAddNoteClose} />
      <GenerateNoteDialog isOpen={generateNoteDialog} handleClose={handleGenerateNoteClose} />
    </>
  );
};

export default SideMenu;

SideMenu.propTypes = {
  titleElement: PropTypes.element.isRequired,
};
