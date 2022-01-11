
import { formatUnits } from "@ethersproject/units"
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core"
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import React, { useEffect, useState } from "react"
import { useStateTokens } from "../../hooks/useStakeTokens"
import { Token } from "../Main"
import { utils } from "ethers"
import Alert  from "@material-ui/lab/Alert"

export interface UnstakeFormProps {
    token: Token
}

// usiamo box e tabs di materail ui per creare il nostro forntend
// usimao input per inserire quanto vogliamo unstakare
export const UnstakeForm = ({ token } : UnstakeFormProps) => {

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
    
    // creo dei nuovo hook per tracciare lo stato delle transazioni
    const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = useState(false)
    const [showStakeTokenSuccess, setShowStakeTokenSuccess] = useState(false)
    
    // creo la funzione per chiudere gli alert snack
    const handelCloseSnack = () => {
        setShowErc20ApprovalSuccess(false)
        setShowStakeTokenSuccess(false)
    }

    // traccio se le notifications cambiano per fare un output a schermo
    useEffect(() => {
        if(notifications.filter(
            (notification) => 
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Approve erc20 transfare").length > 0) {
                    setShowErc20ApprovalSuccess(true)
                    setShowStakeTokenSuccess(false)
        }

        if(notifications.filter(
            (notification) => 
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Stake tokens").length > 0) {
                    setShowErc20ApprovalSuccess(false)
                    setShowStakeTokenSuccess(true)
        }
        
    }, [notifications, showErc20ApprovalSuccess, showStakeTokenSuccess])

    // creiamo una campo input e tracciamo il suo valore
    return (
        <>
            <div>
                <Input 
                    onChange={handleInputChange}
                />
                <Button
                    onClick={handleStakeSubmit}
                    color="primary"
                    size="large"
                    disabled={isMining}
                >
                    {isMining ? <CircularProgress size={26} /> : "Unstake!"}
                </Button>
            </div>
            <Snackbar
                open={showErc20ApprovalSuccess}
                autoHideDuration={5000}
                onClose={handelCloseSnack}
            >
                <Alert onClose={handelCloseSnack} severity="success">
                    ERC20 token transfer approved, now approve the second transaction
                </Alert>
            </Snackbar>
            <Snackbar
                open={showStakeTokenSuccess}
                autoHideDuration={5000}
                onClose={handelCloseSnack}
            >
                <Alert onClose={handelCloseSnack} severity="success">
                    Tokens staked!
                </Alert>
            </Snackbar>
        </>
    )
}