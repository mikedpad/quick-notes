import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { useContextualMenu } from '../hooks/useContextualMenu';

const useStyles = makeStyles(theme => ({
  card: {
    background: `linear-gradient(340deg, rgb(209, 209, 54) 0%, rgb(255, 255, 136) 20%)`,
  },
  header: {
    padding: theme.spacing(2, 2, 0, 2),
  },
  title: {
    // fontFamily: `'Helvetica Black', Helvetica, Arial, sans-serif`,
    fontWeight: 800,
  },
  content: {
    maxHeight: `10rem`,
    overflowY: `scroll`,
  },
}));

const Note = ({ id, title, content }) => {
  const { openMenu } = useContextualMenu();
  const classes = useStyles();

  return (
    <Card component="article" data-note-id={id} square className={classes.card}>
      <CardHeader
        title={title}
        titleTypographyProps={{
          component: `h3`,
          variant: `h5`,
          className: classes.title,
        }}
        action={
          <IconButton aria-label="More Info" data-id={id} onClick={openMenu} size="small">
            <MoreIcon />
          </IconButton>
        }
        className={classes.header}
      />
      <CardContent className={classes.content}>
        <Typography variant="body2">{content}</Typography>
      </CardContent>
    </Card>
  );
};

export default Note;

Note.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
