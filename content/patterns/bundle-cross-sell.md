---
slug: bundle-cross-sell
title: Bundle / cross-sell (complementary products)
category: checkout-payment
mockupType: bundle-cross-sell
severity: low
author: "Apple Store / McDonald's"
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
    "mainProduct": {
      "name": "iPhone 15 Pro",
      "price": "99 990 ₽"
    },
    "bundleItems": [
      {
        "name": "Чехол",
        "price": "2 990 ₽",
        "bundledPrice": "1 990 ₽",
        "selected": true
      },
      {
        "name": "Зарядка",
        "price": "3 490 ₽",
        "bundledPrice": "2 490 ₽",
        "selected": true
      },
      {
        "name": "AirPods",
        "price": "19 990 ₽",
        "bundledPrice": "16 990 ₽",
        "selected": false
      }
    ],
    "discount": "10%"
  }
---

> Комплект «купите вместе дешевле» — основной товар + аксессуары со скидкой.

## Описание

На PDP или cart — блок «С этим товаром покупают»: товар + 2-3 дополнения со скидкой 10-15% при покупке комплекта. Чекбоксы выбора, пересчёт суммы.

## Проблема

Cross-sell через popups раздражает. Без cross-sell — упущенная выручка (AOV ниже).

## Решение

Bundle с реальной скидкой — пользователь видит выгоду, не раздражается.

## Плюсы

- Увеличивает AOV на 15-30%
- Полезно для пользователя (забыл купить)
- Неинтрузивный cross-sell

## Минусы

- Нужна careful selection of bundle items

## Когда использовать

- E-commerce
- SaaS upsell
- Travel (отель+перелёт)

## Принципы и гайдлайны

### Bundle with real discount, not upsell

**Источник:** `nielsen`

Bundle should offer real discount on items user actually needs. Don't bundle random products — relevance is key.

### Let users opt out of individual items

**Источник:** `material`

Allow users to deselect individual bundle items. Forced bundles feel manipulative.

## Конфигурация мокапа

```json
{
  "mainProduct": {
    "name": "iPhone 15 Pro",
    "price": "99 990 ₽"
  },
  "bundleItems": [
    {
      "name": "Чехол",
      "price": "2 990 ₽",
      "bundledPrice": "1 990 ₽",
      "selected": true
    },
    {
      "name": "Зарядка",
      "price": "3 490 ₽",
      "bundledPrice": "2 490 ₽",
      "selected": true
    },
    {
      "name": "AirPods",
      "price": "19 990 ₽",
      "bundledPrice": "16 990 ₽",
      "selected": false
    }
  ],
  "discount": "10%"
}
```
