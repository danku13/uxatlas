---
slug: offline-mode-cached
title: Offline mode with cached data
category: errors-recovery
mockupType: offline-mode-cached
severity: high
author: Telegram / Spotify
tags:
  - high-dropoff
  - error-prone
  - clarity
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "lastUpdated": "Обновлено 5 минут назад",
    "items": [
      "Заказ #1028 доставлён",
      "Скидка 20% на кроссовки",
      "Новое сообщение от поддержки"
    ]
  }
---

> Когда нет сети — показываем кэшированные данные с баннером «Офлайн» и кнопкой «Повторить».

## Описание

Приложение detects offline → показывает жёлтый баннер «Нет соединения. Показаны последние данные.» + кнопка «Повторить». Контент остаётся видимым (кэш), действия с очередями на синхронизацию.

## Проблема

Без интернета приложение показывает белый экран или бесконечный спиннер — пользователь думает что оно сломалось и уходит.

## Решение

Показываем что есть (кэш), явно сообщаем статус, даём путь к восстановлению.

## Плюсы

- Приложение «работает» даже офлайн
- Пользователь информирован
- Действия ставятся в очередь

## Минусы

- Нужна стратегия кэширования
- Конфликты при синхронизации

## Когда использовать

- News/feed
- Music streaming
- Любые приложения с частым использованием в метро

## Принципы и гайдлайны

### Degrade gracefully

**Источник:** `nielsen`

When network fails, show cached data with a clear offline banner. Empty screens or infinite spinners make users think the app is broken.

### Queue actions for sync

**Источник:** `material`

Let users continue interacting offline. Queue writes and sync when connection returns. Notify on completion.

## Конфигурация мокапа

```json
{
  "lastUpdated": "Обновлено 5 минут назад",
  "items": [
    "Заказ #1028 доставлён",
    "Скидка 20% на кроссовки",
    "Новое сообщение от поддержки"
  ]
}
```
