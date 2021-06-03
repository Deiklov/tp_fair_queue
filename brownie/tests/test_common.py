#!/usr/bin/python3
import brownie
from brownie import exceptions, Queue, Factory, accounts
import time


# https://github.com/mixbytes/brownie-example

def test_create(accounts, contract):
    queuenew = deploy_queue(contract, int(time.time()) + 1, int(time.time()) + 1 * 10 ** 6, "test queue", 20, 0,
                            accounts[0])
    time.sleep(1.2)

    queuenew.addToQueue("Andrey Romanov", {'from': accounts[1]})
    queuenew.addToQueue("Dmitry Shrekov", {'from': accounts[2]})
    queuenew.addToQueue("Alex Pomazan", {'from': accounts[3]})

    assert queuenew.getCurrLen() == 3


def deploy_queue(factory: Factory, start: int, end: int, name: str, maxparicip: int, minfee: int,
                 acc_from) -> Queue:
    addr = factory.createQueue(int(start), int(end) + 1 * 10 ** 6, name, maxparicip, minfee,
                               {'from': acc_from})
    return Queue.at(addr.events[0]['ctrctAdr'])


def test_check_getters(accounts, contract):
    queue_new = deploy_queue(contract, int(time.time())+1, int(time.time()) + 1 * 10 ** 6, "test queue", 20, 0,
                             accounts[0])
    time.sleep(1.2)
    start_time = queue_new.startTime()
    end_time = queue_new.endTime()
    curr_length = queue_new.getCurrLen()
    assert queue_new.eventName() is not None
    assert start_time < end_time
    assert curr_length == 0


def test_add_to_queue(accounts, contract):
    queue_new = deploy_queue(contract, int(time.time())+1, int(time.time()) + 1 * 10 ** 6, "test queue", 20, 0,
                             accounts[0])
    time.sleep(1.2)
    queue_new.addToQueue("Andrey Romanov", {'from': accounts[1]})
    queue_new.addToQueue("Dmitry Shrekov", {'from': accounts[2]})
    queue_new.addToQueue("Alex Pomazan", {'from': accounts[3]})
    curr_length = queue_new.getCurrLen()
    my_pos = queue_new.getMyPosition({'from': accounts[3]})
    my_pos_1 = queue_new.getMyPosition({'from': accounts[1]})
    assert curr_length == 3
    assert my_pos == 2
    assert my_pos_1 == 0


def test_get_position_queue(accounts, contract):
    queue_new = deploy_queue(contract, int(time.time())+1, int(time.time()) + 1 * 10 ** 6, "test queue", 20, 0,
                             accounts[0])
    time.sleep(1.2)
    queue_new.addToQueue("Andrey Romanov", {'from': accounts[1]})
    queue_new.addToQueue("Dmitry Shrekov", {'from': accounts[2]})
    queue_new.addToQueue("Alex Pomazan", {'from': accounts[3]})
    participants_name = queue_new.getParticipantNames()
    participants_address = queue_new.getParticipantAddresses()
    assert participants_name[0] == "Andrey Romanov"
    assert participants_address[0] == accounts[1]
    assert queue_new.getMyPosition({'from': accounts[3]}) == 2


#
#
def test_allowance_to_change(accounts, contract):
    queue_new = deploy_queue(contract, int(time.time())+1, int(time.time()) + 1 * 10 ** 6, "test queue", 20, 0,
                             accounts[0])
    time.sleep(1.2)
    queue_new.addToQueue("Andrey Romanov", {'from': accounts[1]})
    queue_new.addToQueue("Dmitry Shrekov", {'from': accounts[2]})
    queue_new.addToQueue("Alex Pomazan", {'from': accounts[3]})
    assert queue_new.getMyPosition({'from': accounts[2]}) == 1

    try:
        queue_new.changePosition(accounts[2], {'from': accounts[1]})
    except brownie.exceptions.VirtualMachineError as e:
        assert e.revert_msg == "Inccorrect slave address"

    tx = queue_new.allowanceChangePosition(accounts[1], {'from': accounts[2]})
    assert tx.events['Allowance'] is not None

    tx2 = queue_new.changePosition(accounts[2], {'from': accounts[1]})
    assert tx2.events['ParticipantExchanged'] is not None

    assert queue_new.getMyPosition({'from': accounts[2]}) == 0
    assert queue_new.getMyPosition({'from': accounts[1]}) == 1
    assert queue_new.getParticipantNames()[0] == "Dmitry Shrekov"
    assert queue_new.getParticipantNames()[1] == "Andrey Romanov"
    assert queue_new.getParticipantNames()[2] == "Alex Pomazan"


#
#
def test_complete_task(accounts, contract):
    queue_new = deploy_queue(contract, int(time.time())+1, int(time.time()) + 1 * 10 ** 6, "test queue", 20, 0,
                             accounts[0])
    time.sleep(1.2)
    queue_new.addToQueue("Andrey Romanov", {'from': accounts[1]})
    queue_new.addToQueue("Dmitry Shrekov", {'from': accounts[2]})
    queue_new.addToQueue("Alex Pomazan", {'from': accounts[3]})
    assert queue_new.getMyPosition({'from': accounts[2]}) == 1
    assert queue_new.getCurrCompletePosition() == 0

    queue_new.completeTask({'from': accounts[1]})
    # подтверждаем с аккаунта того, кого нет в очереди
    try:
        queue_new.completeTask({'from': accounts[0]})
    except brownie.exceptions.VirtualMachineError as e:
        assert e.revert_msg == "Participant with that address was not found"

    assert queue_new.getCurrCompletePosition() == 1

    # подтверждаем с аккаунта того, кто есть в очереди, но не должен сейчас подтверждать
    try:
        queue_new.completeTask({'from': accounts[1]})
    except brownie.exceptions.VirtualMachineError as e:
        assert e.revert_msg == "Only one persone can confirm that position"

    assert queue_new.getCurrCompletePosition() == 1
    queue_new.completeTask({'from': accounts[2]})

    assert queue_new.getCurrCompletePosition() == 2

    tx = queue_new.completeTask({'from': accounts[3]})
    assert tx.events['Finalization']['lastAdr'] == accounts[3]
    assert tx.events['Finalization']['lastName'] == "Alex Pomazan"
    assert tx.events['Finalization']['totalLength'] == 3
