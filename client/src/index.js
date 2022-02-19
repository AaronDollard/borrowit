import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme';
import { HashRouter } from 'react-router-dom';
import { ColorModeScript } from '@chakra-ui/color-mode'
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />

        <App />

      </ChakraProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);