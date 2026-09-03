---
slug: page-not-found-recovery
title: 404 / page not found recovery
category: errors-recovery
mockupType: page-not-found-recovery
severity: low
author: GitHub / Stripe
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
    "title": "Страница не найдена",
    "body": "Возможно, ссылка устарела или была перемещена",
    "popularPages": [
      "Главная",
      "Каталог",
      "Корзина",
      "Профиль"
    ],
    "searchPlaceholder": "Или найдите что нужно"
  }
---

> 404 страница с навигацией — не тупик, а точка входа.

## Описание

404 не «Страница не найдена», а: иконка, объяснение, «Возможно вы искали» (популярные страницы), поиск, кнопка «На главную».

## Проблема

Стандартная 404 = тупик. Пользователь закрывает приложение/сайт. Bounce rate 80%+.

## Решение

Превращаем 404 в точку входа — навигация + поиск + популярные страницы.

## Плюсы

- Возвращает пользователя в funnel
- Снижает bounce
- Обучает структуре

## Минусы

- Нужна аналитика популярных страниц

## Когда использовать

- Любое приложение с deep links
- Web-приложения
- Content apps

## Принципы и гайдлайны

### 404 is a navigation point

**Источник:** `nielsen`

Don't show a dead-end 404. Show search, popular pages, and a clear path home. 404 should be a recovery point.

### Match 404 tone to brand

**Источник:** `material`

404 is a brand moment. GitHub's octocat, Stripe's illustration — make it memorable, not generic.

## Конфигурация мокапа

```json
{
  "title": "Страница не найдена",
  "body": "Возможно, ссылка устарела или была перемещена",
  "popularPages": [
    "Главная",
    "Каталог",
    "Корзина",
    "Профиль"
  ],
  "searchPlaceholder": "Или найдите что нужно"
}
```
