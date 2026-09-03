---
slug: snackbar-with-action
title: Snackbar с action button
category: notifications-feedback
mockupType: snackbar-action
severity: low
author: Material Design
tags:
  - friction-reduction
  - cross-platform
platforms:
  - ios
  - android
published: true
moderationStatus: approved
mockupConfig:
  {
    "message": "Письмо перемещено в Архив",
    "action": "Отменить"
  }
---

> Временная полоска снизу с сообщением и кнопкой действия (Undo, Retry).

## Описание

Snackbar появляется внизу на 4-6 секунд, не блокирует UI, имеет одно action-действие. Исчезает сам или по свайпу вниз. Не прерывает пользователя.

## Проблема

Модалки с уведомлениями блокируют UI и раздражают → пользователь игнорирует или закрывает приложение. Без feedback — пользователь не понимает, что произошло.

## Решение

Snackbar даёт feedback без прерывания работы.

## Плюсы

- Не блокирует UI
- Даёт путь восстановления (Undo)
- Снижает чувство ошибки

## Минусы

- Может быть пропущен, если пользователь не смотрит на экран

## Когда использовать

- Подтверждение действий
- Undo
- Retry network
- Сохранение

## Принципы и гайдлайны

### Snackbar, не модалка, для подтверждений

**Источник:** `material`

Модалки прерывают пользователя. Используйте snackbar для transient feedback — он не блокирует UI и автоматически исчезает.

### Всегда давайте Undo для деструктивных действий

**Источник:** `nielsen`

Если действие можно отменить (delete, archive), предлагайте Undo в snackbar. Это снижает страх ошибки и упрощает recovery.

## Конфигурация мокапа

```json
{
  "message": "Письмо перемещено в Архив",
  "action": "Отменить"
}
```
