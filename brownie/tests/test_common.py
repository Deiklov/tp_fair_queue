#!/usr/bin/python3
import brownie
from brownie import exceptions
import time


# https://github.com/mixbytes/brownie-example

def test_check_getters(accounts, contract):
    start_time = contract.startTime()
    end_time = contract.endTime()
    curr_length = contract.getCurrLen()
    assert contract.eventName() is not None
    assert start_time < end_time
    assert curr_length == 0


def test_add_to_queue(accounts, contract):
    time.sleep(0.1)
    pos0 = contract.addToQueue("Andrey Romanov", {'from': accounts[1]})
    pos1 = contract.addToQueue("Dmitry Shrekov", {'from': accounts[2]})
    pos2 = contract.addToQueue("Alex Pomazan", {'from': accounts[3]})
    curr_length = contract.getCurrLen()
    my_pos = contract.getMyPosition({'from': accounts[3]})
    my_pos_1 = contract.getMyPosition({'from': accounts[1]})
    assert curr_length == 3
    assert my_pos == 2
    assert my_pos_1 == 0


def test_get_position_queue(accounts, contract):
    pos0 = contract.addToQueue("Andrey Romanov", {'from': accounts[1]})
    pos1 = contract.addToQueue("Dmitry Shrekov", {'from': accounts[2]})
    pos2 = contract.addToQueue("Alex Pomazan", {'from': accounts[3]})
    participants_name = contract.getParticipantNames()
    participants_address = contract.getParticipantAddresses()
    assert participants_name[0] == "Andrey Romanov"
    assert participants_address[0] == accounts[1]
    assert contract.getMyPosition({'from': accounts[3]}) == 2


def test_allowance_to_change(accounts, contract):
    time.sleep(0.1)
    pos0 = contract.addToQueue("Andrey Romanov", {'from': accounts[1]})
    pos1 = contract.addToQueue("Dmitry Shrekov", {'from': accounts[2]})
    pos2 = contract.addToQueue("Alex Pomazan", {'from': accounts[3]})
    assert contract.getMyPosition({'from': accounts[2]}) == 1

    try:
        contract.changePosition(accounts[2], {'from': accounts[1]})
    except brownie.exceptions.VirtualMachineError as e:
        assert e.revert_msg == "Inccorrect slave address"

    tx = contract.allowanceChangePosition(accounts[1], {'from': accounts[2]})
    assert tx.events['Allowance'] is not None

    tx2 = contract.changePosition(accounts[2], {'from': accounts[1]})
    assert tx2.events['ParticipantExchanged'] is not None

    assert contract.getMyPosition({'from': accounts[2]}) == 0
    assert contract.getMyPosition({'from': accounts[1]}) == 1
    assert contract.getParticipantNames()[0] == "Dmitry Shrekov"
    assert contract.getParticipantNames()[1] == "Andrey Romanov"
    assert contract.getParticipantNames()[2] == "Alex Pomazan"


def test_complete_task(accounts, contract):
    time.sleep(0.1)
    contract.addToQueue("Andrey Romanov", {'from': accounts[1]})
    contract.addToQueue("Dmitry Shrekov", {'from': accounts[2]})
    contract.addToQueue("Alex Pomazan", {'from': accounts[3]})
    assert contract.getMyPosition({'from': accounts[2]}) == 1
    assert contract.getCurrCompletePosition() == 0

    contract.completeTask({'from': accounts[1]})
    # подтверждаем с аккаунта того, кого нет в очереди
    try:
        contract.completeTask({'from': accounts[0]})
    except brownie.exceptions.VirtualMachineError as e:
        assert e.revert_msg == "Participant with that address was not found"

    assert contract.getCurrCompletePosition() == 1

    # подтверждаем с аккаунта того, кто есть в очереди, но не должен сейчас подтверждать
    try:
        contract.completeTask({'from': accounts[1]})
    except brownie.exceptions.VirtualMachineError as e:
        assert e.revert_msg == "Only one persone can confirm that position"

    assert contract.getCurrCompletePosition() == 1
    contract.completeTask({'from': accounts[2]})

    assert contract.getCurrCompletePosition() == 2

    tx = contract.completeTask({'from': accounts[3]})
    assert tx.events['Finalization']['lastAdr'] == accounts[3]
    assert tx.events['Finalization']['lastName'] == "Alex Pomazan"
    assert tx.events['Finalization']['totalLength'] == 3
