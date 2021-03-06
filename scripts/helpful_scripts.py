from brownie import (
    Contract,
    network,
    accounts,
    config,
    MockV3Aggregator,
    MockDAI,
    MockWETH,
)
import eth_utils

LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["development", "ganache-local", "mainnet-fork"]
DECIMALS = 18
INITIAL_PRICE_FEED_VALUE = 2000000000000000000000
# usiamo questa funzione per scegliere tra account per il development
# con l'index posso poi decidere quale account usare usandolo come posizione



def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if (
        network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS
    ):
        return accounts[0]
    return accounts.add(config["wallets"]["from_key"])


contract_to_mock = {
    "eth_usd_price_feed": MockV3Aggregator,
    "dai_usd_price_feed": MockV3Aggregator,
    "fau_token": MockDAI,
    "weth_token": MockWETH,
}


def get_contract(contract_name):
    """questa funzione prende gli indirizzi dei contratti dalla config altrimenti deploya mocks
    args:
        contract_name(string)
    ritorna:
        brownie.network.contract.ProjectContract: alla sua versione più recente
    """
    # prendiamo il tipo di contratto che ci serve
    contract_type = contract_to_mock[contract_name]
    # controlliamo se siamo in dev perche non c'è bisogno di mockare se siamo in fork
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        # guardiamo se questo tipo di contratto è gia stato deployato (len conta quante volte è stato deployato)
        if len(contract_type) <= 0:
            deploy_mocks()
        # se è gia su prendo quello più recente dall'array
        contract = contract_type[-1]
    # se non sono in locale vo a prendere quello sulla testnet(in questo caso con forking)
    else:
        contract_address = config["networks"][network.show_active()][contract_name]
        contract = Contract.from_abi(
            contract_type._name, contract_address, contract_type.abi
        )
    return contract


def deploy_mocks(decimals=DECIMALS, inital_value=INITIAL_PRICE_FEED_VALUE):
    account = get_account()
    # il to.wei aggiunge 18 decimali dopo il numero che gli diamo, also facciamo il deploy del mock solo una volta e prendiamo quello più recente
    mock_price_feed = MockV3Aggregator.deploy(decimals, inital_value, {"from": account})
    mock_dai = MockDAI.deploy({"from": account})
    mock_weth = MockWETH.deploy({"from": account})
    print("Mocks deployed!")
