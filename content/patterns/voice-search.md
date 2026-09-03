---
slug: voice-search
title: Voice search
category: search-discovery
mockupType: voice-search
severity: low
author: Apple Siri / Google Assistant
tags:
  - friction-reduction
  - clarity
  - ios
  - android
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "placeholder": "Скажите что искать...",
    "exampleQuery": "красные кроссовки 42 размера"
  }
---

> Голосовой ввод запроса — иконка микрофона в search bar.

## Описание

Иконка микрофона в search bar. Тап → системный voice input → распознанный текст вставляется в search → результаты. Полезно на ходу, в машине, при длинных запросах.

## Проблема

Печатать на мобильном сложно — длинные запросы раздражают. На ходу или за рулём печатать невозможно.

## Решение

Voice input — говорим запрос, получаем результаты.

## Плюсы

- Удобно на ходу
- Поддерживает естественные запросы
- Доступность для людей с моторными ограничениями

## Минусы

- Шумная среда мешает
- Не всегда точно распознаёт
- Нужен fallback на текст

## Когда использовать

- E-commerce
- Карты и навигация
- Музыка
- Заметки

## Принципы и гайдлайны

### Voice input button next to search

**Источник:** `hig`

Place voice input icon inside or next to the search bar. Discoverable, not hidden in a menu.

### Always allow text edit after voice

**Источник:** `material`

Voice recognition isn't perfect. Always let users edit the transcribed text before search.

## Конфигурация мокапа

```json
{
  "placeholder": "Скажите что искать...",
  "exampleQuery": "красные кроссовки 42 размера"
}
```
