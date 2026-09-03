---
slug: autosave-draft
title: Autosave draft
category: forms-input
mockupType: autosave-draft
severity: medium
author: Google Forms / Notion
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
    "fields": [
      {
        "label": "Имя",
        "value": "Анна Иванова"
      },
      {
        "label": "Email",
        "value": "anna@example.com"
      },
      {
        "label": "Комментарий",
        "value": "Заказ нужно доставить до 18:00"
      }
    ],
    "lastSaved": "2 сек назад"
  }
---

> Длинные формы автоматически сохраняются — пользователь может вернуться позже.

## Описание

При заполнении длинной формы (анкета, заказ, отчёт) — каждые 5 секунд форма сохраняется в localStorage. Если пользователь закрыл вкладку/приложение — при возврате форма восстановлена.

## Проблема

Пользователь заполнил 20 полей, отвлёкся, закрыл вкладку — всё потеряно. В следующий раз не хочет начинать заново.

## Решение

Автосохранение + восстановление при возврате.

## Плюсы

- Снижает abandonment на длинных формах
- Пользователь не боится прерывания
- Чувство надёжности

## Минусы

- Нужно управлять конфликтами версий
- Privacy concerns — что сохраняется

## Когда использовать

- Длинные анкеты
- Многошаговые формы
- Контентные редакторы

## Принципы и гайдлайны

### Save automatically, restore transparently

**Источник:** `nielsen`

Don't ask 'do you want to save?'. Save silently. When user returns, restore silently with a small 'draft restored' notice.

### Show last saved time

**Источник:** `material`

Display 'last saved 5 sec ago' so users know their work is safe. Reduces anxiety on long forms.

## Конфигурация мокапа

```json
{
  "fields": [
    {
      "label": "Имя",
      "value": "Анна Иванова"
    },
    {
      "label": "Email",
      "value": "anna@example.com"
    },
    {
      "label": "Комментарий",
      "value": "Заказ нужно доставить до 18:00"
    }
  ],
  "lastSaved": "2 сек назад"
}
```
