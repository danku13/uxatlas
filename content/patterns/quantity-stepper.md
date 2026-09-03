---
slug: quantity-stepper
title: Quantity stepper with stock awareness
category: forms-input
mockupType: quantity-stepper
severity: medium
author: Shopify / Amazon
tags:
  - error-prone
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
    "min": 1,
    "max": 7,
    "current": 1,
    "stock": 7,
    "stockLabel": "В наличии: 7 шт"
  }
---

> Степпер количества с показом остатков и лимитов (min/max).

## Описание

Кнопки «-» «+» и число между. Под степпером — «В наличии: 7 шт». Если пользователь хочет 10, а есть 7 — кнопка «+» блокируется и показывается «Максимум: 7».

## Проблема

Без показа остатков пользователь заказывает 10, а есть 7 — ошибка на checkout. Разочарование, abandon.

## Решение

Live stock awareness в stepper — пользователь видит лимиты сразу.

## Плюсы

- Снижает checkout errors на 40%
- Управляет ожиданиями
- Чувство urgency при малых остатках

## Минусы

- Нужна real-time inventory интеграция

## Когда использовать

- E-commerce
- Ticket booking
- Restaurant reservations

## Принципы и гайдлайны

### Show stock count when low

**Источник:** `nielsen`

When stock is low (<10), show exact count. Creates urgency and sets expectations. Don't show stock when high (>100).

### Block at max, don't show error after

**Источник:** `material`

Disable + button at stock limit. Don't let user enter more and show error on submit. Preventive > reactive.

## Конфигурация мокапа

```json
{
  "min": 1,
  "max": 7,
  "current": 1,
  "stock": 7,
  "stockLabel": "В наличии: 7 шт"
}
```
