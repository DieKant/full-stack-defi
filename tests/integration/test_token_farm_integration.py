from brownie import network, exceptions
from scripts.helpful_scripts import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    INITIAL_PRICE_FEED_VALUE,
    DECIMALS,
    get_account,
    get_contract,
)
from scripts.deploy import KEPT_BALANCE
from scripts.deploy import deploy_token_farm_and_dapp_token
import pytest


def test_stake_and_issue_correct_amounts(amount_staked):
    # arrange
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for integration tests")
    account = get_account()
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    # act
    dapp_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.stakeTokens(amount_staked, dapp_token.address, {"from": account})
    starting_balance = dapp_token.balanceOf(account.address)
    tx = token_farm.issueTokens({"from": account})
    tx.wait(1)
    price_feed_contract = get_contract("dai_usd_price_feed")
    (_, price, _,_,_) = price_feed_contract.latestRoundData()
    amount_token_to_issue = (
        price / 10 ** price_feed_contract.decimals()
    ) * amount_staked
    # assert
    assert (
        token_farm.stakingBalance(dapp_token.address, account.address) == amount_staked
    )
    assert token_farm.uniqueTokensStaked(account.address) == 1
    assert token_farm.stakers(0) == account.address
    assert (
        dapp_token.balanceOf(account.address)
        == starting_balance + amount_token_to_issue
    )