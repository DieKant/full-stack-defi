import { Token } from "../Main"
import { formatUnits } from "@ethersproject/units"
import { Button, CircularProgress, Snackbar, makeStyles } from "@material-ui/core"
import { useEthers, useNotifications } from "@usedapp/core"
import React, { useEffect, useState } from "react"
import { useUnstakeTokens } from "../../hooks/useUnstakeTokens"
import { useStakingBalance } from "../../hooks/useStakingBalance"
import Alert  from "@material-ui/lab/Alert"
import { BalanceMsg } from "../BalanceMsg"

interface UnstakeFormProps {
    token: Token
}

const useStyles = makeStyles((theme) => ({
    contentContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: theme.spacing(2),
    },
  }))

export const UnstakeForm = (
    {
        token
    }
    : UnstakeFormProps
) => {

    const { image, address: tokenAddress, name } = token
    const {account} = useEthers()
    const tokenBalance = useStakingBalance(tokenAddress)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const {notifications} = useNotifications()

    // unstaking
    const { send: unstakeTokenSend, state: unstakeTokenState} = useUnstakeTokens()
    const handleUnstakeSubmit = () => {
        return unstakeTokenSend(tokenAddress)
    }

    // notifiche
    const isMining = unstakeTokenState.status === "Mining"
    const [showUnstakeTokenSuccess, setShowUnstakeTokenSuccess] = useState(false)
    useEffect(() => {
        if(notifications.filter(
            (notification) => 
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Unstake tokens").length > 0) {
                    !showUnstakeTokenSuccess &&setShowUnstakeTokenSuccess(true)
        }
    }, [notifications, showUnstakeTokenSuccess])
    const handleCloseSnack = () => {
        showUnstakeTokenSuccess && setShowUnstakeTokenSuccess(false)
    }

    const classes = useStyles()

    return (
        <>
            <div className={classes.contentContainer}>
                <BalanceMsg
                    amount={formattedTokenBalance}
                    label={`your staked ${name} balance`}
                    tokenImgSrc={image}
                />
                <Button
                    onClick={handleUnstakeSubmit}
                    color="primary"
                    size="large"
                    disabled={isMining}
                >
                        {isMining ? <CircularProgress size={26} /> : "Unstake!"}
                </Button>
            </div>
            <Snackbar
                open={showUnstakeTokenSuccess}
                autoHideDuration={5000}
                onClose={handleCloseSnack}
            >
                <Alert onClose={handleCloseSnack} severity="success">
                    Tokens unstaked!
                </Alert>
            </Snackbar>
        </>
        
    )
}