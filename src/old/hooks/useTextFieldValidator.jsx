import React, { useState } from 'react';
import useSnackMessages from './useSnackMessages';

const defaultState = { hasError: false, errorMsg: `` };

const useTextFieldValidator = () => {
  const { msgError } = useSnackMessages();
  const [error, setError] = useState(defaultState);

  // Check if the field is not blank
  const isBlank = (str, errorMsg = <span>Text field cannot be blank!</span>) => {
    if (str === ``) {
      setError({ hasError: true, errorMsg });
      msgError(errorMsg);
      return true;
    }

    setError(defaultState);
    return false;
  };

  const isDuplicate = (
    str,
    list,
    errorMsg = (
      <span>
        &quot;<strong>{str}</strong>&quot; is a duplicate!
      </span>
    ),
  ) => {
    if (list.some(name => name.toLowerCase() === str.toLowerCase())) {
      setError({ hasError: true, errorMsg });
      msgError(errorMsg);
      return true;
    }

    setError(defaultState);
    return false;
  };

  const isInvalid = (name, regex, errorMsg = <span>Invalid data entered!</span>) => {
    if (!regex.test(name)) {
      setError({ hasError: true, errorMsg });
      msgError(errorMsg);
      return true;
    }

    setError(defaultState);
    return false;
  };

  return {
    hasError: error.hasError,
    errorMsg: error.errorMsg,
    isBlank,
    isDuplicate,
    isInvalid,
  };
};

export default useTextFieldValidator;
