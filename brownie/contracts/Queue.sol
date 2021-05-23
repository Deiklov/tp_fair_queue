pragma solidity ^0.8.4;

contract Queue {
    struct People {
        string Name;
        address Address;
    }

    string private _eventName;

    uint256 startTime;
    uint256 endTime;
    uint256 maxParticipants;
    uint256 timeoutForChangePosition;
    address owner;
    address[] paricipantsList;
    //пример 0x8D56f551b44a6dA6072a9608d63d664ce67681a5 -- место 1
    //пример 0x9CA585bCc394E71A239f59bcF31F32fDB878738C -- место 2
    mapping(address => uint256) queueList;
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


    constructor(){
    }
    //вернет указатель на последнего сдавшего
    function getLastCompletePosition() external view {

    }
    //моя позиция в очереди
    function getMyPosition() external returns (uint256) {
        return queueList[msg.sender];
    }
    //текущая длина при записи
    function getCurrLen() external {

    }
    //максимальное кол-во участников
    function getLenLimit() external returns (uint256){
        return maxParticipants;
    }
    //разрешение участнику поменятся в тобой местами
    function allowanceChangePosition(address whoCanChange) external {

    }
    //обмен местами с другом
    //todo нужно разрешение и скинуть евент что поменялись
    function changePosition(address whoIamChanging) external {

    }

    //записаться в очередь
    function addToQueue() external {

    }
    //выписаться из очереди
    function delFromQueue() external {

    }
    //сказать всем, что сдал лабу
    function completeTask() external {

    }

    //сбросить очередь
    function purifyQueue() external {

    }
    //завершить все действия с контрактом, после того как все сдали лабы
    function finalayze() private {

    }

}
