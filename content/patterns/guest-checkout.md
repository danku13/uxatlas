---
slug: guest-checkout
title: Guest checkout (no account required)
category: checkout-payment
mockupType: guest-checkout
severity: high
author: Amazon / Baymard Research
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
    "options": [
      {
        "id": "guest",
        "title": "Купить как гость",
        "desc": "Только email — быстро",
        "recommended": true
      },
      {
        "id": "signup",
        "title": "Создать аккаунт",
        "desc": "Пароль + сохранение данных"
      }
    ]
  }
---

> Возможность купить без обязательной регистрации — главный фактор снижения cart abandonment.

## Описание

На экране checkout — две опции: «Купить как гость» (только email) и «Создать аккаунт» (с паролем). Гость может позже создать аккаунт с тем же email.

## Проблема

34% пользователей бросают корзину, если их заставляют создавать аккаунт (Baymard исследование). Это топ-1 причина abandonment.

## Решение

Никогда не требуйте аккаунт для покупки. Опционально, не обязательно.

## Плюсы

- Снижает cart abandonment на 20-30%
- Больше конверсия
- Меньше friction

## Минусы

- Нет data для retention
- Нужно offer signup post-purchase

## Когда использовать

- Любой e-commerce
- SaaS trial
- Подписки

## Принципы и гайдлайны

### Never force account creation

**Источник:** `nielsen`

34% of users abandon if forced to create an account (Baymard). Always offer guest checkout. Account creation should be optional post-purchase.

### Offer account creation post-purchase

**Источник:** `material`

After successful guest purchase, offer account creation with prefilled email. Higher conversion than forcing it upfront.

## Конфигурация мокапа

```json
{
  "options": [
    {
      "id": "guest",
      "title": "Купить как гость",
      "desc": "Только email — быстро",
      "recommended": true
    },
    {
      "id": "signup",
      "title": "Создать аккаунт",
      "desc": "Пароль + сохранение данных"
    }
  ]
}
```
