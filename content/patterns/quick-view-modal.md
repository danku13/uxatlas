---
slug: quick-view-modal
title: Quick view modal
category: search-discovery
mockupType: quick-view-modal
severity: medium
author: Amazon / ASOS
tags:
  - friction-reduction
  - progressive-disclosure
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "product": {
      "name": "Nike Air Max 2024",
      "price": "8 990 ₽",
      "oldPrice": "11 990 ₽",
      "rating": 4.7,
      "reviewsCount": 234,
      "image": "shoe",
      "variants": [
        "38",
        "39",
        "40",
        "41",
        "42"
      ]
    }
  }
---

> Быстрый просмотр товара без перехода на карточку — модалка с основной инфой.

## Описание

На карточке товара — кнопка «Быстрый просмотр» (или long-press). Открывает модалку с: большое фото, название, цена, рейтинг, 3 варианта, кнопка «В корзину». Без перехода на PDP.

## Проблема

Переход на PDP и обратно для каждого товара = много кликов. Пользователь устаёт листать каталог.

## Решение

Quick view показывает 80% инфы в 1 клик.

## Плюсы

- Снижает catalog browsing friction
- Меньше page transitions
- Higher product discovery rate

## Минусы

- Не подходит для мобильных (мало места)
- Нужна carefully designed modal

## Когда использовать

- E-commerce (desktop)
- Catalogs
- Real estate

## Принципы и гайдлайны

### Quick view for desktop, PDP for mobile

**Источник:** `nielsen`

On mobile, quick view modals feel cramped. Use long-press or dedicated button. On desktop, hover-to-quick-view works well.

### Show 80% of decision info in quick view

**Источник:** `material`

Quick view should have: image, price, rating, variants, add to cart. If user needs more, they go to PDP.

## Конфигурация мокапа

```json
{
  "product": {
    "name": "Nike Air Max 2024",
    "price": "8 990 ₽",
    "oldPrice": "11 990 ₽",
    "rating": 4.7,
    "reviewsCount": 234,
    "image": "shoe",
    "variants": [
      "38",
      "39",
      "40",
      "41",
      "42"
    ]
  }
}
```
