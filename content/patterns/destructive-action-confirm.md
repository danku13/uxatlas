---
slug: destructive-action-confirm
title: Destructive action confirmation
category: notifications-feedback
mockupType: destructive-action-confirm
severity: high
author: Apple HIG / Material Design
tags:
  - error-prone
  - high-dropoff
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "icon": "Trash2",
    "title": "Удалить аккаунт?",
    "consequences": [
      "Все ваши данные будут удалены",
      "Подписки отменены",
      "Восстановление невозможно"
    ],
    "confirmLabel": "Удалить",
    "cancelLabel": "Отмена"
  }
---

> Подтверждение для необратимых действий (удалить, очистить) с явным объяснением.

## Описание

При попытке удалить → модалка: красная иконка, «Удалить аккаунт?», перечисление что будет потеряно, кнопка «Удалить» (красная, disabled 3 сек), кнопка «Отмена» (по умолчанию).

## Проблема

Случайные удаления — главный source of data loss. Без подтверждения пользователь теряет данные в 1 тап.

## Решение

Подтверждение + объяснение последствий + delayed destructive button.

## Плюсы

- Защита от случайных действий
- Прозрачность последствий
- Снижает support-тикеты

## Минусы

- Может раздражать при частом подтверждении
- Нужно балансировать с friction

## Когда использовать

- Удаление аккаунта
- Очистка корзины
- Удаление документов
- Cancel subscription

## Принципы и гайдлайны

### Confirm destructive, not routine

**Источник:** `nielsen`

Confirm only irreversible destructive actions (delete account, clear all data). Routine deletes (one item) don't need confirmation.

### Default to cancel, delay confirm

**Источник:** `hig`

Default button should be Cancel. Destructive button should be visually distinct (red) and ideally delayed 3 sec to prevent reflex taps.

## Конфигурация мокапа

```json
{
  "icon": "Trash2",
  "title": "Удалить аккаунт?",
  "consequences": [
    "Все ваши данные будут удалены",
    "Подписки отменены",
    "Восстановление невозможно"
  ],
  "confirmLabel": "Удалить",
  "cancelLabel": "Отмена"
}
```
