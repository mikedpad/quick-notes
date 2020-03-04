import { useSnackbar } from 'notistack';

const useSnackMessages = () => {
  const { enqueueSnackbar } = useSnackbar();

  return {
    msgSuccess: msg => enqueueSnackbar(msg, { variant: `success` }),
    msgWarning: msg => enqueueSnackbar(msg, { variant: `warning` }),
    msgError: msg => enqueueSnackbar(msg, { variant: `error` }),
  };
};

export default useSnackMessages;
