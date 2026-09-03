---
slug: inbox-zero-celebration
title: Inbox zero celebration
category: empty-states
mockupType: inbox-zero-celebration
severity: low
author: Slack / Duolingo / Things
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
    "emoji": "🎉",
    "title": "Все задачи выполнены!",
    "body": "Вы молодец. Самое время отдохнуть."
  }
---

> Позитивный empty state когда «всё сделано» — поздравление вместо «нет данных».

## Описание

Когда почта/задачи пусты — не «Нет писем», а celebratory state: иконка радости, «Вы справились! Все задачи выполнены», «Отдохните 🙂».

## Проблема

«No items» empty state воспринимается как «здесь ничего нет для меня». Пользователь чувствует, что приложение не работает.

## Решение

Превращаем empty в достижение — позитивная эмоция.

## Плюсы

- Позитивная эмоция
- Мотивация возвращаться
- Геймификация без усилий

## Минусы

- Может надоесть при частом показе

## Когда использовать

- Email
- Task managers
- To-do apps
- Notifications

## Принципы и гайдлайны

### Celebrate empty as achievement

**Источник:** `nielsen`

When user reaches empty (inbox zero, all tasks done), celebrate it as a positive moment. Reinforce the behavior.

### Vary celebration to avoid fatigue

**Источник:** `material`

Don't show the same celebration every time. Vary messages/illustrations to avoid fatigue.

## Конфигурация мокапа

```json
{
  "emoji": "🎉",
  "title": "Все задачи выполнены!",
  "body": "Вы молодец. Самое время отдохнуть."
}
```
