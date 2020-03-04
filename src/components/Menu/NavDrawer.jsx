import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(1),
  },
  list: {
    width: `256px`,
  },
}));

const NavDrawer = ({ top, children }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = isOpen => event => {
    if (event && event.type === `keydown` && (event.key === `Tab` || event.key === `Shift`)) {
      return;
    }
    setDrawerOpen(isOpen);
  };

  const classes = useStyles();

  return (
    <>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <div
          role="presentation"
          className={classes.list}
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              aria-label="close drawer"
              onClick={toggleDrawer(false)}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            {top}
          </Toolbar>
          {children}
        </div>
      </Drawer>
      <IconButton
        color="inherit"
        edge="start"
        aria-label="open drawer"
        onClick={toggleDrawer(true)}
        className={classes.menuButton}
      >
        <MenuIcon />
      </IconButton>
    </>
  );
};

export default NavDrawer;

NavDrawer.propTypes = {
  top: PropTypes.element.isRequired,
};
