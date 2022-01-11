// prende il bilacio dei token dal nostro wallet per il sito
import { Token } from "../Main"
import { Box, Tab, makeStyles } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import React, { useState } from "react"
import {WalletBalance} from "./WalletBalance"
import { UnstakeForm } from "./UnstakeForm"

interface YourWalletProps {
    supportedTokens : Array<Token>
}

const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(4)
    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px",
    },
    header: {
        color: "white"
    },
    div: {
        marginBottom: theme.spacing(13)
    }
}))

// usiamo box e tabs di materail ui per creare il nostro forntend
export const YourStakedWallet = ({ supportedTokens } : YourWalletProps) => {

    // questo crea una selezione di default per settare la tab predefinita
    const [selectedTokenIndex, setselectedTokenIndex] = useState<number>(0)

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setselectedTokenIndex(parseInt(newValue))
    }

    const classes = useStyles()

    return(
        <div className={classes.div}>
            <Box>
                <h1 className={classes.header}> Your staked wallet! </h1>
                <Box className={classes.box}>
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
                                        key={index}
                                    >                      
                                        <div className={classes.tabContent}>
                                            <WalletBalance token={supportedTokens[selectedTokenIndex]}/>
                                            <UnstakeForm token={supportedTokens[selectedTokenIndex]}/>
                                        </div>
                                    </TabPanel>
                                )
                            })
                        }
                    </TabContext>
                </Box>
            </Box>
        </div>
    )
}