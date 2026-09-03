---
slug: variant-selection
title: "Variant selection (color, size)"
category: forms-input
mockupType: variant-selection
severity: medium
author: Apple Store / Nike
tags:
  - high-dropoff
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
    "colors": [
      {
        "name": "Чёрный",
        "hex": "#000000",
        "available": true
      },
      {
        "name": "Белый",
        "hex": "#ffffff",
        "available": true
      },
      {
        "name": "Красный",
        "hex": "#dc2626",
        "available": true
      },
      {
        "name": "Синий",
        "hex": "#2563eb",
        "available": false
      }
    ],
    "sizes": [
      {
        "label": "S",
        "available": true
      },
      {
        "label": "M",
        "available": true
      },
      {
        "label": "L",
        "available": false
      },
      {
        "label": "XL",
        "available": true
      }
    ]
  }
---

> Выбор варианта товара визуальными свотчами: цвет кружком, размер кнопкой.

## Описание

Цвета — кружки с цветной заливкой, выбранный имеет ring. Размеры — квадратные кнопки. При выборе — обновляется цена и availability. Недоступные варианты — disabled.

## Проблема

Выпадающий список вариантов неудобен на мобильном. Пользователь не видит цвета визуально.

## Решение

Visual swatches — цвет кружком, размер кнопкой. Стандарт e-commerce.

## Плюсы

- Визуально интуитивно
- Меньше кликов чем dropdown
- Видна availability сразу

## Минусы

- Сложно при многих вариантах (50+ цветов)

## Когда использовать

- E-commerce карточка товара
- Конфигураторы
- Custom products

## Принципы и гайдлайны

### Visual swatches, not dropdowns

**Источник:** `nielsen`

Use visual swatches for color (circles), size (square buttons). Dropdowns hide options and require extra taps.

### Disable unavailable variants

**Источник:** `material`

Show unavailable variants as disabled (greyed out, not hidden). Users see what's possible and what's not.

## Конфигурация мокапа

```json
{
  "colors": [
    {
      "name": "Чёрный",
      "hex": "#000000",
      "available": true
    },
    {
      "name": "Белый",
      "hex": "#ffffff",
      "available": true
    },
    {
      "name": "Красный",
      "hex": "#dc2626",
      "available": true
    },
    {
      "name": "Синий",
      "hex": "#2563eb",
      "available": false
    }
  ],
  "sizes": [
    {
      "label": "S",
      "available": true
    },
    {
      "label": "M",
      "available": true
    },
    {
      "label": "L",
      "available": false
    },
    {
      "label": "XL",
      "available": true
    }
  ]
}
```
