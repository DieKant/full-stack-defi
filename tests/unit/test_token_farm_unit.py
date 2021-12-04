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


def test_set_price_feed_contract():
    # arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local tests")
    account = get_account()
    non_owner = get_account(index=1)
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    # act
    price_feed_address = get_contract("eth_usd_price_feed")
    tx = token_farm.setPriceFeedContract(
        dapp_token.address, price_feed_address, {"from": account}
    )
    tx.wait(1)
    # assert
    assert token_farm.tokenPriceFeedMapping(dapp_token.address) == price_feed_address
    with pytest.raises(exceptions.VirtualMachineError):
        tx = token_farm.setPriceFeedContract(
            dapp_token.address, price_feed_address, {"from": non_owner}
        )
        tx.wait(1)


def test_stake_tokens(amount_staked):
    # arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local tests")
    account = get_account()
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    # act
    dapp_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.stakeTokens(amount_staked, dapp_token.address, {"from": account})
    # assert
    assert (
        token_farm.stakingBalance(dapp_token.address, account.address) == amount_staked
    )
    assert token_farm.uniqueTokensStaked(account.address) == 1
    assert token_farm.stakers(0) == account.address
    return token_farm, dapp_token


def test_issue_tokens(amount_staked):
    # arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local tests")
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    starting_balance = dapp_token.balanceOf(account.address)
    # act
    tx = token_farm.issueTokens({"from": account})
    tx.wait(1)
    # assert
    # 1 dapp token = è uguale a una singola unita del prezzo di 1 eth
    # se eth vale 2000$ allora 2000 dapp tokens = 1 eth
    assert (
        dapp_token.balanceOf(account.address)
        == starting_balance + INITIAL_PRICE_FEED_VALUE
    )


def test_get_user_total_value_with_different_tokens(amount_staked, random_ERC20):
    # arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local tests")
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    # act
    add_tx = token_farm.addAllowedTokens(random_ERC20.address, {"from": account})
    add_tx.wait(1)
    set_tx = token_farm.setPriceFeedContract(
            random_ERC20.address, get_contract("eth_usd_price_feed"), {"from": account}
        )
    set_tx.wait(1)
    txa = random_ERC20.approve(token_farm.address, amount_staked, {"from": account})
    txa.wait(1)
    txb = token_farm.stakeTokens(amount_staked, random_ERC20.address, {"from": account})
    txb.wait(1)
    # assert
    total_value = token_farm.getUserTotalValue(account.address)
    assert total_value == INITIAL_PRICE_FEED_VALUE * 2 
    


def test_get_token_value(amount_staked):
    # arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local tests")
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    # act
    token_value, decimals = token_farm.getTokenValue(dapp_token.address)
    # assert
    assert token_value == INITIAL_PRICE_FEED_VALUE
    assert decimals == DECIMALS


def test_add_allowed_tokens(amount_staked, random_ERC20):
    # arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local tests")
    account = get_account()
    non_owner = get_account(index=1)
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    # act
    add_tx = token_farm.addAllowedTokens(random_ERC20.address, {"from": account})
    add_tx.wait(1)
    # assert
    # qui ho messo posizione 3(quarta posizione nell'array) 
    # perche nello script di deploy ce ne sono gia 3 di tokens
    # e non so come mai ma non prende -1 per prendere l'ultima
    # var dell'array
    assert token_farm.allowedTokens(3) == random_ERC20.address
    with pytest.raises(exceptions.VirtualMachineError):
        tx = token_farm.addAllowedTokens(dapp_token.address, {"from": non_owner})
        tx.wait(1)


def test_unstake_tokens(amount_staked):
    # arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local tests")
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    # act
    tx = token_farm.unstakeTokens(dapp_token.address, {"from": account})
    tx.wait(1)
    # assert
    assert (
        token_farm.stakingBalance(dapp_token.address, account.address) == 0
    )
    assert token_farm.uniqueTokensStaked(account.address) == 0
    assert dapp_token.balanceOf(account.address) == KEPT_BALANCE


"""
def test_get_user_total_value(amount_staked):
    # arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local tests")
    account = get_account()
    # act
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    # assert
    assert token_farm.getUserTotalValue(account.address) == INITIAL_PRICE_FEED_VALUE

"""