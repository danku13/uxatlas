---
slug: skeleton-screens
title: Skeleton screens
category: loading-waiting
mockupType: skeleton-screen
severity: medium
author: Facebook / LinkedIn
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
    "items": 3,
    "type": "list"
  }
---

> Пока данные грузятся — показываем серые заглушки формы контента вместо спиннера.

## Описание

Серые блоки повторяют layout реального контента. Создают впечатление мгновенной загрузки и предсказуемости интерфейса.

## Проблема

Спиннеры дольше 2-3 секунд воспринимаются как «зависло». Пользователь думает, что приложение не работает → уходит.

## Решение

Skeleton показывает структуру заранее — мозг думает «уже почти готово».

## Плюсы

- Снижает perceived loading time на 30%
- Меньше abandonment при плохой сети
- Профессиональный вид

## Минусы

- Нужна синхронизация layout skeleton и реального контента

## Когда использовать

- Ленты контента
- Списки
- Карточки товаров
- Профиль

## Принципы и гайдлайны

### Skeleton вместо спиннера для контента

**Источник:** `nielsen`

Спиннер показывает «ждите», skeleton показывает «вот что появится». Мозг воспринимает skeleton как уже частично загруженный интерфейс → меньше perceived waiting time.

## Конфигурация мокапа

```json
{
  "items": 3,
  "type": "list"
}
```
