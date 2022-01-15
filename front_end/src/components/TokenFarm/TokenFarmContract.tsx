import { Token } from "../Main"
import { Box, Tab, makeStyles } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import React, { useState } from "react"
import { UnstakeForm } from "../TokenFarm/UnstakeForm"

interface TokenFarmContractProps {
    supportedTokens: Array<Token>
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
        borderRadius: "25px"
    },
    header: {
        color: "white"
    },
    div: {
        marginBottom: theme.spacing(13)
    }
}))

export const TokenFarmContract = (
        {
            supportedTokens,
        }
        : TokenFarmContractProps
    ) => {
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
                                            <UnstakeForm token={token}/>
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