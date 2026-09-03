---
slug: swipe-to-delete-undo
title: Swipe-to-delete with undo
category: notifications-feedback
mockupType: swipe-to-delete-undo
severity: medium
author: Gmail / Apple Mail
tags:
  - error-prone
  - friction-reduction
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "items": [
      {
        "id": 1,
        "title": "Заказ #1028",
        "subtitle": "Доставлен"
      },
      {
        "id": 2,
        "title": "Заказ #1025",
        "subtitle": "В пути"
      },
      {
        "id": 3,
        "title": "Заказ #1020",
        "subtitle": "Отменён"
      }
    ],
    "undoWindow": 5
  }
---

> Свайп влево для удаления + snackbar с undo в течение 5 секунд.

## Описание

Свайп элемента списка влево → удаляется с анимацией → snackbar снизу «Удалено. Отменить» (5 сек). Если не тапнул — окончательно удалено.

## Проблема

Случайные свайпы удаляют элементы без восстановления. Пользователь не может вернуть данные.

## Решение

Undo в течение 5 сек — стандарт iOS/Android для swipe-to-delete.

## Плюсы

- Знакомый паттерн
- Восстановление без модалок
- Меньше friction чем подтверждение

## Минусы

- Undo окно короткое
- После 5 сек — безвозвратно

## Когда использовать

- Списки писем
- Задачи
- Избранное
- Корзина

## Принципы и гайдлайны

### Always provide undo for swipe-delete

**Источник:** `nielsen`

Swipe-to-delete is fast but error-prone. Always provide undo via snackbar for 5-10 seconds. Eliminates need for confirmation dialogs.

### Destructive swipe is red

**Источник:** `material`

When swiping to reveal delete action, show red background with trash icon. Visual cue that action is destructive.

## Конфигурация мокапа

```json
{
  "items": [
    {
      "id": 1,
      "title": "Заказ #1028",
      "subtitle": "Доставлен"
    },
    {
      "id": 2,
      "title": "Заказ #1025",
      "subtitle": "В пути"
    },
    {
      "id": 3,
      "title": "Заказ #1020",
      "subtitle": "Отменён"
    }
  ],
  "undoWindow": 5
}
```
