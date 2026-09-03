---
slug: feature-tour-overlay
title: Feature tour overlay
category: onboarding
mockupType: feature-tour-overlay
severity: medium
author: Linear / Notion
tags:
  - high-dropoff
  - clarity
  - progressive-disclosure
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "steps": [
      {
        "target": "search",
        "title": "Поиск",
        "body": "Найдите любой товар за секунды"
      },
      {
        "target": "filter",
        "title": "Фильтры",
        "body": "Уточните категорию и цену"
      },
      {
        "target": "cart",
        "title": "Корзина",
        "body": "Добавляйте товары и оформляйте"
      }
    ]
  }
---

> Полупрозрачный overlay с подсветкой 3-5 ключевых функций после первого входа.

## Описание

После первого запуска — overlay с затемнённым фоном и подсветкой первой ключевой функции. Tooltip с описанием + «Далее». После 3-5 подсказок — «Готово начать».

## Проблема

Пользователь видит сложный интерфейс и не понимает с чего начать. 40% abandon в первые 30 секунд из-за перегруза.

## Решение

Подсвечиваем 3-5 ключевых функций в логическом порядке.

## Плюсы

- Обучает в контексте
- Снижает time-to-value
- Не прерывает надолго

## Минусы

- Может раздражать опытных
- Нужна аналитика для skip-логики

## Когда использовать

- B2B SaaS
- Сложные приложения
- Обновления с новыми фичами

## Принципы и гайдлайны

### Tour maximum 5 steps

**Источник:** `nielsen`

Beyond 5 steps, users lose patience. Pick the 3-5 most critical actions and stop.

### Allow skip always

**Источник:** `hig`

Power users hate tours. Always allow skipping — they'll explore on their own.

## Конфигурация мокапа

```json
{
  "steps": [
    {
      "target": "search",
      "title": "Поиск",
      "body": "Найдите любой товар за секунды"
    },
    {
      "target": "filter",
      "title": "Фильтры",
      "body": "Уточните категорию и цену"
    },
    {
      "target": "cart",
      "title": "Корзина",
      "body": "Добавляйте товары и оформляйте"
    }
  ]
}
```
