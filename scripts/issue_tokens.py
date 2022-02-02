from brownie import TokenFarm
from scripts.helpful_scripts import get_account

def issue_correct_amounts():
    # network_mapping = open("./build/deployments/map.json")
    # contract_data = json.load(network_mapping)
    # token_farm_address = contract_data["42"]["TokenFarm"][0]
    # token_farm_contract = Contract.from_abi(
     #   TokenFarm._name, token_farm_address, TokenFarm.abi
    # )
    account = get_account()
    token_farm_contract = TokenFarm[-1]
    tx = token_farm_contract.issueTokens({"from": account})
    tx.wait(1)


def main():
    issue_correct_amounts()