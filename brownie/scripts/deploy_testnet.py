#!/usr/bin/python3.8

from brownie import Queue, accounts, network
import time
import os

# my metamask address
rinkeby_address = "0xb0Ea766e0D0160F6e97c5B0B8B7b63F34c783e8A"


#  contract id 0x91e3A4CCd18640aAB4A79a6980563f9FD8c09F91

# export PRIVATE_KEY=metamask key
# export WEB3_INFURA_PROJECT_ID=546330b923f6429da18d1d5609ffb401
# brownie run scripts/deploy_testnet.py --network rinkeby
# Верификация контракта
#  ctrct=CrowdBuy.at("0x91e3A4CCd18640aAB4A79a6980563f9FD8c09F91")
# CrowdBuy.publish_source(ctrct)

def main():
    if network.show_active() == "rinkeby":
        dev = accounts.add(os.getenv("PRIVATE_KEY"))
        return Queue.deploy(int(time.time()) + 10000000, 300, 1 * 10 ** 18, rinkeby_address, 15, {'from': dev},
                            publish_source=True)
