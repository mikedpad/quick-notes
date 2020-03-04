import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline, MuiThemeProvider, responsiveFontSizes } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import App from './components/App';
import { NoteProvider } from './hooks/useNotes';
import { ContextualMenuProvider } from './hooks/useContextualMenu';
import theme from './styles/theme';

const respTheme = responsiveFontSizes(theme);

const AppRoot = (
  <MuiThemeProvider theme={respTheme}>
    <CssBaseline />
    <SnackbarProvider maxSnack={3} autoHideDuration={3000} preventDuplicate>
      <ContextualMenuProvider>
        <NoteProvider>
          <App />
        </NoteProvider>
      </ContextualMenuProvider>
    </SnackbarProvider>
  </MuiThemeProvider>
);

ReactDOM.render(AppRoot, document.getElementById(`app`));
