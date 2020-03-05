export const defaultState = {
  notes: [],
  savedLocalNotes: !!JSON.parse(localStorage.getItem(`notes`)),
};

export const reducer = (state, action) => {
  switch (action.type) {
    case `ADD_NOTE`:
      return {
        ...state,
        notes: Array.isArray(action.payload)
          ? [...state.notes, ...action.payload]
          : [...state.notes, action.payload],
      };
    case `REMOVE_NOTE`:
      return {
        ...state,
        notes: state.notes.filter(({ id }) => id !== action.payload),
      };
    case `DELETE_ALL_NOTES`:
      return {
        ...state,
        notes: [],
      };
    case `SAVE_TO_LOCAL_STORAGE`:
      localStorage.setItem(`notes`, JSON.stringify(state.notes, null, 4));
      return {
        ...state,
        savedLocalNotes: true,
      };
    case `LOAD_FROM_LOCAL_STORAGE`:
      return {
        ...state,
        notes: JSON.parse(localStorage.getItem(`notes`)),
      };
    default:
      throw new Error();
  }
};
