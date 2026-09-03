---
slug: coupon-code-input
title: Coupon / promo code input with validation
category: checkout-payment
mockupType: coupon-code-input
severity: low
author: Stripe / Shopify
tags:
  - error-prone
  - friction-reduction
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "placeholder": "Введите промокод",
    "validCodes": [
      "WELCOME10",
      "SUMMER20"
    ],
    "applied": null
  }
---

> Поле ввода промокода с inline валидацией и применением скидки.

## Описание

Поле «Промокод» + кнопка «Применить». При тапе — inline валидация: зелёный чек + «-10% применено» или красная ошибка «Промокод не найден». Скидка сразу видна в summary.

## Проблема

Промокоды часто не работают — пользователь разочаровывается и abandons. Без inline validation ждёт до финального шага.

## Решение

Instant validation + показ скидки в summary.

## Плюсы

- Меньше abandoned carts из-за промокодов
- Позитивный feedback при успехе
- Прозрачность цены

## Минусы

- Нужна быстрая API для validation

## Когда использовать

- E-commerce
- Подписки
- SaaS trial
- Food delivery

## Принципы и гайдлайны

### Validate coupon instantly

**Источник:** `nielsen`

Validate coupon code as user types or immediately on Apply. Don't wait until checkout submit — users hate late surprises.

### Show discount in price summary

**Источник:** `material`

When coupon applied, immediately show discount line in price summary: '-10% (WELCOME10): -899 ₽'. Transparent.

## Конфигурация мокапа

```json
{
  "placeholder": "Введите промокод",
  "validCodes": [
    "WELCOME10",
    "SUMMER20"
  ],
  "applied": null
}
```
