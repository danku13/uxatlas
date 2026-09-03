---
slug: error-empty-state
title: Error empty state (distinct from no-data)
category: empty-states
mockupType: error-empty-state
severity: high
author: Apple News / Medium
tags:
  - high-dropoff
  - error-prone
  - clarity
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "icon": "CloudOff",
    "title": "Не удалось загрузить",
    "body": "Проверьте соединение и попробуйте снова",
    "retryLabel": "Повторить"
  }
---

> Чётко отличаем «данных нет» от «ошибка загрузки» — разные иконки, тексты и CTA.

## Описание

Если данные не загрузились — показываем error empty state: alert-иконка, «Не удалось загрузить», кнопка «Повторить». Никаких «Создать первый заказ» — это ошибка, а не пустота.

## Проблема

Когда приложение показывает «No items yet» при ошибке загрузки — пользователь думает данные пропали или приложение не работает. Жмёт «Создать» и портит данные.

## Решение

Разные empty state для no-data (CTA создать) и для error (CTA повторить).

## Плюсы

- Пользователь понимает что произошло
- Правильная CTA
- Меньше ошибочных действий

## Минусы

- Нужно отслеживать тип empty state

## Когда использовать

- Любые списки/фиды
- Профили
- Дашборды

## Принципы и гайдлайны

### Distinguish error from empty

**Источник:** `nielsen`

Different states need different UI. Error: red alert icon + Retry. No-data: friendly icon + Create. Mixing them confuses users.

### Help users recover from errors

**Источник:** `material`

Show what went wrong and how to fix it. Generic 'Something went wrong' is not actionable.

## Конфигурация мокапа

```json
{
  "icon": "CloudOff",
  "title": "Не удалось загрузить",
  "body": "Проверьте соединение и попробуйте снова",
  "retryLabel": "Повторить"
}
```
