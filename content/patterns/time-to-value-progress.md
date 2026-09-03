---
slug: time-to-value-progress
title: Time-to-value progress indicator
category: onboarding
mockupType: time-to-value-progress
severity: medium
author: Stripe / Linear
tags:
  - high-dropoff
  - friction-reduction
  - progressive-disclosure
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "goal": "Первый заказ",
    "steps": [
      {
        "title": "Создайте профиль",
        "done": true
      },
      {
        "title": "Добавьте адрес доставки",
        "done": true
      },
      {
        "title": "Выберите товар",
        "done": false
      }
    ]
  }
---

> Прогресс до первого значимого действия: «2 из 3 шагов до первого заказа».

## Описание

Во время setup показываем прогресс до первого value: заполните профиль → добавьте адрес → сделайте первый заказ. Каждый шаг — это движение к цели, не к завершению setup.

## Проблема

Setup выглядит как «ещё 5 полей до конца» — пользователь бросает, не видя ценности впереди.

## Решение

Прогресс ведёт к value (первый заказ), а не к завершению формы. Психологически легче продолжать.

## Плюсы

- Фокус на ценности
- Снижает setup abandonment
- Обучает последовательности действий

## Минусы

- Нужно понимать что для пользователя — value

## Когда использовать

- SaaS onboarding
- Банковские приложения
- Marketplace с профилем

## Принципы и гайдлайны

### Lead to value, not completion

**Источник:** `nielsen`

Progress bars should lead to the user's first real value (first order, first message), not to form completion. That's what motivates.

## Конфигурация мокапа

```json
{
  "goal": "Первый заказ",
  "steps": [
    {
      "title": "Создайте профиль",
      "done": true
    },
    {
      "title": "Добавьте адрес доставки",
      "done": true
    },
    {
      "title": "Выберите товар",
      "done": false
    }
  ]
}
```
