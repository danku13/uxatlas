---
slug: progressive-onboarding
title: Progressive onboarding (in-context hints)
category: onboarding
mockupType: progressive-onboarding
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
    "highlights": [
      {
        "target": "filter",
        "label": "Фильтры",
        "body": "Нажмите для уточнения поиска"
      },
      {
        "target": "favorite",
        "label": "Избранное",
        "body": "Сохраняйте понравившиеся товары"
      }
    ]
  }
---

> Обучаем пользователя в контексте — подсвечиваем фичи когда он впервые их видит, а не upfront.

## Описание

Вместо длинной карусели — пользователь сразу попадает в приложение. При первом контакте с новой функцией видит пульсирующую подсветку и подсказку. Каждый туториал — отдельный микро-шаг в моменте.

## Проблема

Длинные upfront-туториалы забываются через 30 секунд. Пользователь не может применить знания до того, как увидит реальный интерфейс.

## Решение

Обучаем в моменте — подсвечиваем функцию когда пользователь впервые видит её в реальном контексте. Знание закрепляется действием.

## Плюсы

- Знание закрепляется действием
- Не фрустрирует опытных пользователей
- Контекстуально — пользователь видит где кнопка

## Минусы

- Сложнее реализовать — нужна аналитика
- Может появиться слишком часто

## Когда использовать

- Приложение со сложным UI
- Когда есть скрытые жесты
- B2B с расширенным функционалом

## Принципы и гайдлайны

### Teach in context, not upfront

**Источник:** `nielsen`

People learn by doing. Show hints when users encounter a feature, not in a separate tutorial they'll forget in 30 seconds.

### Keep tips dismissible and rare

**Источник:** `material`

Don't show the same tip twice. Allow users to dismiss and never see again. Track who's seen what.

## Конфигурация мокапа

```json
{
  "highlights": [
    {
      "target": "filter",
      "label": "Фильтры",
      "body": "Нажмите для уточнения поиска"
    },
    {
      "target": "favorite",
      "label": "Избранное",
      "body": "Сохраняйте понравившиеся товары"
    }
  ]
}
```
