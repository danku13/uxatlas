---
slug: dark-mode-toggle
title: Dark mode (system / light / dark)
category: settings-permissions
mockupType: dark-mode-toggle
severity: low
author: Apple / Material 3
tags:
  - clarity
  - complexity
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "options": [
      {
        "id": "system",
        "label": "Как в системе",
        "desc": "Следует настройкам устройства",
        "icon": "Smartphone"
      },
      {
        "id": "light",
        "label": "Светлая",
        "desc": "Всегда светлая",
        "icon": "Sun"
      },
      {
        "id": "dark",
        "label": "Тёмная",
        "desc": "Всегда тёмная",
        "icon": "Moon"
      }
    ],
    "current": "system"
  }
---

> 3 опции темы: системная, светлая, тёмная — с предпросмотром и мгновенным применением.

## Описание

Три опции: «Как в системе» (по умолчанию), «Светлая», «Тёмная». При выборе — мгновенное применение с анимацией перехода. Сохраняется в preferences.

## Проблема

Только binary toggle (light/dark) не учитывает системную тему. Пользователь вынужден переключать вручную при смене времени суток.

## Решение

System option + manual override. Автоматически следует системной теме.

## Плюсы

- Уважает системные настройки
- Ручной override для контроля
- Стандарт iOS/Android

## Минусы

- Нужна поддержка CSS prefers-color-scheme

## Когда использовать

- Любое приложение с dark/light
- Читалки
- Контентные приложения

## Принципы и гайдлайны

### Default to system preference

**Источник:** `hig`

Default theme should follow system preference (prefers-color-scheme). Don't force light on users who set dark mode.

### Apply theme instantly

**Источник:** `material`

Theme change should apply instantly, no app restart. Animate transition for smoothness.

## Конфигурация мокапа

```json
{
  "options": [
    {
      "id": "system",
      "label": "Как в системе",
      "desc": "Следует настройкам устройства",
      "icon": "Smartphone"
    },
    {
      "id": "light",
      "label": "Светлая",
      "desc": "Всегда светлая",
      "icon": "Sun"
    },
    {
      "id": "dark",
      "label": "Тёмная",
      "desc": "Всегда тёмная",
      "icon": "Moon"
    }
  ],
  "current": "system"
}
```
