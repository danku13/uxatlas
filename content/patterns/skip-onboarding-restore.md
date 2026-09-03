---
slug: skip-onboarding-restore
title: Skip-able onboarding with restore hint
category: onboarding
mockupType: skip-onboarding-restore
severity: low
author: Spotify / Airbnb
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
    "slideTitle": "Управляйте подписками",
    "slideSubtitle": "Найдите и отмените ненужные за 2 минуты",
    "emoji": "✨",
    "skipLabel": "Пропустить",
    "snackbarMessage": "Тур можно пройти позже в разделе «Помощь»"
  }
---

> Разрешаем пропустить онбординг, но предлагаем пройти его позже из настроек.

## Описание

На каждом экране онбординга — кнопка «Пропустить». После пропуска — короткая подсказка «Тур можно пройти в любой момент из раздела Помощь».

## Проблема

Опытные пользователи бросают приложение, если их заставляют смотреть онбординг. Но если совсем убрать онбординг — новички теряются.

## Решение

Даём выбор: пропустить сразу, но оставляем явную точку возврата в настройки/помощь.

## Плюсы

- Опытные не уходят
- Новички могут вернуться
- Чувство контроля

## Минусы

- Нужно отслеживать кто прошёл тур
- Ссылка из настроек должна быть заметной

## Когда использовать

- Известный бренд
- Обновление с новыми фичами
- Аудитория смешанная

## Принципы и гайдлайны

### Respect user's time

**Источник:** `nielsen`

Power users hate forced flows. Allow skipping onboarding — they'll explore on their own.

### Make restore discoverable

**Источник:** `hig`

If you allow skipping, make sure users can find the tour again from Settings or Help. Don't hide it.

## Конфигурация мокапа

```json
{
  "slideTitle": "Управляйте подписками",
  "slideSubtitle": "Найдите и отмените ненужные за 2 минуты",
  "emoji": "✨",
  "skipLabel": "Пропустить",
  "snackbarMessage": "Тур можно пройти позже в разделе «Помощь»"
}
```
