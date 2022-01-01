import { useContractFunction, useEthers } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useState, useEffect } from "react";

export const useStateTokens = (tokenAddress: string) => {
    // per fare le prossime 2 funzioni ci vuole address, abi e chainId
    const { chainId } = useEthers()
    const { abi } = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero

    // creiamo un interfaccia con i contratti della token farm
    // e il token che vogliamo mettere in staking
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)


    // apporovazione per il trasferimento di erc20
    // con questo gestisco la richiesta
    const { send: approveErc20Send, state: approveErc20State } =
        useContractFunction(erc20Contract, "approve", {
            transactionName: "approve erc20 transfare",
        })
    // con questo la chiamo
    const approveAndStake = (amount: string) => {
        setAmountToStake(amount)
        return approveErc20Send(tokenFarmAddress, amount)
    }


    // trasferimento
    const { send: stakeSend, state: stakeState } =
        useContractFunction(tokenFarmContract, "stakeTokens", {
            transactionName: "stake tokens",
        })
    const [amountToStake, setAmountToStake] = useState("0")


    // uso useEffect per triggerare la funzione stake quando metto
    // l'amount nell'approved, se cambia l'amount to stake o il
    // token address
    useEffect(() => {
        if (approveErc20State.status === "Success") {
            stakeSend(amountToStake, tokenAddress)
        }

    }, [approveErc20State, amountToStake, tokenAddress])


    // dichiaro questo come hook cosi lo passo con nome semplificato
    const [state, setState] = useState(approveErc20State)
    return { approveAndStake, state }
}