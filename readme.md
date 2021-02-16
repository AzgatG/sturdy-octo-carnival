### Требования

* NodeJS 12+

### Запуск проекта локально

1. `yarn/npm isntall` - установить зависимости
2. Создать файл с настройками в папке config. MONGO_URL - обязателный параметр
3. `yarn run dev-tools` - запустить инструменты разработчика. linter, prettier
4. `yarn run start` - запустить проект для разработки



Необходимо реализовать часть CRUD API для сайта мероприятий.

Есть две сущности:
Мероприятия (название, дата)
Участники мероприятия (фамилия, имя, отчество, ссылка на фотографию)
Каждый участник может участвовать в одном мероприятии.

Методы API:

1. GET /events 
Возвращает список всех мероприятий
Пример тела ответа: https://storage.yandexcloud.net/test-tasks/t1/events.json 

2. POST /events
Добавляет новое мероприятие, доступно админам.
Пример тела запроса:  https://storage.yandexcloud.net/test-tasks/t1/event_post.json 
Пример тела ответа: https://storage.yandexcloud.net/test-tasks/t1/event_7.json 
Возвращает код 201 Created

3. DELETE /events/:id 
Удаляет мероприятие и всех его участников с указанным id, доступно админам.
Например: DELETE /events/5 удаляет мероприятие с id = 5
Возвращает код 204 No Content

4. POST /events/:id/participants
Добавляет нового участника в мероприятие с указанным id, доступно админам.
Пример тела запроса:  https://storage.yandexcloud.net/test-tasks/t1/event_participants_post.json 
Пример тела ответа: https://storage.yandexcloud.net/test-tasks/t1/event_6.json 

5. GET /events/:id
Возвращает мероприятие с указанным id и список его участников
Примеры тела ответа: 
https://storage.yandexcloud.net/test-tasks/t1/event_1.json 
https://storage.yandexcloud.net/test-tasks/t1/event_7.json 

Во всех методах: 
Accept: application/json
Content-Type: application/json


Задания:

1. Базовое задание:
Реализуйте указанные методы, используя Nodejs, Express, PostgreSQL (или MySQL).
Данные сохраняются в базе данных.
Проверять авторизацию пользователя не обязательно.

2. Задание повышенной сложности:
Добавьте проверку авторизации пользователя:
Первый метод GET /events  доступен всем пользователям (даже без авторизации).
Пятый метод GET /events/:id доступен всем авторизованным пользователям.
Методы 2, 3, 4 доступны только админам.


Подробнее про авторизацию

Регистрацией и авторизацией пользователей, выдачей и продлением токенов занимается другой микросервис. Всем пользователям выдается JWT, подписанный по алгоритму ES256. Приватный ключ для создания JWT есть только у микросервиса авторизации, все остальные микросервисы могут проверить достоверность JWT с помощью открытого ключа.

Авторизованные пользователи присылают http-заголовок:
Authorization: Bearer <token>
где <token> - JWT, созданный по алгоритму ES256.

В JWT содержится поле "isAdmin" (тип string), который равен:
"1", если пользователь является админом,
"0", если это обычный пользователь.


Необходимо проверить валидность JWT, используя указанный открытый ключ:
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEv9f+CM/n9JU/JYBvjm15K3AjKSRA
oRY9ug1En1PAXg8F35KlAq8af7steEwwA7PBlm8/ctlC9DEE6TD1fcBGuA==
-----END PUBLIC KEY-----

Примеры JWT (можно использовать для тестирования):

eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NiIsImlzQWRtaW4iOiIxIiwiaWF0IjoxNjQwOTA4ODAwfQ.As32iVaUrLMX3bPrDJ_T_kNNhItO3f8Cz1-CpKrhevRm2KfyMUND2aogKUR7CO5foyKbDWu8kuymrVVvNRx_9A

eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MiIsImlzQWRtaW4iOiIwIiwiaWF0IjoxNjQwOTA4ODAwfQ.KfgGdfJvdTFV2ZuX6zCNhKjZK9eWWquMoeTilH_SR_BAfIulyabOE81oYjh2gaqtXj569T3gNALaZfElK9dx_Q


Содержимое JWT:

У админов:
{
  "sub": "46",
  "isAdmin": "1",
  "iat": 1640908800
}
У обычных пользователей:
{
  "sub": "92",
  "isAdmin": "0",
  "iat": 1640908800
}

Генерацию JWT реализовывать не нужно, он получается клиентским (фронтенд) приложением из другого микросервиса.

