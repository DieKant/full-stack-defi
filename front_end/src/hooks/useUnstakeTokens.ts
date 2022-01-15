import { useContractFunction, useEthers } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers";
import { Contract } from "@ethersproject/contracts";

export const useUnstakeTokens = () => {
    // per fare le prossime 2 funzioni ci vuole address, abi e chainId
    const { chainId } = useEthers()
    const { abi } = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero

    // creiamo un interfaccia con i contratti della token farm
    // e il token che vogliamo mettere in staking
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    // infine chiamiamo con useContractFunction
    // per eseguire la transazione con
    // la funzione che vogliamo usare sul contratto
    return useContractFunction(tokenFarmContract, "unstakeTokens", {
        transactionName: "Unstake tokens",
      })
}