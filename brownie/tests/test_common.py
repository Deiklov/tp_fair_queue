#!/usr/bin/python3
import brownie
import time


# https://github.com/mixbytes/brownie-example

def test_check_getters(accounts, contract):
    start_time = contract.startTime()
    end_time = contract.endTime()
    curr_length = contract.getCurrLen()
    assert start_time < end_time
    assert curr_length == 0
