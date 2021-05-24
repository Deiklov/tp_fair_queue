pragma solidity ^0.8.4;

contract Queue {
    mapping(address => string) peoples;
    mapping(address => uint256) allowanceTimeMap;

    event ParticipantAdded(address _address, string name, uint256 position);
    event ParticipantDeleted(address _address, string name, uint256 position);
    event ParticipantExchanged(address _address1, string name1, uint256 pos1, address _address2, string name2, uint256 pos2);

    string private _eventName;

    uint256 startTime;
    uint256 endTime;
    uint256 maxParticipants;
    uint256 timeoutForChangePosition = 5 minutes;
    address payable owner;
    uint256 minFee = 0;
    //указатель на текущего сдающего
    uint256 ESP = 1;
    //    address[] paricipantsList;
    //пример 0x8D56f551b44a6dA6072a9608d63d664ce67681a5 -- место 1
    //пример 0x9CA585bCc394E71A239f59bcF31F32fDB878738C -- место 2
    address[] queueList;
    //у кого есть права поменяться местами(master-slave) те Петя должен вызвать changePosition()
    //пример Петя(0x8D56f551b44a6dA6072a9608d63d664ce67681a5) -- Вася(0x9CA585bCc394E71A239f59bcF31F32fDB878738C)
    mapping(address => address) allowanceList;
    //проверим что запись уже доступна и еще не завершена
    modifier checkTime() {
        require(now < endTime, "Event already finished");
        require(now > startTime, "Event doesn't started");
        _;
    }
    //чекнем огранчения на кол-во участников
    modifier checkMaxParticipants() {
        require(paricipantsList.length < maxParticipants, "A lot of members");
        _;
    }
    //чекнем огранчения на размер минимального платежа
    modifier checkMinFee() {
        require(msg.value > minFee, "Too small payment");
        _;
    }


    constructor(uint256 start, uint256 end, string title, uint256 maxLength, uint256 _minFee){
        require(now < start, "Event must not have already begun");
        require(now > end, "Event must not have already finished");
        startTime = start;
        endTime = end;
        _eventName = title;
        maxParticipants = maxLength;
        minFee = _minFee;
    }
    //вернет указатель на последнего сдавшего
    function getLastCompletePosition() external view returns (uint256) {
        return ESP;
    }
    //моя позиция в очереди
    function getMyPosition() external returns (uint256) {
        uint256 pos = getFromQueueByID(msg.sender);
        return queueList[pos];
    }
    //текущая длина при записи
    function getCurrLen() external {
        return queueList.length;
    }
    //максимальное кол-во участников
    function getLenLimit() external returns (uint256){
        return maxParticipants;
    }

    function getStartTime() external returns (uint256){
        return startTime;
    }

    function getEndTime() external returns (uint256){
        return endTime;
    }
    //разрешение участнику поменятся в тобой местами
    function allowanceChangePosition(address whoCanChange) external {
        require(address != address(0));
        allowanceList[whoCanChange] = msg.sender;
    }
    //обмен местами с другом
    //todo нужно разрешение и скинуть евент что поменялись
    function changePosition(address whoIamChanging) external {
        require(allowanceList[msg.sender] == whoIamChanging, "You haven't allowance to change");
        uint256 pos1 = getFromQueueByID(msg.sender);
        uint256 pos2 = getFromQueueByID(whoIamChanging);
        address temp = queueList[pos1];
        queueList[pos1] = queueList[pos2];
        queueList[pos2] = temp;

        emit ParticipantExchanged(whoIamChanging, peoples[whoIamChanging], pos1, msg.sender, peoples[msg.sender], pos2);
    }

    //записаться в очередь
    function addToQueue(string name) external
    checkMinFee
    {
        peoples[msg.sender] = name;
        queueList.push(msg.sender);
    }
    //выписаться из очереди
    function delFromQueue() external {
        peoples[msg.sender] = "";
        uint256 pos = getFromQueueByID(msg.sender);
        queueList[pos] = 0;
    }
    //сказать всем, что сдал лабу
    function completeTask() external {
        ESP += 1;
    }

    //сбросить очередь
    function purifyQueue() external {
        ESP = 1;
        queueList = new uint256[](0);
    }
    //завершить все действия с контрактом, после того как все сдали лабы
    function finalayze() private {

    }

    function getFromQueueByID(address addr) private view returns (uint256){
        for (uint i = 0; i < arrayLength; i++) {
            if (queueList[i] == addr)
                return i;
        }
        return 0;
    }
    //receive() external payable  {
    //owner.transfer()
    //emit PaymentReceived(msg.sender, msg.value);
    //}

}
