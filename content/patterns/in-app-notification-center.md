---
slug: in-app-notification-center
title: In-app notification center
category: notifications-feedback
mockupType: in-app-notification-center
severity: low
author: Facebook / Instagram
tags:
  - clarity
  - friction-reduction
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "unread": 3,
    "notifications": [
      {
        "type": "order",
        "title": "Заказ #1028 доставлён",
        "time": "5 мин назад",
        "unread": true
      },
      {
        "type": "message",
        "title": "Новое сообщение от поддержки",
        "time": "1 час назад",
        "unread": true
      },
      {
        "type": "promo",
        "title": "Скидка 20% на кроссовки",
        "time": "3 часа назад",
        "unread": true
      },
      {
        "type": "system",
        "title": "Обновление до v2.0",
        "time": "Вчера",
        "unread": false
      }
    ]
  }
---

> Иконка колокольчика с unread badge → dropdown со списком недавних уведомлений.

## Описание

Bell icon в шапке с красным badge непрочитанных. Тап → dropdown с уведомлениями (заказы, сообщения, акции). Mark all as read. Push-уведомления дублируются сюда.

## Проблема

Push-уведомления закрываются и забываются. Пользователь хочет вернуться к ним позже — не может.

## Решение

Все уведомления сохраняются в центре — пользователь может вернуться когда удобно.

## Плюсы

- Уведомления не теряются
- Снижает зависимость от push
- Mark-as-read управление

## Минусы

- Нужна инфраструктура хранения

## Когда использовать

- E-commerce
- Соцсети
- Messenger

## Принципы и гайдлайны

### Persist notifications in-app

**Источник:** `nielsen`

Push notifications are dismissed and lost. Always persist them in an in-app center so users can return to them.

### Mark-as-read and filter

**Источник:** `material`

Let users mark all as read and filter by type. Notification fatigue is real — give controls.

## Конфигурация мокапа

```json
{
  "unread": 3,
  "notifications": [
    {
      "type": "order",
      "title": "Заказ #1028 доставлён",
      "time": "5 мин назад",
      "unread": true
    },
    {
      "type": "message",
      "title": "Новое сообщение от поддержки",
      "time": "1 час назад",
      "unread": true
    },
    {
      "type": "promo",
      "title": "Скидка 20% на кроссовки",
      "time": "3 часа назад",
      "unread": true
    },
    {
      "type": "system",
      "title": "Обновление до v2.0",
      "time": "Вчера",
      "unread": false
    }
  ]
}
```
