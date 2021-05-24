// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//esp указывает с 1, pos=0 некорреткная позиция
contract Queue {
    //адрес-имя всех участников
    mapping(address => string) peoples;

    struct allowance {
        address addr;
        uint256 timestamp;
    }

    event ParticipantAdded(address _address, string name, uint256 position);
    event ParticipantDeleted(address _address, string name, uint256 position);
    event Allowance(address slave, address master);
    event ParticipantExchanged(address _address1, string name1, uint256 pos1, address _address2, string name2, uint256 pos2);

    string public eventName;

    uint256 public startTime;
    uint256 public endTime;
    uint256 public maxParticipants;
    uint256 constant TimeoutForChangePosition = 5 minutes;
    address payable owner;
    uint256 minFee = 0;
    //указатель на следующего сдающего
    uint256 ESP = 1;
    //    address[] paricipantsList;
    //пример 0x8D56f551b44a6dA6072a9608d63d664ce67681a5 -- место 1
    //пример 0x9CA585bCc394E71A239f59bcF31F32fDB878738C -- место 2
    address[] queueList;
    //у кого есть права поменяться местами(master-slave) те Петя должен вызвать changePosition()
    //пример Петя(0x8D56f551b44a6dA6072a9608d63d664ce67681a5) -- Вася(0x9CA585bCc394E71A239f59bcF31F32fDB878738C)
    mapping(address => allowance) allowanceList;
    //проверим что запись уже доступна и еще не завершена
    modifier checkTime() {
        require(block.timestamp < endTime, "Event already finished");
        require(block.timestamp > startTime, "Event doesn't started");
        _;
    }
    //чекнем огранчения на кол-во участников
    modifier checkMaxParticipants() {
        require(queueList.length < maxParticipants, "A lot of members");
        _;
    }
    //чекнем огранчения на размер минимального платежа
    modifier checkMinFee(uint256 currPayment) {
        require(currPayment >= minFee, "Too small payment");
        _;
    }
    //чекнем огранчения на таймаут обмена позициями
    modifier checkAllowance(address slave) {
        require(allowanceList[msg.sender].addr == slave, "Inccorrect slave address");
        require(block.timestamp - allowanceList[msg.sender].timestamp <= TimeoutForChangePosition, "Timeout for change position");
        _;
    }


    constructor(uint256 start, uint256 end, string memory title, uint256 maxLength, uint256 _minFee){
        require(block.timestamp < start, "Event must not have already begun");
        require(block.timestamp < end, "Event must not have already finished");
        startTime = start;
        endTime = end;
        eventName = title;
        maxParticipants = maxLength;
        minFee = _minFee;
    }
    //вернет указатель на следующего сдающего
    function getNextCompletePosition() external view returns (uint256) {
        return ESP;
    }
    //моя позиция в очереди
    function getMyPosition() external view returns (uint256) {
        uint256 pos = getFromQueueByID(msg.sender);
        return pos;
    }
    //текущая длина при записи
    function getCurrLen() external view returns (uint256) {
        return queueList.length;
    }
    //разрешение участнику поменятся в тобой местами
    function allowanceChangePosition(address whoCanChange) external {
        require(whoCanChange != address(0));
        allowanceList[whoCanChange].addr = msg.sender;
        allowanceList[whoCanChange].timestamp = block.timestamp;
        emit Allowance(msg.sender, whoCanChange);
    }
    //обмен местами с другом
    function changePosition(address whoIamChanging) external
    checkAllowance(whoIamChanging) {
        uint256 pos1 = getFromQueueByID(msg.sender);
        uint256 pos2 = getFromQueueByID(whoIamChanging);
        address temp = queueList[pos1];
        queueList[pos1] = queueList[pos2];
        queueList[pos2] = temp;

        emit ParticipantExchanged(whoIamChanging, peoples[whoIamChanging], pos1, msg.sender, peoples[msg.sender], pos2);
    }

    //записаться в очередь
    function addToQueue(string memory name) public payable
    checkMinFee(msg.value) {
        peoples[msg.sender] = name;
        queueList.push(msg.sender);
        if (msg.value > 0)
            owner.transfer(msg.value);
    }
    //выписаться из очереди
    function delFromQueue() external {
        delete peoples[msg.sender];
        uint256 pos = getFromQueueByID(msg.sender);
        queueList[pos] = address(0);
    }
    //сказать всем, что сдал лабу
    function completeTask() external {
        ESP += 1;
        if (ESP == queueList.length + 1)
            finalayze();
    }

    //сбросить очередь
    function purifyQueue() external {
        ESP = 1;
        delete queueList;
    }
    //завершить все действия с контрактом, после того как все сдали лабы
    function finalayze() private {

    }

    function getFromQueueByID(address addr) private view returns (uint256){
        for (uint i = 0; i < queueList.length; i++) {
            if (queueList[i] == addr)
                return i;
        }
        return 0;
    }

    receive() external payable {
        owner.transfer(msg.value);
    }

}
