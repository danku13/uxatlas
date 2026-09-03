---
slug: smart-defaults-autofill
title: "Smart defaults & autofill"
category: forms-input
mockupType: autofill-form
severity: medium
author: Apple Pay / Google Pay
tags:
  - friction-reduction
  - error-prone
  - ios
  - android
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "fields": [
      {
        "label": "Имя на карте",
        "value": "ANNA IVANOVA",
        "autofill": true
      },
      {
        "label": "Номер карты",
        "value": "4242 4242 4242 4242",
        "autofill": true
      },
      {
        "label": "Срок",
        "value": "12/27",
        "autofill": true
      },
      {
        "label": "CVC",
        "value": "•••",
        "autofill": false
      }
    ]
  }
---

> Предзаполняем поля значениями по умолчанию и используем системный autofill для адреса и карты.

## Описание

Где возможно — подставляем значения по умолчанию (страна, валюта, формат даты). Адрес и карта — через системный autofill (Apple/Google pay). Дата — через native date picker.

## Проблема

Каждое поле формы — шанс на ошибку. Ручной ввод адреса с клавиатуры — 8+ полей, каждая опечатка = фрустрация.

## Решение

Минимизируем ручной ввод — данные подставляются автоматически.

## Плюсы

- Снижает время заполнения на 50-70%
- Меньше ошибок
- Лучше UX на маленьких экранах

## Минусы

- Нужна интеграция с системными API

## Когда использовать

- Checkout
- Профиль пользователя
- Доставка

## Принципы и гайдлайны

### Используйте системный autofill

**Источник:** `hig`

iOS и Android предоставляют autofill для адресов, карт, паролей. Это убирает ручной ввод и снижает ошибки на 80%.

## Конфигурация мокапа

```json
{
  "fields": [
    {
      "label": "Имя на карте",
      "value": "ANNA IVANOVA",
      "autofill": true
    },
    {
      "label": "Номер карты",
      "value": "4242 4242 4242 4242",
      "autofill": true
    },
    {
      "label": "Срок",
      "value": "12/27",
      "autofill": true
    },
    {
      "label": "CVC",
      "value": "•••",
      "autofill": false
    }
  ]
}
```
