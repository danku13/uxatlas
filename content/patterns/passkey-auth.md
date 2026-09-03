---
slug: passkey-auth
title: Passkey / WebAuthn authentication
category: authentication
mockupType: passkey-auth
severity: medium
author: Apple / Google
tags:
  - friction-reduction
  - ios
  - android
  - error-prone
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "appName": "UX Shop",
    "lastLogin": "Последний вход вчера"
  }
---

> Вход через passkey — безпарольная аутентификация с криптографией устройства. Безопаснее пароля, удобнее.

## Описание

Passkey хранится в Apple Keychain / Google Password Manager. Вход — одно касание Face ID/Touch ID. Нет пароля = нет фишинга = нет утечек.

## Проблема

Пароли — главная причина account takeover. 80% нарушений связаны со слабыми/украденными паролями. Пользователи их забывают и не могут войти.

## Решение

Passkey заменяет пароль криптографической парой. Пользователь не вводит ничего — аутентификация через биометрию устройства.

## Плюсы

- Нет фишинга (passkey привязан к домену)
- Нет утечек (нет базы паролей)
- Вход за 1 секунду
- Синхронизируется между устройствами

## Минусы

- Не все платформы поддерживают
- Нужен fallback

## Когда использовать

- Banking
- E-commerce
- Любое приложение с аккаунтами

## Принципы и гайдлайны

### Offer passkey as default option

**Источник:** `hig`

Passkeys are more secure and convenient than passwords. Offer them as the primary authentication method when available.

### Always provide password fallback

**Источник:** `nielsen`

Not all users/devices support passkeys yet. Always provide password fallback to avoid lockout.

## Конфигурация мокапа

```json
{
  "appName": "UX Shop",
  "lastLogin": "Последний вход вчера"
}
```
