---
slug: wishlist-favorites
title: Wishlist / favorites
category: notifications-feedback
mockupType: wishlist-favorites
severity: low
author: Pinterest / Amazon
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
        "name": "Nike Air Max 2024",
        "price": "8 990 ₽",
        "priceDropped": true,
        "oldPrice": "11 990 ₽"
      },
      {
        "name": "Adidas Ultraboost",
        "price": "12 490 ₽",
        "priceDropped": false
      },
      {
        "name": "Apple Watch Series 9",
        "price": "29 990 ₽",
        "priceDropped": false
      }
    ]
  }
---

> Иконка сердца на карточке товара — сохраняет в избранное для отложенной покупки.

## Описание

Иконка сердца на карточке товара. Тап → анимация fill + toast «Добавлено в избранное». Wishlist доступен из профиля. При снижении цены на wishlisted товар — push уведомление.

## Проблема

Без wishlist пользователь либо покупает сразу (impulse), либо забывает товар. Conversion теряется на отложенных покупках.

## Решение

Wishlist — отложенная покупка + price drop notifications.

## Плюсы

- Сохраняет intent-to-buy
- Price drop notifications = высокий conversion
- Стандарт e-commerce

## Минусы

- Нужна инфраструктура для price tracking

## Когда использовать

- E-commerce
- Travel booking
- Real estate

## Принципы и гайдлайны

### Notify on price drops

**Источник:** `nielsen`

When price drops on wishlisted item, send push notification. Highest conversion channel for e-commerce.

### Heart icon universally recognized

**Источник:** `material`

Use heart icon for wishlist. Universally recognized across apps. Don't reinvent with custom icons.

## Конфигурация мокапа

```json
{
  "items": [
    {
      "name": "Nike Air Max 2024",
      "price": "8 990 ₽",
      "priceDropped": true,
      "oldPrice": "11 990 ₽"
    },
    {
      "name": "Adidas Ultraboost",
      "price": "12 490 ₽",
      "priceDropped": false
    },
    {
      "name": "Apple Watch Series 9",
      "price": "29 990 ₽",
      "priceDropped": false
    }
  ]
}
```
