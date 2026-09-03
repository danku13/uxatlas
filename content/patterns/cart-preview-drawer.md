---
slug: cart-preview-drawer
title: Cart preview drawer (slide-in)
category: checkout-payment
mockupType: cart-preview-drawer
severity: medium
author: Amazon / Shopify
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
    "items": [
      {
        "name": "Nike Air Max 2024",
        "variant": "42, Чёрный",
        "qty": 1,
        "price": "8 990 ₽"
      },
      {
        "name": "Носки sport x3",
        "variant": "Размер M",
        "qty": 2,
        "price": "1 380 ₽"
      }
    ],
    "subtotal": "10 370 ₽",
    "delivery": "Бесплатно",
    "total": "10 370 ₽"
  }
---

> Drawer справа с превью корзины — список товаров, сумма, кнопка checkout.

## Описание

При тапе на иконку корзины — справа выезжает drawer на 350px. Содержит: список товаров (с количеством и возможностью изменить), subtotal, доставка, total, кнопка «Оформить». Без перехода на cart page.

## Проблема

Переход на cart page для проверки = friction. Пользователь не хочет покидать каталог ради проверки корзины.

## Решение

Drawer — быстрый preview без потери контекста каталога.

## Плюсы

- Сохраняет контекст пользователя
- Быстрый доступ к корзине
- Меньше page transitions

## Минусы

- Не подходит для мобильных (мало места)

## Когда использовать

- E-commerce desktop
- SaaS с cart
- Food delivery

## Принципы и гайдлайны

### Drawer for desktop, page for mobile

**Источник:** `nielsen`

Cart drawer works on desktop. On mobile, full cart page is better — drawer is too narrow for product list.

### Editable quantities in drawer

**Источник:** `material`

Let users edit quantities and remove items directly from drawer. Don't force them to checkout to change cart.

## Конфигурация мокапа

```json
{
  "items": [
    {
      "name": "Nike Air Max 2024",
      "variant": "42, Чёрный",
      "qty": 1,
      "price": "8 990 ₽"
    },
    {
      "name": "Носки sport x3",
      "variant": "Размер M",
      "qty": 2,
      "price": "1 380 ₽"
    }
  ],
  "subtotal": "10 370 ₽",
  "delivery": "Бесплатно",
  "total": "10 370 ₽"
}
```
