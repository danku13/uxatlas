---
slug: biometric-auth
title: Biometric authentication (Face ID)
category: authentication
mockupType: biometric-auth
severity: medium
author: Banking apps
tags:
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
    "appName": "UX Bank",
    "lastLogin": "Последний вход 2 часа назад"
  }
---

> Вход через Face ID / Touch ID — мгновенная аутентификация без ввода пароля.

## Описание

При повторном входе — системный промпт Face ID с автоматическим распознаванием. Если биометрия недоступна — fallback на пароль или пин-код.

## Проблема

Повторный ввод пароля каждый раз при открытии приложения раздражает и снижает retention.

## Решение

Биометрия — мгновенный вход, не требует памяти и не вызывает фрустрацию.

## Плюсы

- Вход за <1 секунды
- Не нужно помнить пароль
- Безопаснее пароля

## Минусы

- Не все устройства поддерживают
- Биометрия может не сработать (мокрые руки, маска)

## Когда использовать

- Banking
- Приложения с чувствительными данными
- Любое приложение с частым возвратом

## Принципы и гайдлайны

### Always provide fallback

**Источник:** `hig`

Biometrics can fail (wet fingers, mask, etc). Always provide a fallback to passcode, never lock the user out.

### Biometrics for re-auth, not first login

**Источник:** `nielsen`

First login still requires password to establish trust. Use biometrics for subsequent re-authentications.

## Конфигурация мокапа

```json
{
  "appName": "UX Bank",
  "lastLogin": "Последний вход 2 часа назад"
}
```
