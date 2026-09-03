---
slug: permission-status-dashboard
title: Permission status dashboard
category: settings-permissions
mockupType: permission-status-dashboard
severity: medium
author: iOS Settings / WhatsApp
tags:
  - clarity
  - complexity
  - error-prone
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "permissions": [
      {
        "name": "Геолокация",
        "status": "granted",
        "icon": "MapPin"
      },
      {
        "name": "Камера",
        "status": "denied",
        "icon": "Camera"
      },
      {
        "name": "Push-уведомления",
        "status": "granted",
        "icon": "Bell"
      },
      {
        "name": "Контакты",
        "status": "not-determined",
        "icon": "Users"
      },
      {
        "name": "Микрофон",
        "status": "denied",
        "icon": "Mic"
      }
    ]
  }
---

> Один экран со статусом всех разрешений: granted/denied + быстрый переход к настройкам.

## Описание

Список всех разрешений (Камера, Геолокация, Push, Контакты, Микрофон) с цветным статусом. Tap на denied → направляет в системные настройки.

## Проблема

Пользователь не помнит какие разрешения выдал. Когда функция не работает — не понимает, что нужно разрешение.

## Решение

Один экран показывает всё. Легко понять что не хватает и быстро перейти к настройкам.

## Плюсы

- Прозрачность разрешений
- Лёгкое восстановление доступа
- Снижает support-тикеты

## Минусы

- Нужна интеграция с системным API

## Когда использовать

- Приложения с многими разрешениями
- Banking
- Соцсети

## Принципы и гайдлайны

### Show all permissions in one place

**Источник:** `hig`

Don't make users hunt through system settings. Show all your app's permissions with status in one screen.

### Direct link to system settings

**Источник:** `nielsen`

When a permission is denied, link directly to the system settings page for that permission. Don't make users search.

## Конфигурация мокапа

```json
{
  "permissions": [
    {
      "name": "Геолокация",
      "status": "granted",
      "icon": "MapPin"
    },
    {
      "name": "Камера",
      "status": "denied",
      "icon": "Camera"
    },
    {
      "name": "Push-уведомления",
      "status": "granted",
      "icon": "Bell"
    },
    {
      "name": "Контакты",
      "status": "not-determined",
      "icon": "Users"
    },
    {
      "name": "Микрофон",
      "status": "denied",
      "icon": "Mic"
    }
  ]
}
```
