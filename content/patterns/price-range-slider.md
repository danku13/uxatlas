---
slug: price-range-slider
title: Price range slider (dual handle)
category: search-discovery
mockupType: price-range-slider
severity: low
author: Wildberries / Amazon
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
    "min": 0,
    "max": 50000,
    "currentMin": 2500,
    "currentMax": 18000,
    "histogram": [
      12,
      28,
      45,
      67,
      89,
      102,
      78,
      56,
      34,
      18,
      8,
      3
    ]
  }
---

> Слайдер с двумя ручками для выбора диапазона цен — визуально и точно.

## Описание

Слайдер с двумя ручками (min и max). Под слайдером — числовые значения. При перетаскивании — динамическое обновление результатов. Гистограмма распределения цен под слайдером.

## Проблема

Поле ввода min/max цены требует точного значения. Пользователь не знает диапазон цен в каталоге.

## Решение

Слайдер — визуальный и интуитивный. Гистограмма показывает распределение.

## Плюсы

- Визуально интуитивный
- Видно распределение цен
- Быстрый диапазон

## Минусы

- Трудно точно попасть в нужную цену
- Нужна careful touch handling

## Когда использовать

- E-commerce
- Real estate
- Travel
- Любая фильтрация по числу

## Принципы и гайдлайны

### Show histogram under slider

**Источник:** `nielsen`

Show price distribution histogram under slider. Users see where most products are and adjust range accordingly.

### Combine slider with numeric inputs

**Источник:** `material`

Slider for exploration, numeric inputs for precision. Some users want exact price range (e.g. 5000-7000).

## Конфигурация мокапа

```json
{
  "min": 0,
  "max": 50000,
  "currentMin": 2500,
  "currentMax": 18000,
  "histogram": [
    12,
    28,
    45,
    67,
    89,
    102,
    78,
    56,
    34,
    18,
    8,
    3
  ]
}
```
