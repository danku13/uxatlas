---
slug: save-card-tokenized
title: "Save card (tokenized, secure)"
category: checkout-payment
mockupType: save-card-tokenized
severity: high
author: Stripe / Shopify
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
    "savedCards": [
      {
        "brand": "visa",
        "last4": "4242",
        "expiry": "12/27",
        "default": true
      },
      {
        "brand": "mastercard",
        "last4": "5555",
        "expiry": "08/26",
        "default": false
      }
    ],
    "newCard": false
  }
---

> Безопасное сохранение карты через tokenization — следующий вход без ввода данных.

## Описание

После первой оплаты — чекбокс «Сохранить карту для следующих покупок». Карта сохраняется через tokenization (Stripe, CloudPayments). При следующем checkout — выбор из сохранённых карт.

## Проблема

Повторный ввод карты каждый раз — главный friction для возвращающих покупателей. 50% бросают на этом шаге.

## Решение

Tokenization сохраняет карту безопасно (PCI-DSS compliant). Один тап — оплата сохранённой картой.

## Плюсы

- Возвращающиеся покупатели покупают в 1 тап
- PCI-DSS compliant (нет хранения PAN)
- Снижает checkout time на 60%

## Минусы

- Нужен платежный провайдер с tokenization

## Когда использовать

- E-commerce
- Подписки
- Food delivery
- Любой повторный платеж

## Принципы и гайдлайны

### Tokenize, never store PAN

**Источник:** `nielsen`

Never store Primary Account Numbers (PAN) yourself. Use payment provider's tokenization. You're not PCI scope then.

### Default to last used card

**Источник:** `material`

Pre-select the last used saved card. Most returning users will use the same card again.

## Конфигурация мокапа

```json
{
  "savedCards": [
    {
      "brand": "visa",
      "last4": "4242",
      "expiry": "12/27",
      "default": true
    },
    {
      "brand": "mastercard",
      "last4": "5555",
      "expiry": "08/26",
      "default": false
    }
  ],
  "newCard": false
}
```
