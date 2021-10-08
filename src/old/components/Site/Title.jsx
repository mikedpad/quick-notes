import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    fontFamily: theme.typography.headline,
    fontSize: `1.75rem`,
  },
}));

const Title = () => {
  const classes = useStyles();

  return (
    <Typography variant="h1" className={classes.title}>
      Quick Notes
    </Typography>
  );
};

export default Title;
