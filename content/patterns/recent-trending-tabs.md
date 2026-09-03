---
slug: recent-trending-tabs
title: Recent + Trending tabs in search
category: search-discovery
mockupType: recent-trending-tabs
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
    "recent": [
      "Кроссовки Nike",
      "iPhone 15",
      "Кофемашина"
    ],
    "trending": [
      "Зимние куртки",
      "AirPods Pro 2",
      "Игрушки для детей",
      "Умные часы"
    ]
  }
---

> В пустом поиске — 2 таба: Недавние запросы и Популярные сейчас.

## Описание

При тапе на search bar без ввода — экран с двумя табами: «Недавние» (история запросов пользователя) и «В тренде» (популярные запросы прямо сейчас).

## Проблема

Пустой search вводит в ступор. Пользователь не знает что искать. 30% закрывают на этом этапе.

## Решение

Предлагаем готовые варианты — недавние и популярные.

## Плюсы

- Снижает friction в начале поиска
- Обучает формату запросов
- Персонализация через историю

## Минусы

- Нужна инфраструктура trending queries

## Когда использовать

- E-commerce
- Контентные приложения
- Соцсети

## Принципы и гайдлайны

### Surface trending and recent in empty search

**Источник:** `nielsen`

Don't show a blank search box. Suggest recent queries and trending searches to reduce friction.

## Конфигурация мокапа

```json
{
  "recent": [
    "Кроссовки Nike",
    "iPhone 15",
    "Кофемашина"
  ],
  "trending": [
    "Зимние куртки",
    "AirPods Pro 2",
    "Игрушки для детей",
    "Умные часы"
  ]
}
```
