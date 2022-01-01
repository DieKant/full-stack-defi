
import { formatUnits } from "@ethersproject/units"
import { Button, Input } from "@material-ui/core"
import { useEthers, useTokenBalance } from "@usedapp/core"
import React, { useState } from "react"
import { useStateTokens } from "../../hooks/useStakeTokens"
import { Token } from "../Main"
import { utils } from "ethers"

export interface StakeFormProps {
    token: Token
}

// usiamo box e tabs di materail ui per creare il nostro forntend
// usimao input per inserire quanto vogliamo unstakare
export const StakeForm = ({ token } : StakeFormProps) => {

    const {address: tokenAddress, name} = token
    const {account} = useEthers()
    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0

    // creo la variabile da catturare presa dal campo input e una funzione per tracciarne il valore
    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }

    const {approveAndStake, state} = useStateTokens(tokenAddress)
    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }

    // creiamo una campo input e tracciamo il suo valore
    return (
        <>
            <Input 
                onChange={handleInputChange}
            />
            <Button
                onClick={handleStakeSubmit}
                color="primary"
                size="large"
            >
                Stake!
            </Button>
        </>
    )
}