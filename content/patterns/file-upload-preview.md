---
slug: file-upload-preview
title: File upload with preview
category: forms-input
mockupType: file-upload-preview
severity: low
author: Dropbox / Google Photos
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
    "maxFiles": 3,
    "existingFiles": [
      {
        "name": "avatar.jpg",
        "size": "240 KB",
        "progress": 100
      }
    ]
  }
---

> Загрузка файлов с прогрессом, превью и возможностью заменить/удалить.

## Описание

Кнопка «Загрузить фото» → выбор файла → прогресс-бар загрузки → превью с кнопками «Заменить» и «Удалить». Можно загрузить несколько файлов с превью сеткой.

## Проблема

Загрузка без превью и прогресса — пользователь не понимает что загрузилось, боится повторить. Многократная загрузка одного и того же.

## Решение

Превью + прогресс + кнопки управления для каждого файла.

## Плюсы

- Виден результат загрузки
- Прогресс снижает anxiety
- Лёгкое управление

## Минусы

- Нужна инфраструктура storage

## Когда использовать

- Загрузка фото профиля
- Документы KYC
- Фотографии товаров

## Принципы и гайдлайны

### Always show preview after upload

**Источник:** `nielsen`

Show a thumbnail preview after upload. Users need visual confirmation that the right file was uploaded.

### Show progress for uploads >2 seconds

**Источник:** `material`

For uploads longer than 2 seconds, show percentage progress. Indeterminate spinners make users think it's stuck.

## Конфигурация мокапа

```json
{
  "maxFiles": 3,
  "existingFiles": [
    {
      "name": "avatar.jpg",
      "size": "240 KB",
      "progress": 100
    }
  ]
}
```
