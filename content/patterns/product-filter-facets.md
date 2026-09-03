---
slug: product-filter-facets
title: Product filter facets with counts
category: search-discovery
mockupType: product-filter-facets
severity: high
author: Amazon / Baymard
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
    "facets": [
      {
        "name": "Категория",
        "options": [
          {
            "label": "Кроссовки",
            "count": 231
          },
          {
            "label": "Ботинки",
            "count": 89
          },
          {
            "label": "Сандалии",
            "count": 34
          }
        ]
      },
      {
        "name": "Бренд",
        "options": [
          {
            "label": "Nike",
            "count": 142
          },
          {
            "label": "Adidas",
            "count": 98
          },
          {
            "label": "Puma",
            "count": 45
          }
        ]
      },
      {
        "name": "Размер",
        "options": [
          {
            "label": "40",
            "count": 67
          },
          {
            "label": "41",
            "count": 89
          },
          {
            "label": "42",
            "count": 112
          },
          {
            "label": "43",
            "count": 78
          }
        ]
      }
    ]
  }
---

> Фильтры с предпросмотром количества товаров в каждой опции (Кроссовки [231]).

## Описание

При открытии фильтров — каждая опция показывает количество совпадений. Пользователь видит «Кроссовки (231)» перед выбором — не открывает пустую категорию. Динамическое обновление при изменении других фильтров.

## Проблема

Фильтры без counts заставляют гадать. Пользователь выбирает фильтр → 0 результатов → разочарование → abandon.

## Решение

Faceted search с live counts — пользователь видит результат заранее.

## Плюсы

- Снижает empty results на 60%
- Управляет ожиданиями
- Помогает сузить поиск умно

## Минусы

- Нужен быстрый backend для live counts

## Когда использовать

- E-commerce
- Real estate
- Travel booking
- Любой каталог

## Принципы и гайдлайны

### Show counts next to each facet

**Источник:** `nielsen`

Always show product counts next to each filter option. Users want to know what they'll get before tapping.

### Update counts dynamically

**Источник:** `material`

When user selects a filter, update counts in other facets. Don't show options that would yield 0 results.

## Конфигурация мокапа

```json
{
  "facets": [
    {
      "name": "Категория",
      "options": [
        {
          "label": "Кроссовки",
          "count": 231
        },
        {
          "label": "Ботинки",
          "count": 89
        },
        {
          "label": "Сандалии",
          "count": 34
        }
      ]
    },
    {
      "name": "Бренд",
      "options": [
        {
          "label": "Nike",
          "count": 142
        },
        {
          "label": "Adidas",
          "count": 98
        },
        {
          "label": "Puma",
          "count": 45
        }
      ]
    },
    {
      "name": "Размер",
      "options": [
        {
          "label": "40",
          "count": 67
        },
        {
          "label": "41",
          "count": 89
        },
        {
          "label": "42",
          "count": 112
        },
        {
          "label": "43",
          "count": 78
        }
      ]
    }
  ]
}
```
