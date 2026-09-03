---
slug: express-checkout
title: Express checkout (Apple/Google Pay)
category: checkout-payment
mockupType: express-checkout
severity: high
author: Shopify / Stripe
tags:
  - high-dropoff
  - friction-reduction
  - ios
  - android
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "items": [
      {
        "name": "Кроссовки Nike Air",
        "price": "8 990 ₽"
      },
      {
        "name": "Носки sport x3",
        "price": "690 ₽"
      }
    ],
    "total": "9 680 ₽"
  }
---

> Кнопка «Оплатить в 1 клик» без ввода данных карты и адреса — всё уже есть у системы.

## Описание

На экране корзины сверху — Apple Pay / Google Pay кнопка. Тап → системнаяbottom sheet с подтверждением → оплата. Никаких форм, никакого ввода.

## Проблема

Checkout с ручным вводом карты имеет abandonment ~70%. Основная причина — слишком много шагов и страх ввода данных карты.

## Решение

Делегируем всю friction операционной системе через Apple/Google Pay.

## Плюсы

- Конверсия выше на 30-50%
- Нет PCI-ответственности
- Безопаснее

## Минусы

- Не все карты поддерживаются
- Нужен merchant account

## Когда использовать

- E-commerce
- Подписки
- Любые in-app платежи

## Принципы и гайдлайны

### Express checkout должен быть на самом видном месте

**Источник:** `nielsen`

Apple Pay / Google Pay кнопка должна быть выше формы ручного ввода. Большинство пользователей выберут express, если он виден.

## Конфигурация мокапа

```json
{
  "items": [
    {
      "name": "Кроссовки Nike Air",
      "price": "8 990 ₽"
    },
    {
      "name": "Носки sport x3",
      "price": "690 ₽"
    }
  ],
  "total": "9 680 ₽"
}
```
