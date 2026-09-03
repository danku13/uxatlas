---
slug: session-expired-recovery
title: Session expired recovery
category: errors-recovery
mockupType: session-expired-recovery
severity: medium
author: Banking apps
tags:
  - high-dropoff
  - friction-reduction
  - error-prone
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "message": "Сессия истекла по безопасности",
    "subMessage": "Ваши данные сохранены. Войдите снова, чтобы продолжить.",
    "quickAuth": "Face ID"
  }
---

> При истечении сессии — понятное сообщение и кнопка быстрого восстановления.

## Описание

Сессия истекла → показываем inline баннер (не модалку): «Сессия истекла. Войдите снова, чтобы продолжить». Кнопка «Войти через Face ID» — 1 тап, без форм.

## Проблема

Generic «Session expired» модалки пугают — пользователь думает что данные потеряны. Длинный re-login flow = abandon.

## Решение

Inline баннер + быстрый re-auth через биометрию.

## Плюсы

- Минимальная friction при восстановлении
- Пользователь не теряет контекст
- Биометрия = 1 тап

## Минусы

- Нужен secure token management

## Когда использовать

- Banking
- Приложения с чувствительными данными
- SaaS

## Принципы и гайдлайны

### Don't lose user's context

**Источник:** `nielsen`

When session expires, preserve user's in-progress work. After re-auth, return them to exactly where they were.

### Quick re-auth via biometrics

**Источник:** `hig`

Use biometrics for session re-authentication. Don't force full password entry for routine expirations.

## Конфигурация мокапа

```json
{
  "message": "Сессия истекла по безопасности",
  "subMessage": "Ваши данные сохранены. Войдите снова, чтобы продолжить.",
  "quickAuth": "Face ID"
}
```
