import { useEthers } from "@usedapp/core";
import helperConfig from "../helper-config.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants } from "ethers";
import brownieConfig from "../brownie-config.json"

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
    const daiTokenAddress = chainId ? brownieConfig["networks"][networkName]["dai_token"] : constants.AddressZero
    // se non c'è questo non funge
    return (<div>Hi!</div>)
}