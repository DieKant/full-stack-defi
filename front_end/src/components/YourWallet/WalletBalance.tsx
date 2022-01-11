import { useEthers, useTokenBalance } from "@usedapp/core"
import { Token } from "../Main"
import { formatUnits } from "@ethersproject/units"
import { BalanceMsg } from "../BalanceMsg"

export interface WalletBalanceProps {
    token : Token
}
// usiamo l'hook di usedapp core per prender il bilancio
export const WalletBalance = ({ token }: WalletBalanceProps) => {
    const { image, address, name } = token
    const { account }= useEthers()
    const tokenBalance = useTokenBalance(address, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    return (
        <BalanceMsg
            amount={formattedTokenBalance}
            label={`your unstaked ${name} balance`}
            tokenImgSrc={image}
        />
    )
}