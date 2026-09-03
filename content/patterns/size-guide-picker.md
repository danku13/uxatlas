---
slug: size-guide-picker
title: Size guide with measurements
category: forms-input
mockupType: size-guide-picker
severity: high
author: ASOS / Zara
tags:
  - high-dropoff
  - error-prone
  - clarity
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "sizes": [
      {
        "size": "S",
        "chest": "86-90",
        "waist": "70-74"
      },
      {
        "size": "M",
        "chest": "90-94",
        "waist": "74-78"
      },
      {
        "size": "L",
        "chest": "94-98",
        "waist": "78-82"
      },
      {
        "size": "XL",
        "chest": "98-102",
        "waist": "82-86"
      }
    ],
    "unit": "cm",
    "helper": {
      "height": "175",
      "weight": "70",
      "recommended": "M"
    }
  }
---

> Таблица размеров с измерениями + помощник подбора по росту/весу.

## Описание

Кнопка «Таблица размеров» открывает bottom sheet с: таблицей (S/M/L/XL + обхват груди/талии/бёдер), переключателем единиц (см/дюймы), помощником «введите рост/вес» → рекомендуемый размер.

## Проблема

Разные бренды = разные размеры. S в Nike ≠ S в Zara. Без size guide 30% возвратов из-за неправильного размера.

## Решение

Таблица + помощник подбора по параметрам тела.

## Плюсы

- Снижает возвраты на 25-40%
- Повышает confidence при покупке
- Стандарт для fashion e-commerce

## Минусы

- Нужна база измерений per brand

## Когда использовать

- Fashion e-commerce
- Обувь
- Школьная форма
- Спортивная экипировка

## Принципы и гайдлайны

### Always provide size guide for clothing

**Источник:** `nielsen`

Size guide is mandatory for fashion e-commerce. Without it, 30%+ returns due to wrong size. Show measurements, not just S/M/L.

### Size calculator by body measurements

**Источник:** `material`

Provide a calculator where user enters height/weight and gets recommended size. Reduces returns by 25-40%.

## Конфигурация мокапа

```json
{
  "sizes": [
    {
      "size": "S",
      "chest": "86-90",
      "waist": "70-74"
    },
    {
      "size": "M",
      "chest": "90-94",
      "waist": "74-78"
    },
    {
      "size": "L",
      "chest": "94-98",
      "waist": "78-82"
    },
    {
      "size": "XL",
      "chest": "98-102",
      "waist": "82-86"
    }
  ],
  "unit": "cm",
  "helper": {
    "height": "175",
    "weight": "70",
    "recommended": "M"
  }
}
```
