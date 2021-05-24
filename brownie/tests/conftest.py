import pytest
import time


@pytest.fixture(scope="function", autouse=True)
def isolate(fn_isolation):
    # выполнять откат цепи после завершения каждого теста, чтобы обеспечить надлежащую изоляцию
    # https://eth-brownie.readthedocs.io/en/v1.10.3/tests-pytest-intro.html#isolation-fixtures
    pass


@pytest.fixture(scope="module")
def contract(Queue, accounts):
    return Queue.deploy(int(time.time()) + 1000, int(time.time()) + 1 * 10 ** 6, "Test queue", 20, 0,
                        {'from': accounts[0]})
