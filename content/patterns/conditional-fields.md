---
slug: conditional-fields
title: Conditional fields (progressive disclosure)
category: forms-input
mockupType: conditional-fields
severity: medium
author: Amazon / Tinkoff
tags:
  - complexity
  - progressive-disclosure
  - friction-reduction
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "sections": [
      {
        "title": "Способ получения",
        "options": [
          "Самовывоз",
          "Курьером",
          "Почтой"
        ]
      }
    ]
  }
---

> Поля появляются только при необходимости: выбрал «доставка курьером» → появилось поле адреса.

## Описание

Изначально показываем минимум полей. При выборе опции появляются релевантные: «Самовывоз» → адрес магазина; «Курьер» → адрес доставки; «Почта» → индекс и отделение.

## Проблема

Формы со всеми возможными полями (10+ полей) отпугивают. Пользователь не понимает что обязательно.

## Решение

Показываем только релевантные поля для выбранного сценария.

## Плюсы

- Меньше полей = меньше friction
- Логичная последовательность
- Нет irrelevant вопросов

## Минусы

- Сложнее реализовать
- Нужно тестировать все ветки

## Когда использовать

- Checkout
- Регистрация с разными ролями
- Анкеты

## Принципы и гайдлайны

### Show only relevant fields

**Источник:** `nielsen`

Don't show all 15 form fields at once. Show only those relevant to user's previous choices. Progressive disclosure reduces cognitive load.

### Animate field appearance

**Источник:** `material`

When fields appear/disappear, animate the transition. Sudden jumps confuse users about what changed.

## Конфигурация мокапа

```json
{
  "sections": [
    {
      "title": "Способ получения",
      "options": [
        "Самовывоз",
        "Курьером",
        "Почтой"
      ]
    }
  ]
}
```
