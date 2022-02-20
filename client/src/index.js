import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { ColorModeScript } from '@chakra-ui/color-mode'
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />

        <App />

      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);