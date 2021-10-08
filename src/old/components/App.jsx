import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import ContextualMenu from './Menu/ContextualMenu';
import { useNotes } from '../hooks/useNotes';
import Note from './Note';
import Header from './Site/Header';

const useStyles = makeStyles(() => ({
  grid: {
    display: `grid`,
    gap: `1rem`,
    margin: `2rem auto`,
    gridTemplateColumns: `repeat(auto-fill, minmax(15rem, 1fr))`,
    gridTemplateRows: `repeat(auto-fill, minmax(15rem, 1fr))`,
  },
}));

const App = () => {
  const { notes, removeNote } = useNotes();
  const classes = useStyles();
  const handleRemoveNote = id => removeNote(id);

  return (
    <>
      <Header />
      <Container component="main" fixed>
        <section className={classes.grid}>
          {notes.map(({ id, title, content }) => (
            <Note key={id} id={id} title={title} content={content} />
          ))}
        </section>
      </Container>
      <ContextualMenu
        menuItems={[
          {
            label: `Remove`,
            onClickFunc: handleRemoveNote,
          },
        ]}
      />
    </>
  );
};

export default App;
