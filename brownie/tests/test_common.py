#!/usr/bin/python3
import brownie
import time


# https://github.com/mixbytes/brownie-example

def test_check_total_sum(accounts, contract):
    all_balance = contract.getNeededSum()
    assert all_balance == 1 * 10 ** 18


def test_check_curr_sum(accounts, contract):
    curr_balance = contract.getCurrSum()
    assert curr_balance == 0


def test_add_money(accounts, contract):
    accounts[2].transfer(contract, 700)
    assert contract.getCurrSum() == 700


def test_add_much_money(accounts, contract):
    accounts[2].transfer(contract, 1 * 10 ** 18)
    assert contract.getIsFinished() == True


def test_get_ended_date(accounts, contract):
    date = contract.getEndedDate()
    assert date > int(time.time())


def test_finished_by_seller(accounts, contract):
    contract.endCrowdbuy()
    assert contract.getIsFinished() == True
    assert contract.getCurrSum() == 0
