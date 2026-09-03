---
slug: recently-viewed
title: Recently viewed carousel
category: search-discovery
mockupType: recently-viewed
severity: low
author: Amazon / Ozon
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
    "items": [
      {
        "name": "Nike Air Max",
        "price": "8 990 ₽",
        "color": "#9f1239"
      },
      {
        "name": "Adidas Ultraboost",
        "price": "12 490 ₽",
        "color": "#0891b2"
      },
      {
        "name": "Puma RS-X",
        "price": "6 790 ₽",
        "color": "#65a30d"
      },
      {
        "name": "Reebok Nano",
        "price": "9 490 ₽",
        "color": "#7c3aed"
      }
    ]
  }
---

> Горизонтальная карусель недавно просмотренных товаров — на главной и в catalog empty states.

## Описание

Секция «Вы недавно смотрели» с горизонтальной каруселью карточек товаров (до 20 последних). Запоминается даже между сессиями.

## Проблема

Пользователь видел товар, отвлёкся, вернулся — не может найти. Поиск не помогает (не помнит название).

## Решение

Recently viewed — между избранным и поиском.

## Плюсы

- Снижает friction возврата
- Высокий CTR (10-15% кликов в карусель)
- Personalization без усилий пользователя

## Минусы

- Нужно хранить историю per user/device

## Когда использовать

- E-commerce
- Контентные приложения
- Real estate
- Booking

## Принципы и гайдлайны

### Show 5-10 recent items max

**Источник:** `nielsen`

Show last 5-10 viewed items. More is overwhelming. Use 'View all' link for full history.

### Persist across sessions

**Источник:** `material`

Recently viewed should persist across app launches (and ideally across devices if synced). Most valuable for return visits.

## Конфигурация мокапа

```json
{
  "items": [
    {
      "name": "Nike Air Max",
      "price": "8 990 ₽",
      "color": "#9f1239"
    },
    {
      "name": "Adidas Ultraboost",
      "price": "12 490 ₽",
      "color": "#0891b2"
    },
    {
      "name": "Puma RS-X",
      "price": "6 790 ₽",
      "color": "#65a30d"
    },
    {
      "name": "Reebok Nano",
      "price": "9 490 ₽",
      "color": "#7c3aed"
    }
  ]
}
```
