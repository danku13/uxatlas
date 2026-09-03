---
slug: staggered-content-reveal
title: Staggered content reveal
category: loading-waiting
mockupType: staggered-content-reveal
severity: low
author: Apple / Linear
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
    "itemCount": 6,
    "delayStep": 80
  }
---

> Элементы списка появляются по очереди с задержкой — плавная загрузка.

## Описание

При загрузке ленты/списка — элементы появляются по одному с задержкой 50-100ms. Создаёт ощущение скорости, а не ожидания.

## Проблема

Синхронная загрузка всех элементов выглядит как «прыг» — неприятный layout shift. Спиннеры раздражают.

## Решение

Staggered animation — элементы появляются по очереди, плавно.

## Плюсы

- Плавная загрузка
- Профессиональный вид
- Меньше layout shift

## Минусы

- Может задерживать первое interaction на 100-200ms

## Когда использовать

- Ленты контента
- Списки товаров
- Карточки в grid
- Dashboard widgets

## Принципы и гайдлайны

### Stagger for lists, not single items

**Источник:** `nielsen`

Staggered reveal works for lists. For single items, just show them. Staggering single items adds artificial delay.

### Maximum 50-100ms per step

**Источник:** `material`

Stagger step should be 50-100ms. Beyond that, users wait — defeating the purpose.

## Конфигурация мокапа

```json
{
  "itemCount": 6,
  "delayStep": 80
}
```
