# tp_fair_queue
Dapp для честной организации очереди
## Описание проекта
Проект представляет собой DApp, которое используется для организации очередей
## Цель
Создать удобное приложение для организации независиммых и честных очередей для сдачи лаб, дз, курсачей и пр.
## Задачи
1. Создать смарт-контракт, используя язык Solidity, представляющий API для базовых действий с очередью(создание,запись в очередь, удаление из очереди, обмен местами)
2. Разработать интерфейс пользователя, используя react.js
3. Настроить взаимодействие со смарт контрактом через MetaMask  
## Особенности использования
* Для отностилеьно некритичных действий, реальная среда применения будет тестовая сеть(например, Rinkeby), тк никто не захочет платить реальный эфир за транзакцию при записи в обычный список сдачи дз
* В случае когда место в очереди очень важно(например, очередь за iPhone), реальной средой может быть mainnet и тот кто задеплоил контракт, например, владелец магазина может получать плату за добавление в очередь нового участника
## Решаемые проблемы
1. Никто не может удалить список, те он случайно не потеряется, не порвется и не сотрется
2. Можно поставить отложенный старт записи в очередь
3. Нельзя заранее записать в очередь своих друзей(код контракта всем виден)
## Недостатки
1. Занятие мест для друзей, используя отправку транзакций с их аккаунтов  
2. Нужен MetaMask всем участникам очереди, запись в google таблицы требует просто браузера
3. Быстрое занятие мест, используя скрипты
## Инструкция для тестовго запуска
[Ссылка на презентацию](https://docs.google.com/presentation/d/1Xc2GNQXyA11_wb_-0xMZi_3nNMQBRsQfhT9v4FohRUM/edit?usp=sharing)