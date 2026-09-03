---
slug: personalization-survey
title: Personalization survey onboarding
category: onboarding
mockupType: personalization-survey
severity: medium
author: Babbel / Duolingo
tags:
  - friction-reduction
  - clarity
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "questions": [
      {
        "title": "Какая ваша цель?",
        "options": [
          "Снизить вес",
          "Набрать массу",
          "Поддерживать форму",
          "Улучшить сон"
        ]
      },
      {
        "title": "Уровень активности?",
        "options": [
          "Сидячий",
          "Лёгкая",
          "Умеренная",
          "Высокая"
        ]
      }
    ]
  }
---

> Короткий опрос из 3-5 вопросов во время онбординга — подстраивает контент под пользователя.

## Описание

Карточки с чипсами-вариантами: «Ваша цель?», «Что интересует?», «Уровень?». Каждый ответ фильтрует последующий опыт. Babbel, Duolingo, MyFitnessPal используют.

## Проблема

Общий онбординг не учитывает контекст пользователя. Без персонализации 60% бросают приложение в первую неделю.

## Решение

3-5 коротких вопросов с чипсами — приложение сразу подстраивается под ответы.

## Плюсы

- Персонализация с первого экрана
- Повышает retention на 30-50%
- Данные для сегментации

## Минусы

- Дополнительные шаги в онбординге
- Нужно показать ценность ответов

## Когда использовать

- Fitness/health
- Образование
- Контентные приложения
- E-commerce с фильтрами

## Принципы и гайдлайны

### Questions that change the product

**Источник:** `nielsen`

Only ask questions whose answers actually change the user's experience. Vanity questions waste user time.

### Maximum 5 questions

**Источник:** `nielsen`

Users tolerate 3-5 questions. Beyond that, abandonment spikes. Each question must have a visible benefit.

## Конфигурация мокапа

```json
{
  "questions": [
    {
      "title": "Какая ваша цель?",
      "options": [
        "Снизить вес",
        "Набрать массу",
        "Поддерживать форму",
        "Улучшить сон"
      ]
    },
    {
      "title": "Уровень активности?",
      "options": [
        "Сидячий",
        "Лёгкая",
        "Умеренная",
        "Высокая"
      ]
    }
  ]
}
```
