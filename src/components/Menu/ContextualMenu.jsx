import React from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem } from '@material-ui/core';
import { useContextualMenu } from '../../hooks/useContextualMenu';

const ContextualMenu = ({ menuItems }) => {
  const { isMenuOpen, anchor, id, closeMenu } = useContextualMenu();

  return (
    <Menu
      id="contextual-menu"
      color="primary"
      anchorEl={anchor}
      keepMounted
      open={isMenuOpen}
      onClose={closeMenu}
    >
      {menuItems.map(({ label, onClickFunc }) => {
        const onClick = () => {
          onClickFunc(id);
          closeMenu();
        };

        return (
          <MenuItem key={label} onClick={onClick}>
            {label}
          </MenuItem>
        );
      })}
    </Menu>
  );
};

export default ContextualMenu;

ContextualMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClickFunc: PropTypes.func.isRequired,
    }),
  ).isRequired,
};
