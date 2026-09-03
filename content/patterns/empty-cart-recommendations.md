---
slug: empty-cart-recommendations
title: Empty cart with recommendations
category: empty-states
mockupType: empty-cart-recommendations
severity: medium
author: Amazon / Ozon
tags:
  - high-dropoff
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
    "title": "Ваша корзина пуста",
    "body": "Добавьте товары из каталога — мы поможем выбрать",
    "cta": "Перейти в каталог",
    "recommendations": [
      {
        "name": "Nike Air Max",
        "price": "8 990 ₽"
      },
      {
        "name": "Adidas T-shirt",
        "price": "1 990 ₽"
      },
      {
        "name": "Часы Apple Watch",
        "price": "29 990 ₽"
      }
    ]
  }
---

> Пустая корзина + рекомендации популярных товаров — не тупик, а точка входа.

## Описание

При пустой корзине: иконка, «Ваша корзина пуста», «Добавьте товары из каталога» + горизонтальная карусель «Популярное сейчас» (5-7 товаров).

## Проблема

Пустая корзина = тупик. Пользователь не знает куда дальше. Закрывает приложение.

## Решение

Превращаем empty cart в discovery moment.

## Плюсы

- Возвращает в funnel
- Увеличивает discovery
- Снижает bounce на 20-30%

## Минусы

- Нужна инфраструктура recommended products

## Когда использовать

- E-commerce
- Food delivery
- Marketplace

## Принципы и гайдлайны

### Recommend products in empty cart

**Источник:** `nielsen`

Don't show dead-end empty cart. Show recommended/trending products to bring user back into shopping flow.

### Make CTA prominent

**Источник:** `material`

Empty cart should have a prominent CTA to catalog. Don't make user hunt for how to add items.

## Конфигурация мокапа

```json
{
  "title": "Ваша корзина пуста",
  "body": "Добавьте товары из каталога — мы поможем выбрать",
  "cta": "Перейти в каталог",
  "recommendations": [
    {
      "name": "Nike Air Max",
      "price": "8 990 ₽"
    },
    {
      "name": "Adidas T-shirt",
      "price": "1 990 ₽"
    },
    {
      "name": "Часы Apple Watch",
      "price": "29 990 ₽"
    }
  ]
}
```
