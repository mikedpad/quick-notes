export const defaultState = {
  isOpen: false,
  anchor: null,
  id: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case `OPEN`:
      return {
        ...state,
        anchor: action.payload.anchor,
        id: action.payload.id,
        isOpen: true,
      };
    case `CLOSE`:
      return defaultState;
    default:
      throw new Error();
  }
};
