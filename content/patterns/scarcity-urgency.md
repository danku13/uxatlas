---
slug: scarcity-urgency
title: Scarcity / urgency cues
category: notifications-feedback
mockupType: scarcity-urgency
severity: low
author: Booking.com / Amazon
tags:
  - friction-reduction
  - clarity
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "viewersCount": 5,
    "stockLeft": 2,
    "discountEndsIn": "02:34:18",
    "recentPurchases": [
      "Анна из Москвы купила 5 мин назад",
      "Иван из СПб купил 12 мин назад"
    ]
  }
---

> «5 человек смотрят», «Осталось 2 шт» — индикаторы scarcity для urgency.

## Описание

На PDP: «X человек смотрят этот товар сейчас», «Осталось N шт», «Скидка действует до HH:MM». Реальные данные, не fake. Если fake — теряется trust.

## Проблема

Без urgency пользователь откладывает покупку «подумаю» и забывает. Conversion теряется.

## Решение

Real scarcity cues — socially proven to increase conversion 15-30%.

## Плюсы

- Снижает procrastination
- Повышает conversion 15-30%
- Социальное доказательство

## Минусы

- Fake scarcity разрушает trust
- Regulatory concerns в EU

## Когда использовать

- E-commerce
- Booking
- Ticket sales
- Limited offers

## Принципы и гайдлайны

### Only real scarcity, never fake

**Источник:** `nielsen`

Fake scarcity ('Only 1 left!' when there are 50) destroys trust. Use real data or don't show scarcity at all.

### Pair scarcity with CTA

**Источник:** `material`

Scarcity message should be near Add to Cart button. Distance reduces effect.

## Конфигурация мокапа

```json
{
  "viewersCount": 5,
  "stockLeft": 2,
  "discountEndsIn": "02:34:18",
  "recentPurchases": [
    "Анна из Москвы купила 5 мин назад",
    "Иван из СПб купил 12 мин назад"
  ]
}
```
