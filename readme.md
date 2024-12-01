# Telegram Crypto Payment Bot

## Описание
Телеграм бот для обработки криптовалютных платежей через сервис Cryptomus. Позволяет создавать платежи и отслеживать их статус в автоматическом режиме.

## Технологии
- TypeScript
- Node.js
- Telegraf (Telegram Bot Framework)
- Prisma (ORM)
- SQLite
- Node-cron
- Cryptomus API

## Требования
- Node.js (v14+)
- npm/yarn
- Telegram Bot Token
- Cryptomus API credentials

## Установка и настройка

1. **Клонируйте репозиторий**

```bash
git clone <repository-url>
```

2. **Установите зависимости**

```bash
npm install
```

3. **Настройте переменные окружения**

Создайте файл `.env` в корневой директории:
```
TOKEN=your_telegram_bot_token
CRYPTOMUS_API_KEY=your_cryptomus_api_key
CRYPTOMUS_MERCHANT_ID=your_cryptomus_merchant_id
```

4. **Настройте базу данных**

```bash
npx prisma generate
npx prisma migrate dev
```

5. **Запустите бота**

```bash
npm run build
npm start
```

## Структура проекта

```
src/
├── commands/         # Команды бота
├── config/          # Конфигурация
├── context/         # Типы контекста Telegram
├── cron/           # Планировщик задач
├── cryptomus/      # Сервис платежей
└── database/       # Работа с БД
```

## Функциональность

### Команды бота
- `/start` - Создание нового платежа

### Автоматические процессы
- Проверка статуса платежей каждые 5 минут
- Уведомление пользователей об изменении статуса платежа

## База данных

### Таблица Payment
- id: Int (Primary Key)
- uuid: String (Unique)
- orderId: String
- status: String
- amount: String
- paymentAmount: String?
- isFinal: Boolean
- url: String
- chatId: Int

## Разработка

### Запуск в режиме разработки

```bash
npm run dev
```

### Сборка проекта

```bash
npm run build
```

## Лицензия
ISC