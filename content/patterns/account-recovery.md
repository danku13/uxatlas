---
slug: account-recovery
title: Account recovery flow
category: authentication
mockupType: account-recovery
severity: high
author: Google / GitHub
tags:
  - high-dropoff
  - friction-reduction
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "methods": [
      {
        "id": "email",
        "label": "Email",
        "value": "anna@example.com"
      },
      {
        "id": "sms",
        "label": "SMS",
        "value": "+7 (916) ••• 45-67"
      }
    ]
  }
---

> Понятный flow восстановления доступа: выбор метода (email/SMS/backup), подтверждение, новый пароль.

## Описание

«Забыли пароль?» → выбор метода восстановления (email или SMS) → ввод кода → новый пароль с inline validation. Никаких_CAPTCHA и секретных вопросов.

## Проблема

50% пользователей не могут восстановить пароль с первой попытки. Сложные recovery flows = потерянные аккаунты = churn.

## Решение

Простой 3-шаговый flow с выбором метода и inline feedback.

## Плюсы

- Снижает support-тикеты на 40%
- Восстанавливает аккаунт за 30 секунд
- Гибкий выбор метода

## Минусы

- Нужен secure канал восстановления
- SMS уязвим к SIM-swap

## Когда использовать

- Любое приложение с аккаунтами
- Banking
- SaaS

## Принципы и гайдлайны

### Recovery should match signup method

**Источник:** `nielsen`

If signup was via email, recovery should prefer email. Don't force SMS if user never gave their phone.

### No CAPTCHA in recovery

**Источник:** `nielsen`

CAPTCHA in recovery flow spikes abandonment. Use risk-based signals instead (device, location, behavior).

## Конфигурация мокапа

```json
{
  "methods": [
    {
      "id": "email",
      "label": "Email",
      "value": "anna@example.com"
    },
    {
      "id": "sms",
      "label": "SMS",
      "value": "+7 (916) ••• 45-67"
    }
  ]
}
```
