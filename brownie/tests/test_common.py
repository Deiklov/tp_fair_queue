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


# при удалении идет свдиг всех остальных, общая длина очереди уменьшается
# или без сдвига, общая длина равна сумме не zero address запись следующего идет на первый не нулевой адрес
def test_del_from_queue(accounts, contract):
    pos0 = contract.addToQueue("Andrey Romanov", {'from': accounts[1]})
    pos1 = contract.addToQueue("Dmitry Shrekov", {'from': accounts[2]})
    pos2 = contract.addToQueue("Alex Pomazan", {'from': accounts[3]})
    participants_name = contract.getParticipantNames()
    participants_address = contract.getParticipantAddresses()
    assert participants_name[0] == "Andrey Romanov"
    assert participants_address[0] == accounts[1]
    assert contract.getMyPosition({'from': accounts[3]}) == 2
