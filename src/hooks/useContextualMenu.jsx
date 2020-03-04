import React, { useReducer, useContext, useMemo, createContext } from 'react';
import { reducer, defaultState } from './reducers/contextualMenuReducer';

const ContextualMenuContext = createContext();

const useContextualMenu = () => {
  const context = useContext(ContextualMenuContext);
  if (!context) {
    throw new Error(`useContextualMenu must be used within a ContextualMenuProvider`);
  }
  const [state, dispatch] = context;

  return {
    isMenuOpen: state.isOpen,
    anchor: state.anchor,
    id: state.id,
    openMenu: ({ currentTarget }) =>
      dispatch({ type: `OPEN`, payload: { anchor: currentTarget, id: currentTarget.dataset.id } }),
    closeMenu: () => dispatch({ type: `CLOSE` }),
  };
};

function ContextualMenuProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const value = useMemo(() => [state, dispatch], [state]);
  return <ContextualMenuContext.Provider value={value}>{children}</ContextualMenuContext.Provider>;
}

export { ContextualMenuProvider, useContextualMenu };
