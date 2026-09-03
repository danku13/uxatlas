---
slug: blur-up-image-loading
title: Blur-up image loading
category: loading-waiting
mockupType: blur-up-image-loading
severity: medium
author: Medium / Cloudinary
tags:
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
    "images": [
      {
        "id": 1,
        "color": "#9f1239",
        "loaded": true
      },
      {
        "id": 2,
        "color": "#0891b2",
        "loaded": false
      },
      {
        "id": 3,
        "color": "#65a30d",
        "loaded": true
      }
    ]
  }
---

> Сначала размытое превью, потом чёткое изображение — воспринимается мгновенно.

## Описание

Загружаем tiny placeholder (10x10 px, ~200 байт) → растягиваем с blur → когда загрузится полное, плавно убираем blur. Эффект: мгновенная загрузка изображений.

## Проблема

Пустые места при загрузке изображений (особенно в лентах) воспринимаются как «приложение тормозит».

## Решение

Blur-up показывает структуру мгновенно, деталь появляется плавно.

## Плюсы

- Снижает perceived loading time на 50%+
- Меньше layout shift
- Профессиональный вид

## Минусы

- Нужен backend для генерации tiny placeholders

## Когда использовать

- Ленты изображений
- E-commerce каталоги
- Галереи
- Карточки товаров

## Принципы и гайдлайны

### Blur-up for perceived speed

**Источник:** `nielsen`

Show a tiny blurred placeholder while the full image loads. Users perceive it as faster than a blank space or spinner.

### LQIP should be tiny (<1KB)

**Источник:** `material`

Low Quality Image Placeholder should be 10-20px wide, under 1KB. Larger defeats the purpose.

## Конфигурация мокапа

```json
{
  "images": [
    {
      "id": 1,
      "color": "#9f1239",
      "loaded": true
    },
    {
      "id": 2,
      "color": "#0891b2",
      "loaded": false
    },
    {
      "id": 3,
      "color": "#65a30d",
      "loaded": true
    }
  ]
}
```
