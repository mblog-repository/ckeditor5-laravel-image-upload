# Загрузка изображений в CKEditor 5 для Laravel 13

Рабочий демо-проект к статье **[Загрузка изображений в CKEditor 5 для Laravel 13](https://nikitakiselev.ru/article/zagruzka-izobrazhenii-v-ckeditor-5-dlia-laravel-12)**.

Показывает, как подключить CKEditor 5 к свежему Laravel и сделать загрузку картинок на сервер: собственный upload adapter (~30 строк, без зависимостей), контроллер с валидацией и CSRF через заголовок `X-CSRF-TOKEN`.

## Стек

- Laravel 13
- CKEditor 5 (пакет `ckeditor5`, classic build)
- Vite + Tailwind (Livewire starter kit)
- SQLite (по умолчанию)

## Что где лежит

| Файл | Назначение |
|------|------------|
| `resources/js/app.js` | Инициализация редактора + собственный `MyUploadAdapter` |
| `resources/views/editor.blade.php` | Страница с редактором и `<meta name="csrf-token">` |
| `app/Http/Controllers/ImageUploadController.php` | Приём файла, валидация, ответ в формате CKEditor |
| `routes/web.php` | Роуты `/editor` и `POST /upload-image` |

## Запуск

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
php artisan storage:link   # обязательно — иначе asset('storage/...') ведёт в никуда
composer dev               # поднимает PHP-сервер и Vite разом
```

Открой `/editor` и нажми кнопку загрузки картинки на панели редактора.

## Контракт ответа сервера

CKEditor 5 ждёт чистый JSON:

```jsonc
// успех
{ "url": "https://example.com/storage/uploads/foo.png" }

// ошибка — message покажется пользователю во всплывашке
{ "error": { "message": "Файл слишком большой, максимум 2 МБ" } }
```

## Грабли

- Поле файла называется строго `upload` — именно так его шлёт CKEditor 5.
- Ответ должен быть **JSON**. Если вернётся HTML (419 / 500 / 413 при превышении `post_max_size`), CKEditor покажет безликое «не удалось загрузить» без текста.
- `import 'ckeditor5/ckeditor5.css'` обязателен — без него редактор выглядит сломанным.
- `licenseKey: 'GPL'` нужен в свежих версиях.
- Не забудь `php artisan storage:link`.
- Лимит `max:2048` в валидаторе совпадает с дефолтным `upload_max_filesize` PHP (2M) — для понятного сообщения о размере ставь лимит валидатора ниже PHP-лимита либо поднимай лимиты PHP.

## Безопасность

В демо роут загрузки открыт. В реальном проекте закрой его авторизацией (`middleware('auth')`) и добавь rate limiting, иначе лить файлы сможет кто угодно.
