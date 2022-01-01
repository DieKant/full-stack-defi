
import { formatUnits } from "@ethersproject/units"
import { Button, Input, CircularProgress } from "@material-ui/core"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import React, { useEffect, useState } from "react"
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
    const {notifications} = useNotifications()

    // creo la variabile da catturare presa dal campo input e una funzione per tracciarne il valore
    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }

    const {approveAndStake, state: approveErc20State} = useStateTokens(tokenAddress)
    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }


    // creiamo un meccanismo per mostrare le notifiche a schermo oltre che in console log
    const isMining = approveErc20State.status === "Mining"


    // traccio se le notifications cambiano per fare un output a schermo
    useEffect(() => {
        if(notifications.filter(
            (notification) => 
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Approve erc20 transfare").length > 0) {
                    console.log("Approved")
        }

        if(notifications.filter(
            (notification) => 
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Stake tokens").length > 0) {
                    console.log("Tokens staked")
        }
        
    }, [notifications])

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
                disabled={isMining}
            >
                {isMining ? <CircularProgress size={26} /> : "Stake!"}
            </Button>
        </>
    )
}