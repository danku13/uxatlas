---
slug: smart-input-masks
title: "Smart input masks (phone, card)"
category: forms-input
mockupType: smart-input-masks
severity: medium
author: Stripe / Tinkoff
tags:
  - error-prone
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
        "type": "phone",
        "label": "Телефон",
        "placeholder": "+7 (___) ___-__-__"
      },
      {
        "type": "card",
        "label": "Номер карты",
        "placeholder": "____ ____ ____ ____"
      },
      {
        "type": "date",
        "label": "Срок действия",
        "placeholder": "ММ/ГГ"
      }
    ]
  }
---

> Автоформатирование ввода по маске: телефон +7 (XXX) XXX-XX-XX, карта XXXX XXXX XXXX XXXX.

## Описание

По мере ввода текст автоматически форматируется. Пользователь не думает про скобки и пробелы. Копирование-вставка тоже корректно парсится.

## Проблема

Ввод телефона/карты сплошным текстом ('+79161234567') — трудно проверить, легко ошибиться.

## Решение

Маска форматирует по мере ввода — легко читать и проверять.

## Плюсы

- Меньше ошибок ввода
- Легче проверить визуально
- Поддержка paste

## Минусы

- Нужна аккуратная реализация paste

## Когда использовать

- Формы оплаты
- Регистрация по телефону
- Профиль пользователя

## Принципы и гайдлайны

### Format as user types

**Источник:** `nielsen`

Apply masks live as the user types. Don't wait for blur — by then the user has already moved on.

### Handle paste correctly

**Источник:** `material`

When user pastes, strip non-digits and re-apply mask. Don't break pasted input.

## Конфигурация мокапа

```json
{
  "fields": [
    {
      "type": "phone",
      "label": "Телефон",
      "placeholder": "+7 (___) ___-__-__"
    },
    {
      "type": "card",
      "label": "Номер карты",
      "placeholder": "____ ____ ____ ____"
    },
    {
      "type": "date",
      "label": "Срок действия",
      "placeholder": "ММ/ГГ"
    }
  ]
}
```
