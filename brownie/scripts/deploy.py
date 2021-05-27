#!/usr/bin/python3.8

from brownie import Queue, accounts
import time


def main():
    ctrct = Queue.deploy(int(time.time()), int(time.time()) + 1 * 10 ** 8, "Test queue", 20, 0,
                         {'from': accounts[0]})

    ctrct.addToQueue("Dmitry Shrekov", {'from': accounts[2]})
    ctrct.addToQueue("Kek mdaaa", {'from': accounts[3]})
    assert False
