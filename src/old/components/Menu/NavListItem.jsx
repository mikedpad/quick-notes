import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles(theme => ({
  listItem: {
    padding: theme.spacing(1),
  },
  listItemIcon: {
    minWidth: 0,
    padding: theme.spacing(0, 2, 0, 1),
  },
  listItemText: {
    margin: 0,
  },
}));

const NavListItem = ({ label, icon, onClick }) => {
  const classes = useStyles();

  return (
    <ListItem button className={classes.listItem} onClick={onClick}>
      <ListItemIcon className={classes.listItemIcon}>{icon}</ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          variant: `body1`,
        }}
        className={classes.listItemText}
      />
    </ListItem>
  );
};

export default NavListItem;

NavListItem.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
};
