---
slug: out-of-stock-recovery
title: Out of stock recovery
category: errors-recovery
mockupType: out-of-stock-recovery
severity: high
author: Amazon / ASOS
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
    "productName": "Nike Air Max 2024",
    "variant": "42 размер, Чёрный",
    "alternatives": [
      {
        "name": "Nike Air Max 2023",
        "price": "7 990 ₽",
        "available": true
      },
      {
        "name": "Adidas Ultraboost",
        "price": "12 490 ₽",
        "available": true
      },
      {
        "name": "Nike Pegasus 40",
        "price": "8 490 ₽",
        "available": true
      }
    ]
  }
---

> Товара нет в наличии → похожие товары + подписка на появление.

## Описание

Когда товар out of stock: баннер «Нет в наличии», кнопка «Сообщить о появлении» (email подписка), блок «Похожие товары» (3-4 альтернативы), «Выбрать другой размер/цвет».

## Проблема

Out of stock = конец funnel. Пользователь уходит к конкурентам, не зная об альтернативах.

## Решение

Recovery через похожие + подписку на возврат.

## Плюсы

- Сохраняет sale через альтернативы
- Email capture для future marketing
- Снижает bounce на 25-35%

## Минусы

- Нужна good recommendation engine

## Когда использовать

- E-commerce
- Booking
- Ticket sales

## Принципы и гайдлайны

### Always offer alternatives when out of stock

**Источник:** `nielsen`

Don't just say 'out of stock'. Show similar available products. Captures sale that would otherwise be lost.

### Email signup for restock notification

**Источник:** `material`

Offer 'notify when available' with email signup. Captures lead and brings user back when item returns.

## Конфигурация мокапа

```json
{
  "productName": "Nike Air Max 2024",
  "variant": "42 размер, Чёрный",
  "alternatives": [
    {
      "name": "Nike Air Max 2023",
      "price": "7 990 ₽",
      "available": true
    },
    {
      "name": "Adidas Ultraboost",
      "price": "12 490 ₽",
      "available": true
    },
    {
      "name": "Nike Pegasus 40",
      "price": "8 490 ₽",
      "available": true
    }
  ]
}
```
