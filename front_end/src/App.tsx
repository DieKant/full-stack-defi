import { ChainId, DAppProvider } from "@usedapp/core"
import { Header } from "./components/Header"
import { Container } from "@material-ui/core"
import { Main } from './components/Main'
import {useIssueTokens} from './hooks/useIssueTokens'

function App() {
  /*
    per prima cosa eliminiamo il template standard 
    e sostituiamo tutto con un blocco DAppProvider, 
    dopodiche creiamo una riga di configurazione in
    typescript dove gli dico con quali blockchain può comunicare

    1337 è per il nostro ganache locale
  */
  useIssueTokens()
  return (
    <DAppProvider
      config={{
        supportedChains: [ChainId.Kovan],
        // questo controlla ogni secondo lo stato della nostra
        // transazione
        notifications: {
          expirationPeriod: 1000,
          checkInterval: 1000
        }
      }}
    >
      <Header />
      <Container
        maxWidth="md"
      >
        <Main />
      </Container>
    </DAppProvider>
  );
}

export default App;
