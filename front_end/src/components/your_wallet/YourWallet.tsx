// prende il bilacio dei token dal nostro wallet per il sito
import { Token } from "../Main"
import { Box, Tab } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import React, { useState } from "react"
import {WalletBalance} from "./WalletBalance"

interface YourWalletProps {
    supportedTokens : Array<Token>
}

// usiamo box e tabs di materail ui per creare il nostro forntend
export const YourWallet = ({ supportedTokens } : YourWalletProps) => {

    // questo crea una selezione di default per settare la tab predefinita
    const [selectedTokenIndex, setselectedTokenIndex] = useState<number>(0)

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setselectedTokenIndex(parseInt(newValue))
    }

    return(
        
        <Box>
            <h1> Your wallet! </h1>
            <Box>
                <TabContext
                    value = {selectedTokenIndex.toString()}
                >
                    <TabList
                        aria-label="stake from tabs"
                        onChange={handleChange}
                    >
                        {
                            supportedTokens.map((token, index) => {
                                return(
                                    <Tab
                                        label={token.name}
                                        value={index.toString()}
                                        key={index}
                                    />
                                )
                            })
                        }
                    </TabList>
                    {supportedTokens.map((token, index) => {
                            return(
                                <TabPanel
                                    value={index.toString()}
                                >                      
                                    <div>
                                        <WalletBalance token={supportedTokens[selectedTokenIndex]}/>
                                    </div>
                                </TabPanel>
                            )
                        })
                    }
                </TabContext>
            </Box>
        </Box>

    )
}