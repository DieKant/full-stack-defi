import { useEthers } from "@usedapp/core";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1)
    }
}))

export const Header = () => {
    // aggiungiamo le classi che abbiamo creato col makeStyle
    const classes = useStyles()
    // prendo le variabili per creare il bottone di connessione
    // a metamask
    const { account, activateBrowserWallet, deactivate } = useEthers()
    // guardiamo se l'user è connesso mettendo i risultato di un
    // if booleano per vedere se un account è connesso o meno emittendo
    // vero o falso
    const isConnected = account !== undefined

    return(
        // aggiungiamo i nostri stili personalizzati a elementi
        // del nostro componente per stilizzare meglio il sito
        <div className={classes.container}>
            <div>
                {
                    // le if in typescript si scrivono in forma breve
                    // questo pezzo di codice guarda la costante
                    // isConnected e se la vade vera mostra il pulsante
                    // per connettersi, una volta connessi e selezionato
                    // un network nel nostro config ci verrà data l'opzione
                    // di scollegarci
                    isConnected ? (
                        // usiamo i bottoni di material ui perche
                        // escono gia carini di fabbrica
                        // aggiungiamo poi attributi al bottone
                        // per attivare vari stili
                        <Button 
                            color="primary"
                            onClick={deactivate}
                            variant="contained"
                        >
                            Disconnect
                        </Button>
                    )
                    :(
                        <Button 
                            color="primary"
                            onClick={() => activateBrowserWallet()}
                            variant="contained"
                        >
                            Connect
                        </Button>
                    )

                }
            </div>
        </div>
    )
}