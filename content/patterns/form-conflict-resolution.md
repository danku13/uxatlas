---
slug: form-conflict-resolution
title: Form conflict resolution (optimistic locking)
category: errors-recovery
mockupType: form-conflict-resolution
severity: low
author: Notion / Linear
tags:
  - error-prone
  - complexity
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "conflicts": [
      {
        "field": "Сумма",
        "yours": "9 680 ₽",
        "theirs": "9 980 ₽"
      },
      {
        "field": "Адрес",
        "yours": "Тверская 12",
        "theirs": "Тверская 14"
      }
    ]
  }
---

> При одновременном редактировании — показываем конфликт и предлагаем слияние.

## Описание

Пользователь A редактирует форму, пока пользователь B сохраняет изменения. При сохранении A — показываем diff: «B изменил эти поля. Сохранить вашу версию, версию B, или слить?»

## Проблема

При одновременном редактировании последний сохраняет выигрывает — данные теряются. Пользователь не понимает, почему его изменения исчезли.

## Решение

Optimistic locking + diff view при конфликте.

## Плюсы

- Нет потери данных
- Прозрачность
- Командная работа

## Минусы

- Сложно реализовать
- Нужна инфраструктура версионирования

## Когда использовать

- B2B SaaS с командным редактированием
- Документы
- CRM

## Принципы и гайдлайны

### Detect conflicts, don't overwrite silently

**Источник:** `nielsen`

Use optimistic locking. When two users edit the same record, show the conflict and let them choose, don't silently overwrite.

### Show diff, offer merge

**Источник:** `material`

Show what each user changed. Offer 'keep mine', 'keep theirs', 'merge' options. Don't force all-or-nothing.

## Конфигурация мокапа

```json
{
  "conflicts": [
    {
      "field": "Сумма",
      "yours": "9 680 ₽",
      "theirs": "9 980 ₽"
    },
    {
      "field": "Адрес",
      "yours": "Тверская 12",
      "theirs": "Тверская 14"
    }
  ]
}
```
