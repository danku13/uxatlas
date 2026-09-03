---
slug: inline-progress-percentage
title: Inline progress with percentage and ETA
category: loading-waiting
mockupType: inline-progress-percentage
severity: medium
author: Google Photos / iCloud
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
    "operation": "Загрузка фото",
    "total": 24,
    "current": 16
  }
---

> Для длинных операций — прогресс-бар с процентами и оценкой времени.

## Описание

При загрузке файла >2 секунд — показываем прогресс с % и ETA («12 сек осталось»). Лучше, чем indeterminate spinner.

## Проблема

Indeterminate спиннеры на длинных операциях ощущаются как зависшие. Пользователь не знает сколько ждать.

## Решение

Показываем конкретный прогресс и ETA — пользователь терпеливо ждёт.

## Плюсы

- Снижает perceived waiting time
- Пользователь может решить подождать или вернуться
- Честность

## Минусы

- Нужна точная телеметрия на бэке

## Когда использовать

- Upload файлов
- Установка обновлений
- Длинные расчёты

## Принципы и гайдлайны

### Show progress for >2s operations

**Источник:** `nielsen`

Indeterminate spinners feel slower than they are. Show percentage and ETA for operations longer than 2 seconds.

### Be honest about time

**Источник:** `material`

Don't say 'Almost done' if you're not. Users will forgive accurate estimates; they'll hate false promises.

## Конфигурация мокапа

```json
{
  "operation": "Загрузка фото",
  "total": 24,
  "current": 16
}
```
