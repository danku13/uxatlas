---
slug: first-time-empty-tutorial
title: First-time empty state with tutorial
category: empty-states
mockupType: first-time-empty-tutorial
severity: low
author: Slack / Trello
tags:
  - clarity
  - progressive-disclosure
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "title": "Здесь появятся ваши заказы",
    "coachMarks": [
      {
        "target": "fab",
        "label": "Создать заказ",
        "body": "Нажмите + чтобы оформить первый заказ"
      },
      {
        "target": "search",
        "label": "Поиск",
        "body": "Найдите старые заказы по номеру"
      }
    ]
  }
---

> При первом заходе — пустой экран с pulsing coach marks, указывающими на ключевые действия.

## Описание

Empty state с pulsing подсказками (coach marks): «Здесь появятся ваши заказы», «Нажмите + чтобы создать», «Используйте поиск для быстрого доступа».

## Проблема

Новые пользователи видят пустой экран и не знают с чего начать. Текст «Создайте первый заказ» — слишком общий.

## Решение

Визуальные подсказки указывают на конкретные места и действия.

## Плюсы

- Обучает конкретным действиям
- Визуально привлекает внимание
- Может быть пропущен

## Минусы

- Сложно реализовать — нужен onboarding flow

## Когда использовать

- Приложения с dashboard
- Списки заказов/сообщений
- Первый запуск

## Принципы и гайдлайны

### Coach marks teach by pointing

**Источник:** `nielsen`

Use pulsing highlights pointing to specific UI elements. Generic 'Tap the + button' text is less effective than seeing it pulse.

### Allow skipping tutorials

**Источник:** `hig`

Always let users skip the coach marks. They can come back later or explore on their own.

## Конфигурация мокапа

```json
{
  "title": "Здесь появятся ваши заказы",
  "coachMarks": [
    {
      "target": "fab",
      "label": "Создать заказ",
      "body": "Нажмите + чтобы оформить первый заказ"
    },
    {
      "target": "search",
      "label": "Поиск",
      "body": "Найдите старые заказы по номеру"
    }
  ]
}
```
