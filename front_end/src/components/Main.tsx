import { useEthers } from "@usedapp/core";
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers";
import brownieConfig from "../brownie-config.json"
import { type } from "os";
import dapp from "../dapp.png"
import ethers from "../eth.png"
import dai from "../dai.png"
import { YourWallet } from "./your_wallet/YourWallet";

export type Token = {
    image: string
    address: string
    name: string
}

export const Main = () => {
    // mostra valori token dal wallet
    // prende l'address di diversi token
    // prende il bilancio dell'user wallet

    // dobbiamo prendere il brownie-config e buttarlo dentro src
    // dobbiamo prendere la build folder per importare i dati del dapp token
    // per prendere le info sui contratti

    // per prendere il dapp token dobbiamo prendere la mappa di deployment
    // e in che chain siamo/dove l'abbiamo deployato, ci aiutiamo con
    // un helper perche il brownie config usa il nome e non l'id
    const { chainId } = useEthers()
    // guardo se esiste sennò metto dev
    const networkName = chainId ? helperConfig[chainId] : "dev"
    console.log(chainId);
    console.log(networkName);

    const dappTokenAddress = chainId ? networkMapping[String(chainId)]["DappToken"][0] : constants.AddressZero
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero
    // creo la lista di token supportati
    const supportedTokens: Array<Token> = [
        {
            image: dapp,
            address: dappTokenAddress,
            name: "DAPP"
        },
        {
            image: ethers,
            address: wethTokenAddress,
            name: "WETH"
        },
        {
            image: dai,
            address: fauTokenAddress,
            name: "DAI"
        }

    ]
    // la mando a YourWallet
    return (<YourWallet supportedTokens={supportedTokens} />)
}