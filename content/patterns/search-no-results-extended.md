---
slug: search-no-results-extended
title: Search no results — extended recovery
category: empty-states
mockupType: search-no-results-extended
severity: high
author: Amazon / Airbnb
tags:
  - high-dropoff
  - clarity
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "query": "зимние кроссовки nike 42",
    "similar": [
      "Зимние кроссовки",
      "Кроссовки Nike",
      "Кроссовки 42 размера"
    ],
    "popularCategories": [
      "Обувь",
      "Спорт",
      "Зимнее"
    ],
    "subscribeCta": "Сообщить, когда появится"
  }
---

> Расширенный empty state поиска: похожие запросы + категории + подписка.

## Описание

Если поиск ничего не нашёл: «Возможно вы искали» (4 похожих запроса), «Популярные категории», кнопка «Сообщить, когда появится» (с email подпиской).

## Проблема

«Ничего не найдено» = конец funnel. Пользователь уходит к конкурентам.

## Решение

Превращаем «нет результатов» в точку входа.

## Плюсы

- Снижает bounce на 25-40%
- Собирает demand-сигналы
- Подписка на появление

## Минусы

- Нужна инфраструктура для похожих запросов

## Когда использовать

- E-commerce
- Контентные приложения
- Marketplace

## Принципы и гайдлайны

### Empty search is a new entry point

**Источник:** `nielsen`

Don't show 'no results' as dead-end. Show similar queries, popular categories, and a way to be notified when the item appears.

## Конфигурация мокапа

```json
{
  "query": "зимние кроссовки nike 42",
  "similar": [
    "Зимние кроссовки",
    "Кроссовки Nike",
    "Кроссовки 42 размера"
  ],
  "popularCategories": [
    "Обувь",
    "Спорт",
    "Зимнее"
  ],
  "subscribeCta": "Сообщить, когда появится"
}
```
