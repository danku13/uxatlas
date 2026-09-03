---
slug: sort-dropdown
title: "Sort dropdown (relevance, price, rating)"
category: search-discovery
mockupType: sort-dropdown
severity: low
author: Amazon / Wildberries
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
    "options": [
      {
        "id": "popular",
        "label": "По популярности"
      },
      {
        "id": "price-asc",
        "label": "Сначала дешёвые"
      },
      {
        "id": "price-desc",
        "label": "Сначала дорогие"
      },
      {
        "id": "new",
        "label": "Новинки"
      },
      {
        "id": "rating",
        "label": "По рейтингу"
      }
    ],
    "current": "popular"
  }
---

> Выпадающий список сортировки: популярные, цена↑/↓, новинки, рейтинг.

## Описание

Sort dropdown с 5 стандартными опциями. Текущая сортировка показана в кнопке. При изменении — мгновенное обновление списка без перезагрузки.

## Проблема

Без сортировки пользователь листает случайный порядок — не находит лучшее. Закрывает приложение.

## Решение

5 стандартных сортировок — covers 95% use cases.

## Плюсы

- Стандартный паттерн
- Мгновенное обновление
- Управляет порядком просмотра

## Минусы

- Нужна backend поддержка всех sort orders

## Когда использовать

- E-commerce каталоги
- Списки отзывов
- Поисковые результаты

## Принципы и гайдлайны

### 5 standard sort options

**Источник:** `nielsen`

Popular, price asc/desc, newest, rating. Covers 95% of user needs. Don't add more — choice paralysis.

### Show current sort visibly

**Источник:** `material`

Current sort should be visible in the sort button, not hidden. Users forget what they set.

## Конфигурация мокапа

```json
{
  "options": [
    {
      "id": "popular",
      "label": "По популярности"
    },
    {
      "id": "price-asc",
      "label": "Сначала дешёвые"
    },
    {
      "id": "price-desc",
      "label": "Сначала дорогие"
    },
    {
      "id": "new",
      "label": "Новинки"
    },
    {
      "id": "rating",
      "label": "По рейтингу"
    }
  ],
  "current": "popular"
}
```
