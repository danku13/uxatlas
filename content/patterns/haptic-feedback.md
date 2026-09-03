---
slug: haptic-feedback
title: Haptic feedback on actions
category: notifications-feedback
mockupType: haptic-feedback
severity: low
author: Apple HIG
tags:
  - clarity
  - friction-reduction
  - ios
  - android
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "actions": [
      {
        "id": "like",
        "label": "Лайк",
        "haptic": "soft"
      },
      {
        "id": "success",
        "label": "Успех",
        "haptic": "medium"
      },
      {
        "id": "warning",
        "label": "Внимание",
        "haptic": "rigid"
      },
      {
        "id": "error",
        "label": "Ошибка",
        "haptic": "heavy"
      }
    ]
  }
---

> Тактильная отдача при действиях — лайк, свайп, подтверждение, ошибка.

## Описание

При ключевых действиях — короткая вибрация: лайк (мягкая), завершение (уверенная), ошибка (резкая). Усиляет feeling of control.

## Проблема

Без haptic feedback действия «повисают» — пользователь не уверен, сработало ли. Тапает повторно, создавая дубликаты.

## Решение

Haptic для каждого значимого действия.

## Плюсы

- Подтверждение без визуального shift
- Усиляет feeling of control
- Стандарт на iOS (expected behavior)

## Минусы

- Не все Android-устройства поддерживают
- Может раздражать при избытке

## Когда использовать

- Лайки
- Свайпы
- Подтверждения
- Pull-to-refresh
- Завершение действий

## Принципы и гайдлайны

### Haptic for confirmation, not just visual

**Источник:** `hig`

Use haptics to confirm actions users can't always see (button press at edge of screen, swipe complete). It reinforces feedback.

### Don't overuse haptics

**Источник:** `material`

Haptics should be reserved for meaningful moments. Constant buzzing annoys users and drains battery.

## Конфигурация мокапа

```json
{
  "actions": [
    {
      "id": "like",
      "label": "Лайк",
      "haptic": "soft"
    },
    {
      "id": "success",
      "label": "Успех",
      "haptic": "medium"
    },
    {
      "id": "warning",
      "label": "Внимание",
      "haptic": "rigid"
    },
    {
      "id": "error",
      "label": "Ошибка",
      "haptic": "heavy"
    }
  ]
}
```
