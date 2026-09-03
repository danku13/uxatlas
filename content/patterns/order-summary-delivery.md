---
slug: order-summary-delivery
title: Order summary with delivery estimate
category: checkout-payment
mockupType: order-summary-delivery
severity: high
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
    "address": "Москва, ул. Тверская 12, кв 45",
    "deliveryDate": "Завтра, до 21:00",
    "itemsCount": 2,
    "itemsTotal": "9 680 ₽",
    "delivery": "Бесплатно",
    "total": "9 680 ₽"
  }
---

> Перед оплатой — карточка с адресом, оценкой доставки и полной разбивкой цены.

## Описание

Полный order summary: адрес с возможностью изменить, ожидаемая дата доставки (с завтра), разбивка цены (товары + доставка + скидка). Все сюрпризы — до кнопки оплаты.

## Проблема

Неожиданные расходы или сроки доставки на финальном шаге — главная причина cart abandonment.

## Решение

Полная прозрачность до оплаты — пользователь не боится нажать «Оплатить».

## Плюсы

- Снижает cart abandonment
- Управляет ожиданиями
- Возможность изменить адрес

## Минусы

- Нужна интеграция с delivery API

## Когда использовать

- E-commerce
- Food delivery
- Любой checkout

## Принципы и гайдлайны

### No surprises before payment

**Источник:** `nielsen`

Show all costs, delivery estimates, and address before payment. Hidden fees on the final step cause 50%+ of abandonment.

### Allow last-minute edits

**Источник:** `material`

Let users edit address and delivery options from the summary screen. Don't force them back to cart.

## Конфигурация мокапа

```json
{
  "address": "Москва, ул. Тверская 12, кв 45",
  "deliveryDate": "Завтра, до 21:00",
  "itemsCount": 2,
  "itemsTotal": "9 680 ₽",
  "delivery": "Бесплатно",
  "total": "9 680 ₽"
}
```
