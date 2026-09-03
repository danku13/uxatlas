---
slug: passwordless-magic-link
title: Passwordless / Magic link auth
category: authentication
mockupType: passwordless-auth
severity: high
author: Stripe / Linear
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
    "step": "email",
    "email": "",
    "otp": [
      "",
      "",
      "",
      "",
      "",
      ""
    ]
  }
---

> Вход без пароля: пользователь вводит email и кликает ссылку. Никакого friction с паролями.

## Описание

Поле только для email → кнопка «Отправить ссылку» → пользователь открывает email и кликает ссылку → аутентифицирован. Альтернатива: OTP-код по SMS или email.

## Проблема

Формы регистрации с паролем имеют конверсию ~25-30% из-за friction: придумать пароль, запомнить, повторить, special character requirements и т.д.

## Решение

Убираем пароль из уравнения полностью — пользователь не может забыть то, чего не существует.

## Плюсы

- Конверсия выше на 20-40%
- Нет проблем с забытыми паролями
- Меньше support-тикетов

## Минусы

- Зависимость от email/SMS-провайдера
- Чуть медленнее при плохой сети

## Когда использовать

- B2C приложения с фокусом на росте
- Когда email — основной канал коммуникации

## Принципы и гайдлайны

### Уменьшайте friction в каждой форме аутентификации

**Источник:** `nielsen`

Каждое дополнительное поле в форме входа уменьшает конверсию. Пароль — это поле + когнитивная нагрузка. Уберите, если можете.

## Конфигурация мокапа

```json
{
  "step": "email",
  "email": "",
  "otp": [
    "",
    "",
    "",
    "",
    "",
    ""
  ]
}
```
