import { useContractCall, useEthers } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import { utils, BigNumber, constants } from "ethers"
import networkMapping from "../chain-info/deployments/map.json"

/**
 * Get the staking balance of a certain token by the user in our TokenFarm contract
 * @param address - The contract address of the token
 */
export const useStakingBalance = (address: string): BigNumber | undefined => {
  
  // creo l'interfaccia del contratto per usarlo
  const { account, chainId } = useEthers()
  const { abi } = TokenFarm
  const tokenFarmContractAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
  const tokenFarmInterface = new utils.Interface(abi)

  // creo una variabile di distrutturazione per dare a
  // nuove variabili tutti i risultati ritornati dalla
  // funzione stakingBalance, uso contractCall perche non
  // è una transazione
  const [stakingBalance] =
    useContractCall({
      abi: tokenFarmInterface,
      address: tokenFarmContractAddress,
      method: "stakingBalance",
      args: [address, account],
    }) ?? []

  return stakingBalance
}
