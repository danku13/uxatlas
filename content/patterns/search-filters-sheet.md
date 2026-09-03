---
slug: search-filters-sheet
title: Search filters as bottom sheet
category: search-discovery
mockupType: search-filters-sheet
severity: medium
author: Airbnb / Wildberries
tags:
  - high-dropoff
  - clarity
  - progressive-disclosure
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "quickFilters": [
      "Под заказ",
      "Со скидкой",
      "Новинки",
      "Топ"
    ],
    "activeFilter": "Со скидкой",
    "fullFilters": [
      {
        "name": "Категория",
        "options": [
          "Электроника",
          "Одежда",
          "Дом"
        ]
      },
      {
        "name": "Цена",
        "options": [
          "До 1000 ₽",
          "1000–5000 ₽",
          "5000+ ₽"
        ]
      }
    ]
  }
---

> Быстрые фильтры-чипсы наверху, полный набор — в bottom sheet по тапу.

## Описание

Под поиском — горизонтальный скролл с быстрыми фильтрами (Цена, Рейтинг). Тап на «Все фильтры» → bottom sheet с полным набором (категории, бренды, радиус, наличие).

## Проблема

Скрытые фильтры уменьшают discovery. Полная страница фильтров слишком тяжёлая для быстрого уточнения.

## Решение

Гибрид — быстрые чипсы для частых фильтров + bottom sheet для редких.

## Плюсы

- Быстрый доступ к popular фильтрам
- Полные фильтры всегда доступны
- Bottom sheet не блокирует контекст

## Минусы

- Нужно знать какие фильтры — popular

## Когда использовать

- E-commerce
- Real estate
- Любые приложения с большим каталогом

## Принципы и гайдлайны

### Surface common filters, hide rare ones

**Источник:** `nielsen`

Put the 3-4 most-used filters as quick chips. Less common filters go into a bottom sheet. Don't show all 20 filters upfront.

### Bottom sheet preserves context

**Источник:** `material`

Use bottom sheets for filters so users can still see results above. Don't navigate to a separate filter page.

## Конфигурация мокапа

```json
{
  "quickFilters": [
    "Под заказ",
    "Со скидкой",
    "Новинки",
    "Топ"
  ],
  "activeFilter": "Со скидкой",
  "fullFilters": [
    {
      "name": "Категория",
      "options": [
        "Электроника",
        "Одежда",
        "Дом"
      ]
    },
    {
      "name": "Цена",
      "options": [
        "До 1000 ₽",
        "1000–5000 ₽",
        "5000+ ₽"
      ]
    }
  ]
}
```
