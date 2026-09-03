---
slug: account-deletion-flow
title: Account deletion flow with grace period
category: settings-permissions
mockupType: account-deletion-flow
severity: medium
author: Apple App Store / GDPR
tags:
  - high-dropoff
  - error-prone
  - clarity
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "stages": [
      {
        "title": "Запрос удаления",
        "desc": "Подтвердите намерение"
      },
      {
        "title": "Grace period 30 дней",
        "desc": "Аккаунт деактивирован"
      },
      {
        "title": "Окончательное удаление",
        "desc": "Через 30 дней"
      }
    ],
    "gracePeriodDays": 30
  }
---

> Удаление аккаунта с 30-дневным grace period — можно восстановить в любой момент.

## Описание

Запрос удаления → объяснение последствий → выбор причины (опционально) → подтверждение → аккаунт деактивирован 30 дней (можно восстановить) → окончательное удаление.

## Проблема

Apple App Store требует возможность удаления аккаунта с 2022. Без grace period — пользовательские данные теряются навсегда при случайном удалении.

## Решение

30-дневный grace period + email уведомления о восстановлении.

## Плюсы

- Соответствует App Store Review Guideline 5.1.1
- Снижает страх удаления
- Восстановление в течение 30 дней

## Минусы

- Нужна инфраструктура для grace period
- GDPR compliance

## Когда использовать

- Любое приложение с аккаунтами (Apple App Store requirement)

## Принципы и гайдлайны

### Account deletion is mandatory (App Store)

**Источник:** `hig`

Apple App Store requires account deletion option since 2022. Apps without it risk rejection. Also required by GDPR.

### Provide grace period for recovery

**Источник:** `nielsen`

Don't delete immediately. 30-day grace period lets users recover from impulse decisions. Send email reminders.

## Конфигурация мокапа

```json
{
  "stages": [
    {
      "title": "Запрос удаления",
      "desc": "Подтвердите намерение"
    },
    {
      "title": "Grace period 30 дней",
      "desc": "Аккаунт деактивирован"
    },
    {
      "title": "Окончательное удаление",
      "desc": "Через 30 дней"
    }
  ],
  "gracePeriodDays": 30
}
```
