---
slug: retry-with-status
title: Retry with progressive status
category: errors-recovery
mockupType: retry-with-status
severity: medium
author: Twitter / Instagram
tags:
  - clarity
  - friction-reduction
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "errorMessage": "Не удалось загрузить ленту",
    "steps": [
      "Подключение к серверу...",
      "Загрузка данных...",
      "Почти готово..."
    ]
  }
---

> Кнопка «Повторить» с прогрессом: «Подключение...» → «Загрузка данных...» → «Готово».

## Описание

При ошибке загрузки — кнопка «Повторить». При тапе — статусные сообщения сменяют друг друга, давая понимание что происходит. Не просто «Загрузка...» на 5 секунд.

## Проблема

Generic «Загрузка...» без обратной связи воспринимается как зависло. Пользователь жмёт повторно, создавая дублирующие запросы.

## Решение

Прогрессивные статусы дают чувство движения и понимание что приложение работает.

## Плюсы

- Снижает чувство «зависло»
- Меньше повторных тапов
- Пользователь видит прогресс

## Минусы

- Нужна детальная телеметрия на бэке

## Когда использовать

- Длинные загрузки
- Любые сетевые операции
- Upload/Download

## Принципы и гайдлайны

### Show progressive status

**Источник:** `nielsen`

Don't show generic 'Loading...' for more than 2 seconds. Show what's happening: connecting, fetching, processing.

### Distinguish slow from broken

**Источник:** `material`

If an operation exceeds expected time, show progress. Indeterminate spinners feel slower than they are.

## Конфигурация мокапа

```json
{
  "errorMessage": "Не удалось загрузить ленту",
  "steps": [
    "Подключение к серверу...",
    "Загрузка данных...",
    "Почти готово..."
  ]
}
```
