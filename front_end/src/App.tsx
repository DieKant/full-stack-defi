import React from 'react';
import { ChainId, DAppProvider } from "@usedapp/core"
import { Header } from "./components/Header"

function App() {
  /*
    per prima cosa eliminiamo il template standard 
    e sostituiamo tutto con un blocco DAppProvider, 
    dopodiche creiamo una riga di configurazione in
    typescript dove gli dico con quali blockchain può comunicare

    1337 è per il nostro ganache locale
  */
  return (
    <DAppProvider config={{
      supportedChains: [ChainId.Kovan, ChainId.Rinkeby, 1337]
    }}>
      <Header />
      <div>Hi!</div>
    </DAppProvider>
  );
}

export default App;
