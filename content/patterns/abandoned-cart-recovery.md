---
slug: abandoned-cart-recovery
title: Abandoned cart recovery
category: checkout-payment
mockupType: abandoned-cart-recovery
severity: high
author: Baymard / Shopify
tags:
  - high-dropoff
  - friction-reduction
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "notification": {
      "title": "Вы забыли корзину",
      "body": "2 товара ждут. Завершите заказ за 30 секунд.",
      "cta": "Вернуться к заказу",
      "discount": "Скидка 10% по коду CART10"
    },
    "items": [
      {
        "name": "Кроссовки Nike Air",
        "price": "8 990 ₽"
      },
      {
        "name": "Носки sport x3",
        "price": "690 ₽"
      }
    ]
  }
---

> Push/email со ссылкой на брошенную корзину — главная стратегия recovery.

## Описание

Если пользователь оставил корзину >30 минут — push: «Ваша корзина ждёт. Завершите заказ». Deep link прямо в checkout с сохранёнными товарами.

## Проблема

70% корзин брошены (Baymard). Без recovery — потеря 70% потенциальной выручки.

## Решение

Push/email через 30 мин / 24 часа / 3 дня. Скидка в последнем напоминании.

## Плюсы

- Восстанавливает 10-15% брошенных корзин
- Высокий ROI
- Не требует действия от пользователя

## Минусы

- Нужен push permission
- Privacy concerns — частота

## Когда использовать

- E-commerce
- Food delivery
- Travel booking

## Принципы и гайдлайны

### Send recovery in 30 minutes

**Источник:** `nielsen`

First recovery message within 30 minutes has highest conversion. User still remembers the cart.

### Deep link to checkout, not home

**Источник:** `material`

Deep link should land user directly in checkout with saved cart, not the home page. Reduce friction.

## Конфигурация мокапа

```json
{
  "notification": {
    "title": "Вы забыли корзину",
    "body": "2 товара ждут. Завершите заказ за 30 секунд.",
    "cta": "Вернуться к заказу",
    "discount": "Скидка 10% по коду CART10"
  },
  "items": [
    {
      "name": "Кроссовки Nike Air",
      "price": "8 990 ₽"
    },
    {
      "name": "Носки sport x3",
      "price": "690 ₽"
    }
  ]
}
```
