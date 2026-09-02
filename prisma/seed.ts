import { db } from "../src/lib/db";

// Drop-off categories (Variant A — problem-first)
const categories = [
  {
    slug: "onboarding",
    name: "Онбординг и первый запуск",
    description: "Где пользователи не понимают ценность и уходят до активации.",
    icon: "DoorOpen",
    accent: "amber",
    order: 1,
  },
  {
    slug: "authentication",
    name: "Регистрация и авторизация",
    description: "Где сложные формы, пароли и FRUSTration убивают конверсию.",
    icon: "Fingerprint",
    accent: "rose",
    order: 2,
  },
  {
    slug: "search-discovery",
    name: "Поиск и обнаружение",
    description: "Где пользователь не находит то, что искал, и закрывает приложение.",
    icon: "Search",
    accent: "emerald",
    order: 3,
  },
  {
    slug: "forms-input",
    name: "Формы и ввод данных",
    description: "Где валидация, маски и длинные поля вызывают фрустрацию.",
    icon: "ClipboardList",
    accent: "teal",
    order: 4,
  },
  {
    slug: "checkout-payment",
    name: "Оплата и checkout",
    description: "Где корзина брошена из-за неожиданных шагов и ошибок карты.",
    icon: "CreditCard",
    accent: "orange",
    order: 5,
  },
  {
    slug: "errors-recovery",
    name: "Ошибки и восстановление",
    description: "Где «оно сломалось» — и пользователь не знает, что делать дальше.",
    icon: "AlertTriangle",
    accent: "red",
    order: 6,
  },
  {
    slug: "empty-states",
    name: "Empty states",
    description: "Где «тут пусто» — и пользователь думает, что приложение не работает.",
    icon: "Inbox",
    accent: "violet",
    order: 7,
  },
  {
    slug: "loading-waiting",
    name: "Загрузка и ожидание",
    description: "Где долгая загрузка воспринимается как «зависло» — и пользователь уходит.",
    icon: "LoaderCircle",
    accent: "sky",
    order: 8,
  },
  {
    slug: "notifications-feedback",
    name: "Уведомления и обратная связь",
    description: "Где спам уведомлений приводит к отключению push или удалению приложения.",
    icon: "Bell",
    accent: "pink",
    order: 9,
  },
  {
    slug: "settings-permissions",
    name: "Настройки и разрешения",
    description: "Где сложные настройки и непонятные разрешения пугают пользователя.",
    icon: "Settings",
    accent: "slate",
    order: 10,
  },
];

// Tags
const tags = [
  { slug: "high-dropoff", name: "High drop-off risk" },
  { slug: "complexity", name: "Complexity" },
  { slug: "clarity", name: "Lack of clarity" },
  { slug: "error-prone", name: "Error-prone" },
  { slug: "ios", name: "iOS" },
  { slug: "android", name: "Android" },
  { slug: "cross-platform", name: "Cross-platform" },
  { slug: "friction-reduction", name: "Friction reduction" },
  { slug: "progressive-disclosure", name: "Progressive disclosure" },
  { slug: "optimistic-ui", name: "Optimistic UI" },
];

type PatternSeed = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  problemStatement: string;
  solution: string;
  pros: string[];
  cons: string[];
  useCases: string[];
  mockupType: string;
  mockupConfig: Record<string, any>;
  platforms: string[];
  severity: "high" | "medium" | "low";
  authorName?: string;
  categorySlug: string;
  tagSlugs: string[];
  guidelines: { title: string; body: string; source: string }[];
};

const patterns: PatternSeed[] = [
  // ===== ONBOARDING =====
  {
    slug: "value-first-carousel",
    title: "Value-first onboarding carousel",
    summary:
      "3 экрана ценности до любого действия: показываем, что пользователь получит, а не что должен сделать.",
    description:
      "Карусель из 3 экранов, где каждый экран отвечает на один вопрос пользователя: «Что это?», «Зачем мне?», «Как начать?». Никаких полей ввода и разрешений до того, как пользователь увидит ценность.",
    problemStatement:
      "40-60% пользователей уходят в первые 30 секунд, если их сразу просят зарегистрироваться или дать разрешения, не показав ценность.",
    solution:
      "Откладываем любые friction-экраны (signup, permissions) до момента, когда пользователь уже увидел и понял ценность.",
    pros: [
      "Снижает churn на старте",
      "Устанавливает правильные ожидания",
      "Даёт пользователю контекст для дальнейших действий",
    ],
    cons: [
      "Может раздражать опытных пользователей",
      "Нужен сильный копирайтинг для каждого экрана",
    ],
    useCases: [
      "Новое приложение без узнаваемого бренда",
      "App с неочевидной ценностью (B2B, утилиты)",
      "Когда onboarding skip-rate выше 30%",
    ],
    mockupType: "onboarding-carousel",
    mockupConfig: {
      slides: [
        {
          icon: "Sparkles",
          title: "Управляйте подписками",
          subtitle: "Найдите и отмените ненужные за 2 минуты",
          emoji: "✨",
        },
        {
          icon: "BarChart3",
          title: "Экономия до 30%",
          subtitle: "Средний пользователь экономит 4 800₽/мес",
          emoji: "📊",
        },
        {
          icon: "ShieldCheck",
          title: "Безопасно и просто",
          subtitle: "Привяжите банк — займёт 30 секунд",
          emoji: "🛡️",
        },
      ],
    },
    platforms: ["ios", "android"],
    severity: "high",
    authorName: "Mobbin Patterns",
    categorySlug: "onboarding",
    tagSlugs: ["high-dropoff", "clarity", "progressive-disclosure", "cross-platform"],
    guidelines: [
      {
        title: "Покажите ценность до запроса действия",
        body: "Пользователь должен понять «что я получу» раньше, чем «что я должен сделать». Это снижает bounce rate на старте.",
        source: "nielsen",
      },
      {
        title: "Не более 3 экранов в карусели",
        body: "Каждый дополнительный экран карусели теряет ~20% пользователей. 3 — оптимально для удержания внимания.",
        source: "material",
      },
    ],
  },
  {
    slug: "permission-priming",
    title: "Permission priming (предзапрос)",
    summary:
      "Перед системным диалогом разрешения показываем кастомный экран, объясняющий зачем нужно разрешение.",
    description:
      "Кастомный экран с объяснением «зачем» появляется до системного диалога. Если пользователь отказался на кастомном — не показываем системный. Если согласился — системный уже не пугает.",
    problemStatement:
      "Системный диалог разрешений без контекста отвергается в 50-70% случаев. После отказа восстановить разрешение крайне сложно.",
    solution:
      "Готовим пользователя к запросу объяснением ценности, и запрашиваем разрешение только в моменте, когда оно реально нужно.",
    pros: [
      "Согласие на разрешения растёт в 2-3 раза",
      "Избегаем «отказ → вечная потеря доступа»",
      "Пользователь чувствует контроль",
    ],
    cons: ["Требует дополнительного экрана", "Нужен сильный копирайт"],
    useCases: [
      "Геолокация, push, камера, контакты",
      "Когда разрешение критично для core-функции приложения",
    ],
    mockupType: "permission-priming",
    mockupConfig: {
      icon: "MapPin",
      title: "Разрешите доступ к геолокации",
      body: "Чтобы находить сервисы рядом и показывать актуальные цены в вашем районе.",
      primaryCta: "Разрешить",
      secondaryCta: "Может быть позже",
    },
    platforms: ["ios", "android"],
    severity: "high",
    authorName: "Apple HIG",
    categorySlug: "onboarding",
    tagSlugs: ["high-dropoff", "clarity", "ios", "android"],
    guidelines: [
      {
        title: "Запрашивайте разрешение in-context",
        body: "Запрашивайте разрешение только тогда, когда пользователь пытается выполнить действие, которому оно нужно. Не запрашивайте при запуске приложения.",
        source: "hig",
      },
      {
        title: "Объясните «зачем» перед системным диалогом",
        body: "Используйте кастомный экран, чтобы пользователь понял ценность разрешения до системного диалога, который нельзя настроить.",
        source: "nielsen",
      },
    ],
  },

  // ===== AUTHENTICATION =====
  {
    slug: "passwordless-magic-link",
    title: "Passwordless / Magic link auth",
    summary:
      "Вход без пароля: пользователь вводит email и кликает ссылку. Никакого friction с паролями.",
    description:
      "Поле только для email → кнопка «Отправить ссылку» → пользователь открывает email и кликает ссылку → аутентифицирован. Альтернатива: OTP-код по SMS или email.",
    problemStatement:
      "Формы регистрации с паролем имеют конверсию ~25-30% из-за friction: придумать пароль, запомнить, повторить, special character requirements и т.д.",
    solution: "Убираем пароль из уравнения полностью — пользователь не может забыть то, чего не существует.",
    pros: [
      "Конверсия выше на 20-40%",
      "Нет проблем с забытыми паролями",
      "Меньше support-тикетов",
    ],
    cons: ["Зависимость от email/SMS-провайдера", "Чуть медленнее при плохой сети"],
    useCases: [
      "B2C приложения с фокусом на росте",
      "Когда email — основной канал коммуникации",
    ],
    mockupType: "passwordless-auth",
    mockupConfig: {
      step: "email",
      email: "",
      otp: ["", "", "", "", "", ""],
    },
    platforms: ["ios", "android"],
    severity: "high",
    authorName: "Stripe / Linear",
    categorySlug: "authentication",
    tagSlugs: ["high-dropoff", "friction-reduction", "cross-platform"],
    guidelines: [
      {
        title: "Уменьшайте friction в каждой форме аутентификации",
        body: "Каждое дополнительное поле в форме входа уменьшает конверсию. Пароль — это поле + когнитивная нагрузка. Уберите, если можете.",
        source: "nielsen",
      },
    ],
  },
  {
    slug: "inline-validation",
    title: "Inline validation (реальное время)",
    summary:
      "Валидация полей по мере ввода с конкретной обратной связью, а не только при сабмите.",
    description:
      "Поле подсвечивается зелёным/красным сразу после потери фокуса или по мере ввода. Сообщение об ошибке конкретное («пароль должен содержать минимум 8 символов»), а не общее («неверно»).",
    problemStatement:
      "Валидация только при сабмите вызывает фрустрацию: пользователь заполнил всё, нажал «далее», получил ошибки, исправил, снова получил ошибки. Цикл утомляет → abandonment.",
    solution: "Показываем валидацию по мере ввода, чтобы пользователь не доходил до сабмита с ошибками.",
    pros: [
      "Снижает ошибок сабмита на 60-80%",
      "Пользователь чувствует прогресс",
      "Учит формату (маски, паттерны)",
    ],
    cons: ["Может отвлекать, если валидация слишком агрессивная"],
    useCases: ["Регистрация", "Формы оплаты", "Длинные анкеты"],
    mockupType: "inline-validation-form",
    mockupConfig: {
      fields: [
        { id: "name", label: "Имя", type: "text", placeholder: "Анна" },
        { id: "email", label: "Email", type: "email", placeholder: "anna@example.com" },
        { id: "password", label: "Пароль", type: "password", placeholder: "Минимум 8 символов" },
      ],
    },
    platforms: ["ios", "android"],
    severity: "high",
    authorName: "Nielsen Norman",
    categorySlug: "authentication",
    tagSlugs: ["error-prone", "friction-reduction", "cross-platform"],
    guidelines: [
      {
        title: "Валидируйте во время ввода, не только при сабмите",
        body: "Показывайте валидацию сразу после потери фокуса (onBlur). Не ждите сабмита, чтобы сообщить об ошибках — это создаёт цикл фрустрации.",
        source: "nielsen",
      },
      {
        title: "Сообщения об ошибках должны быть конкретными",
        body: "Не «Неверный формат». А «Email должен содержать @ и домен». Конкретное сообщение помогает исправить ошибку за одну попытку.",
        source: "nielsen",
      },
    ],
  },

  // ===== SEARCH & DISCOVERY =====
  {
    slug: "sticky-search-suggestions",
    title: "Sticky search с подсказками",
    summary:
      "Поиск всегда доступен, при фокусе показывает популярные запросы, историю и подсказки.",
    description:
      "Sticky search bar наверху экрана. При тапе разворачивается на весь экран с: история запросов, популярные категории, недавние товары. По мере ввода — живые подсказки (autocomplete).",
    problemStatement:
      "Если поиск спрятан или не подсказывает, пользователь не находит нужное → 30%+ уходят искать в другом месте.",
    solution: "Поиск всегда видим и активно помогает пользователю сформулировать запрос.",
    pros: ["Удерживает пользователя в app", "Обучает формату запросов", "Сокращает время до результата"],
    cons: ["Нужна инфраструктура для подсказок", "Может отвлекать на главных экранах"],
    useCases: ["Marketplace", "Контентные приложения", "Сложные каталоги"],
    mockupType: "sticky-search",
    mockupConfig: {
      recent: ["Кроссовки Nike", "Кофемашина", "Подписка Spotify"],
      popular: ["Доставка еды", "Электроника", "Одежда"],
      suggestions: ["Кроссовки беговые", "Кроссовки зимние", "Кроссовки мужские"],
    },
    platforms: ["ios", "android"],
    severity: "high",
    authorName: "Airbnb / Wildberries",
    categorySlug: "search-discovery",
    tagSlugs: ["high-dropoff", "clarity", "cross-platform"],
    guidelines: [
      {
        title: "Search должен быть всегда видим",
        body: "Размещайте search на верхнем уровне иерархии. Пользователь должен иметь возможность искать с любого экрана без возврата на главную.",
        source: "material",
      },
    ],
  },
  {
    slug: "empty-search-state",
    title: "Actionable empty search state",
    summary:
      "Когда поиск ничего не нашёл — показываем альтернативы, популярные запросы и CTA, а не просто «ничего не найдено».",
    description:
      "Вместо «По запросу ничего не найдено» показываем: похожие запросы («Возможно вы искали...»), популярные категории, ссылку на поддержку, опцию «сообщить, когда появится».",
    problemStatement:
      "«Ничего не найдено» — пользователь думает, что приложение не работает или у него плохой ассортимент → уходит к конкурентам.",
    solution: "Превращаем «провал поиска» в точку открытия других возможностей.",
    pros: ["Снижает bounce с пустого поиска на 25-40%", "Удерживает в funnel", "Даёт сигнал в продукт"],
    cons: ["Нужна инфраструктура для похожих запросов"],
    useCases: ["E-commerce", "Контентные платформы", "Любые приложения с поиском"],
    mockupType: "empty-search",
    mockupConfig: {
      query: "зимние кроссовки nike",
      suggestions: ["Зимние кроссовки", "Кроссовки Nike", "Беговые кроссовки"],
      categories: ["Обувь", "Спорт", "Зимнее"],
    },
    platforms: ["ios", "android"],
    severity: "high",
    authorName: "Airbnb / Amazon",
    categorySlug: "search-discovery",
    tagSlugs: ["high-dropoff", "clarity", "cross-platform"],
    guidelines: [
      {
        title: "Empty state = новая точка входа",
        body: "Никогда не показывайте «ничего не найдено» без альтернатив. Дайте популярные категории, похожие запросы или CTA для подписки на появление товара.",
        source: "nielsen",
      },
    ],
  },

  // ===== FORMS & INPUT =====
  {
    slug: "one-screen-per-step",
    title: "One-screen-per-step wizard",
    summary:
      "Длинные формы разбиты на экраны по одному вопросу на экран с прогресс-баром.",
    description:
      "Вместо длинной формы на 10 полей — серия экранов по 1 вопросу. Прогресс-бар показывает, сколько осталось. Каждый экран не требует скролла.",
    problemStatement:
      "Длинные формы воспринимаются как «слишком сложно» → 60% abandonment на формах с 5+ полями на одном экране.",
    solution: "Разбиваем на микро-шаги — психологически легче начать и продолжать.",
    pros: ["Снижает cognitive load", "Лучше на мобильных", "Выше completion rate"],
    cons: ["Больше кликов (но меньше friction)", "Сложнее реализовать save & resume"],
    useCases: ["Регистрация врача", "Анкеты на кредит", "Onboarding с профилем"],
    mockupType: "multi-step-form",
    mockupConfig: {
      steps: ["Имя", "Адрес", "Способ оплаты"],
      current: 0,
      field: { label: "Как вас зовут?", placeholder: "Анна Иванова" },
    },
    platforms: ["ios", "android"],
    severity: "high",
    authorName: "Typeform / Tinkoff",
    categorySlug: "forms-input",
    tagSlugs: ["complexity", "friction-reduction", "progressive-disclosure"],
    guidelines: [
      {
        title: "Chunking: разбивайте сложное на простое",
        body: "Люди лучше справляются с серией простых задач, чем с одной сложной. Один вопрос на экран = низкий cognitive load.",
        source: "nielsen",
      },
      {
        title: "Всегда показывайте прогресс",
        body: "Прогресс-бар мотивирует завершить и даёт ощущение движения. Без прогресса пользователь думает «это бесконечно» и уходит.",
        source: "material",
      },
    ],
  },
  {
    slug: "smart-defaults-autofill",
    title: "Smart defaults & autofill",
    summary:
      "Предзаполняем поля значениями по умолчанию и используем системный autofill для адреса и карты.",
    description:
      "Где возможно — подставляем значения по умолчанию (страна, валюта, формат даты). Адрес и карта — через системный autofill (Apple/Google pay). Дата — через native date picker.",
    problemStatement:
      "Каждое поле формы — шанс на ошибку. Ручной ввод адреса с клавиатуры — 8+ полей, каждая опечатка = фрустрация.",
    solution: "Минимизируем ручной ввод — данные подставляются автоматически.",
    pros: ["Снижает время заполнения на 50-70%", "Меньше ошибок", "Лучше UX на маленьких экранах"],
    cons: ["Нужна интеграция с системными API"],
    useCases: ["Checkout", "Профиль пользователя", "Доставка"],
    mockupType: "autofill-form",
    mockupConfig: {
      fields: [
        { label: "Имя на карте", value: "ANNA IVANOVA", autofill: true },
        { label: "Номер карты", value: "4242 4242 4242 4242", autofill: true },
        { label: "Срок", value: "12/27", autofill: true },
        { label: "CVC", value: "•••", autofill: false },
      ],
    },
    platforms: ["ios", "android"],
    severity: "medium",
    authorName: "Apple Pay / Google Pay",
    categorySlug: "forms-input",
    tagSlugs: ["friction-reduction", "error-prone", "ios", "android"],
    guidelines: [
      {
        title: "Используйте системный autofill",
        body: "iOS и Android предоставляют autofill для адресов, карт, паролей. Это убирает ручной ввод и снижает ошибки на 80%.",
        source: "hig",
      },
    ],
  },

  // ===== CHECKOUT & PAYMENT =====
  {
    slug: "express-checkout",
    title: "Express checkout (Apple/Google Pay)",
    summary:
      "Кнопка «Оплатить в 1 клик» без ввода данных карты и адреса — всё уже есть у системы.",
    description:
      "На экране корзины сверху — Apple Pay / Google Pay кнопка. Тап → системнаяbottom sheet с подтверждением → оплата. Никаких форм, никакого ввода.",
    problemStatement:
      "Checkout с ручным вводом карты имеет abandonment ~70%. Основная причина — слишком много шагов и страх ввода данных карты.",
    solution: "Делегируем всю friction операционной системе через Apple/Google Pay.",
    pros: ["Конверсия выше на 30-50%", "Нет PCI-ответственности", "Безопаснее"],
    cons: ["Не все карты поддерживаются", "Нужен merchant account"],
    useCases: ["E-commerce", "Подписки", "Любые in-app платежи"],
    mockupType: "express-checkout",
    mockupConfig: {
      items: [
        { name: "Кроссовки Nike Air", price: "8 990 ₽" },
        { name: "Носки sport x3", price: "690 ₽" },
      ],
      total: "9 680 ₽",
    },
    platforms: ["ios", "android"],
    severity: "high",
    authorName: "Shopify / Stripe",
    categorySlug: "checkout-payment",
    tagSlugs: ["high-dropoff", "friction-reduction", "ios", "android"],
    guidelines: [
      {
        title: "Express checkout должен быть на самом видном месте",
        body: "Apple Pay / Google Pay кнопка должна быть выше формы ручного ввода. Большинство пользователей выберут express, если он виден.",
        source: "nielsen",
      },
    ],
  },
  {
    slug: "inline-payment-errors",
    title: "Inline payment errors с recovery",
    summary:
      "Ошибки оплаты показываются инлайн с конкретной причиной и CTA для исправления.",
    description:
      "Вместо модалки «Ошибка оплаты» — подсветка поля с конкретной причиной («Карта отклонена банком — позвоните в банк» или «Неверный CVC» — подсвечиваем поле CVC).",
    problemStatement:
      "Generic ошибка оплаты пугает пользователя — он думает, что приложение мошенническое или карта взломана → уходит навсегда.",
    solution: "Конкретная причина + CTA для исправления сохраняют транзакцию.",
    pros: ["Снижает abandoned checkout на 15-25%", "Не пугает пользователя", "Обучает"],
    cons: ["Нужна хорошая обработка ошибок платежного провайдера"],
    useCases: ["E-commerce checkout", "Подписки", "In-app покупки"],
    mockupType: "inline-payment-error",
    mockupConfig: {
      card: "4242 •••• •••• 4242",
      errorField: "cvc",
      errorMessage: "Неверный CVC-код. Проверьте 3 цифры на обратной стороне карты.",
    },
    platforms: ["ios", "android"],
    severity: "high",
    authorName: "Stripe",
    categorySlug: "checkout-payment",
    tagSlugs: ["error-prone", "high-dropoff", "cross-platform"],
    guidelines: [
      {
        title: "Никогда не показывайте generic ошибку оплаты",
        body: "Платежные провайдеры возвращают конкретные коды ошибок. Используйте их, чтобы объяснить пользователю причину (карта отклонена, недостаточно средств, неверный CVC).",
        source: "nielsen",
      },
    ],
  },

  // ===== ERRORS & RECOVERY =====
  {
    slug: "inline-recoverable-errors",
    title: "Inline + recoverable errors",
    summary:
      "Ошибки показываются в контексте поля, всегда с понятным путём восстановления.",
    description:
      "Ошибка показывается под полем, красным цветом, с конкретным описанием проблемы и CTA «как исправить». Не блокирует остальную форму. Пользователь может продолжить вводить другие поля.",
    problemStatement:
      "Модалки с ошибкой «Что-то пошло не так» или красные баннеры на весь экран пугают и не дают пути восстановления → пользователь закрывает приложение.",
    solution: "Ошибка локальна, конкретна и всегда имеет путь решения.",
    pros: ["Пользователь чувствует контроль", "Меньше abandonment", "Учит формату"],
    cons: ["Нужна внимательная валидация на frontend"],
    useCases: ["Любые формы", "Ввод данных", "Авторизация"],
    mockupType: "inline-error",
    mockupConfig: {
      fields: [
        { label: "Email", value: "anna@", error: "Email должен содержать домен (например, @gmail.com)" },
        { label: "Пароль", value: "123", error: "Минимум 8 символов" },
      ],
    },
    platforms: ["ios", "android"],
    severity: "high",
    authorName: "Nielsen Norman",
    categorySlug: "errors-recovery",
    tagSlugs: ["error-prone", "high-dropoff", "cross-platform"],
    guidelines: [
      {
        title: "Ошибки должны быть восстановимыми",
        body: "Никогда не показывайте ошибку без пути решения. Сообщение должно объяснять: что случилось, почему, и что делать дальше.",
        source: "nielsen",
      },
      {
        title: "Не блокируйте интерфейс модалкой при ошибке",
        body: "Показывайте ошибку инлайн, в контексте поля. Модалки заставляют пользователя терять контекст и фокус.",
        source: "material",
      },
    ],
  },

  // ===== EMPTY STATES =====
  {
    slug: "actionable-empty-state",
    title: "Actionable empty state",
    summary:
      "Когда данных нет — показываем иконку, объяснение и CTA для создания первого элемента.",
    description:
      "Не «Список пуст». А: релевантная иконка, текст «У вас пока нет заказов. Оформите первый — доставка завтра!», кнопка «Перейти в каталог».",
    problemStatement:
      "Пустой экран воспринимается как «приложение сломалось» или «здесь ничего нет для меня» → пользователь закрывает и не возвращается.",
    solution: "Empty state = образовательный момент + CTA для действия.",
    pros: ["Обучает пользователя", "Возвращает в funnel", "Снижает churn"],
    cons: ["Нужен отдельный дизайн для каждого empty state"],
    useCases: ["Список заказов", "Избранное", "История", "Чаты", "Уведомления"],
    mockupType: "actionable-empty",
    mockupConfig: {
      icon: "ShoppingBag",
      title: "Пока нет заказов",
      body: "Оформите первый заказ — доставка уже завтра!",
      cta: "Перейти в каталог",
    },
    platforms: ["ios", "android"],
    severity: "medium",
    authorName: "Mailchimp / Slack",
    categorySlug: "empty-states",
    tagSlugs: ["clarity", "high-dropoff", "cross-platform"],
    guidelines: [
      {
        title: "Empty state — это первый onboarding в функцию",
        body: "Используйте empty state, чтобы объяснить, что пользователь найдёт здесь, когда данные появятся. Включите CTA, чтобы направить к первому действию.",
        source: "material",
      },
    ],
  },

  // ===== LOADING & WAITING =====
  {
    slug: "skeleton-screens",
    title: "Skeleton screens",
    summary:
      "Пока данные грузятся — показываем серые заглушки формы контента вместо спиннера.",
    description:
      "Серые блоки повторяют layout реального контента. Создают впечатление мгновенной загрузки и предсказуемости интерфейса.",
    problemStatement:
      "Спиннеры дольше 2-3 секунд воспринимаются как «зависло». Пользователь думает, что приложение не работает → уходит.",
    solution: "Skeleton показывает структуру заранее — мозг думает «уже почти готово».",
    pros: ["Снижает perceived loading time на 30%", "Меньше abandonment при плохой сети", "Профессиональный вид"],
    cons: ["Нужна синхронизация layout skeleton и реального контента"],
    useCases: ["Ленты контента", "Списки", "Карточки товаров", "Профиль"],
    mockupType: "skeleton-screen",
    mockupConfig: {
      items: 3,
      type: "list",
    },
    platforms: ["ios", "android"],
    severity: "medium",
    authorName: "Facebook / LinkedIn",
    categorySlug: "loading-waiting",
    tagSlugs: ["clarity", "friction-reduction", "cross-platform"],
    guidelines: [
      {
        title: "Skeleton вместо спиннера для контента",
        body: "Спиннер показывает «ждите», skeleton показывает «вот что появится». Мозг воспринимает skeleton как уже частично загруженный интерфейс → меньше perceived waiting time.",
        source: "nielsen",
      },
    ],
  },
  {
    slug: "optimistic-ui",
    title: "Optimistic UI",
    summary:
      "При действии пользователя (like, comment) UI обновляется мгновенно, до подтверждения сервера.",
    description:
      "Пользователь тапнул «лайк» → сердечко сразу стало красным. Если сервер отклонил — откатываем с тихой ошибкой. Если подтвердил — ничего не делаем (всё уже готово).",
    problemStatement:
      "Ожидание ответа сервера на каждое действие (500-2000мс) воспринимается как «зависло» → пользователь тапает несколько раз → дубликаты → фрустрация.",
    solution: "Показываем результат мгновенно — пользователь чувствует скорость.",
    pros: ["Perceived performance выше на 50%+", "Меньше дублирующих действий", "Ощущение «приложение летает»"],
    cons: ["Сложнее обрабатывать rollback", "Нужна обработка конфликтов"],
    useCases: ["Лайки", "Комментарии", "Добавление в избранное", "Отметки"],
    mockupType: "optimistic-ui",
    mockupConfig: {
      items: [
        { text: "Отличный продукт!", liked: false, likes: 12 },
        { text: "Рекомендую друзьям", liked: true, likes: 47 },
        { text: "Доставка быстрая", liked: false, likes: 8 },
      ],
    },
    platforms: ["ios", "android"],
    severity: "medium",
    authorName: "Twitter / Instagram",
    categorySlug: "loading-waiting",
    tagSlugs: ["optimistic-ui", "friction-reduction", "cross-platform"],
    guidelines: [
      {
        title: "Optimistic updates для малозначимых действий",
        body: "Если действие легко отменить (like, save), обновляйте UI мгновенно и откатывайте при ошибке. Не заставляйте пользователя ждать подтверждения для trivial действий.",
        source: "nielsen",
      },
    ],
  },

  // ===== NOTIFICATIONS & FEEDBACK =====
  {
    slug: "snackbar-with-action",
    title: "Snackbar с action button",
    summary:
      "Временная полоска снизу с сообщением и кнопкой действия (Undo, Retry).",
    description:
      "Snackbar появляется внизу на 4-6 секунд, не блокирует UI, имеет одно action-действие. Исчезает сам или по свайпу вниз. Не прерывает пользователя.",
    problemStatement:
      "Модалки с уведомлениями блокируют UI и раздражают → пользователь игнорирует или закрывает приложение. Без feedback — пользователь не понимает, что произошло.",
    solution: "Snackbar даёт feedback без прерывания работы.",
    pros: ["Не блокирует UI", "Даёт путь восстановления (Undo)", "Снижает чувство ошибки"],
    cons: ["Может быть пропущен, если пользователь не смотрит на экран"],
    useCases: ["Подтверждение действий", "Undo", "Retry network", "Сохранение"],
    mockupType: "snackbar-action",
    mockupConfig: {
      message: "Письмо перемещено в Архив",
      action: "Отменить",
    },
    platforms: ["ios", "android"],
    severity: "low",
    authorName: "Material Design",
    categorySlug: "notifications-feedback",
    tagSlugs: ["friction-reduction", "cross-platform"],
    guidelines: [
      {
        title: "Snackbar, не модалка, для подтверждений",
        body: "Модалки прерывают пользователя. Используйте snackbar для transient feedback — он не блокирует UI и автоматически исчезает.",
        source: "material",
      },
      {
        title: "Всегда давайте Undo для деструктивных действий",
        body: "Если действие можно отменить (delete, archive), предлагайте Undo в snackbar. Это снижает страх ошибки и упрощает recovery.",
        source: "nielsen",
      },
    ],
  },
  {
    slug: "pull-to-refresh-feedback",
    title: "Pull-to-refresh с feedback",
    summary:
      "Свайп вниз с обновлением контента и понятной индикацией статуса.",
    description:
      "Пользователь тянет список вниз → появляется индикатор → при отпускании начинается обновление → индикатор крутится → контент обновляется → спиннер пропадает с короткой анимацией.",
    problemStatement:
      "Без явного способа «обновить» пользователь не понимает, актуальны ли данные. Может уйти, думая, что данные устарели.",
    solution: "Pull-to-refresh — знакомый жест с понятной обратной связью.",
    pros: ["Знакомый паттерн", "Пользователь контролирует актуальность", "Не требует кнопки"],
    cons: ["Неочевиден для новых пользователей"],
    useCases: ["Ленты новостей", "Списки сообщений", "Email"],
    mockupType: "pull-to-refresh",
    mockupConfig: {
      items: ["Заказ #1028 доставлён", "Новое сообщение от поддержки", "Скидка 20% на кроссовки"],
    },
    platforms: ["ios", "android"],
    severity: "low",
    authorName: "Twitter / iOS",
    categorySlug: "notifications-feedback",
    tagSlugs: ["friction-reduction", "clarity", "ios", "android"],
    guidelines: [
      {
        title: "Pull-to-refresh для живого контента",
        body: "Предоставьте pull-to-refresh в лентах и списках, где актуальность важна. Это знакомый жест, дающий пользователю чувство контроля.",
        source: "hig",
      },
    ],
  },

  // ===== SETTINGS & PERMISSIONS =====
  {
    slug: "grouped-settings-with-explanations",
    title: "Grouped settings с объяснениями",
    summary:
      "Настройки сгруппированы по смыслу, каждая с коротким объяснением зачем нужна.",
    description:
      "Настройки разбиты на секции (Аккаунт, Уведомления, Конфиденциальность). Каждая toggle имеет подпись-объяснение под названием: «Получать push о новых заказах» / «Покажем уведомление, когда заказ доставлен».",
    problemStatement:
      "Плоский список настроек без объяснений пугает — пользователь не понимает, что изменится, и оставляет всё по умолчанию или наоборот ломает.",
    solution: "Группировка + объяснения = пользователь чувствует контроль.",
    pros: ["Пользователь понимает, что включает", "Снижает support-тикеты", "Чувство контроля"],
    cons: ["Длинный экран настроек"],
    useCases: ["Профиль", "Настройки уведомлений", "Privacy-настройки"],
    mockupType: "grouped-settings",
    mockupConfig: {
      groups: [
        {
          title: "Уведомления",
          items: [
            { label: "Push-уведомления", description: "Получать уведомления о заказах и акциях", enabled: true },
            { label: "Email-рассылка", description: "Новости и персональные предложения", enabled: false },
          ],
        },
        {
          title: "Конфиденциальность",
          items: [
            { label: "Геолокация", description: "Для поиска сервисов рядом", enabled: true },
            { label: "Аналитика", description: "Помогает улучшать приложение", enabled: false },
          ],
        },
      ],
    },
    platforms: ["ios", "android"],
    severity: "low",
    authorName: "Apple Settings",
    categorySlug: "settings-permissions",
    tagSlugs: ["clarity", "complexity", "cross-platform"],
    guidelines: [
      {
        title: "Группируйте настройки по смыслу",
        body: "Плоский список из 20+ настроек подавляет. Группировка по 3-5 секций делает настройки сканируемыми.",
        source: "hig",
      },
      {
        title: "Объясняйте каждую настройку",
        body: "Под названием настройки — короткое объяснение «что произойдёт». Пользователь не должен догадываться.",
        source: "nielsen",
      },
    ],
  },
  {
    slug: "permission-rerequest-flow",
    title: "Permission re-request flow",
    summary:
      "Если пользователь ранее отказал в разрешении — направляем в системные настройки с объяснением зачем.",
    description:
      "При попытке действия, требующего разрешения (например, камера), проверяем статус. Если отказано — показываем модалку с объяснением «вам нужно включить камеру в настройках» + кнопка «Открыть настройки».",
    problemStatement:
      "После отказа в разрешении системный диалог больше не показывается. Пользователь не понимает, почему функция не работает, и думает «приложение сломалось».",
    solution: "Объясняем, как восстановить разрешение, и направляем прямо в системные настройки.",
    pros: ["Восстанавливает доступ к функциям", "Обучает пользователя", "Снижает support-тикеты"],
    cons: ["Требует объяснительный UI"],
    useCases: ["Камера, геолокация, push, контакты"],
    mockupType: "permission-rerequest",
    mockupConfig: {
      icon: "Camera",
      title: "Доступ к камере отключён",
      body: "Чтобы сделать фото профиля, включите камеру в настройках приложения.",
      primaryCta: "Открыть настройки",
      secondaryCta: "Не сейчас",
    },
    platforms: ["ios", "android"],
    severity: "high",
    authorName: "Instagram / iOS HIG",
    categorySlug: "settings-permissions",
    tagSlugs: ["error-prone", "high-dropoff", "ios", "android"],
    guidelines: [
      {
        title: "Не пытайтесь повторно запросить системное разрешение",
        body: "После отказа iOS/Android не покажут системный диалог снова. Вместо этого покажите кастомный экран с объяснением и кнопкой «Открыть настройки».",
        source: "hig",
      },
    ],
  },

  // ===== NEW: PROGRESSIVE ONBOARDING (onboarding) =====
  {
    slug: "progressive-onboarding",
    title: "Progressive onboarding (in-context hints)",
    summary:
      "Обучаем пользователя в контексте — подсвечиваем фичи когда он впервые их видит, а не upfront.",
    description:
      "Вместо длинной карусели — пользователь сразу попадает в приложение. При первом контакте с новой функцией видит пульсирующую подсветку и подсказку. Каждый туториал — отдельный микро-шаг в моменте.",
    problemStatement:
      "Длинные upfront-туториалы забываются через 30 секунд. Пользователь не может применить знания до того, как увидит реальный интерфейс.",
    solution:
      "Обучаем в моменте — подсвечиваем функцию когда пользователь впервые видит её в реальном контексте. Знание закрепляется действием.",
    pros: [
      "Знание закрепляется действием",
      "Не фрустрирует опытных пользователей",
      "Контекстуально — пользователь видит где кнопка",
    ],
    cons: ["Сложнее реализовать — нужна аналитика", "Может появиться слишком часто"],
    useCases: [
      "Приложение со сложным UI",
      "Когда есть скрытые жесты",
      "B2B с расширенным функционалом",
    ],
    mockupType: "progressive-onboarding",
    mockupConfig: {
      highlights: [
        { target: "filter", label: "Фильтры", body: "Нажмите для уточнения поиска" },
        { target: "favorite", label: "Избранное", body: "Сохраняйте понравившиеся товары" },
      ],
    },
    platforms: ["ios", "android"],
    severity: "medium",
    authorName: "Linear / Notion",
    categorySlug: "onboarding",
    tagSlugs: ["high-dropoff", "clarity", "progressive-disclosure", "cross-platform"],
    guidelines: [
      {
        title: "Teach in context, not upfront",
        body: "People learn by doing. Show hints when users encounter a feature, not in a separate tutorial they'll forget in 30 seconds.",
        source: "nielsen",
      },
      {
        title: "Keep tips dismissible and rare",
        body: "Don't show the same tip twice. Allow users to dismiss and never see again. Track who's seen what.",
        source: "material",
      },
    ],
  },

  // ===== NEW: SKIP ONBOARDING WITH RESTORE (onboarding) =====
  {
    slug: "skip-onboarding-restore",
    title: "Skip-able onboarding with restore hint",
    summary:
      "Разрешаем пропустить онбординг, но предлагаем пройти его позже из настроек.",
    description:
      "На каждом экране онбординга — кнопка «Пропустить». После пропуска — короткая подсказка «Тур можно пройти в любой момент из раздела Помощь».",
    problemStatement:
      "Опытные пользователи бросают приложение, если их заставляют смотреть онбординг. Но если совсем убрать онбординг — новички теряются.",
    solution:
      "Даём выбор: пропустить сразу, но оставляем явную точку возврата в настройки/помощь.",
    pros: ["Опытные не уходят", "Новички могут вернуться", "Чувство контроля"],
    cons: ["Нужно отслеживать кто прошёл тур", "Ссылка из настроек должна быть заметной"],
    useCases: ["Известный бренд", "Обновление с новыми фичами", "Аудитория смешанная"],
    mockupType: "skip-onboarding-restore",
    mockupConfig: {
      slideTitle: "Управляйте подписками",
      slideSubtitle: "Найдите и отмените ненужные за 2 минуты",
      emoji: "✨",
      skipLabel: "Пропустить",
      snackbarMessage: "Тур можно пройти позже в разделе «Помощь»",
    },
    platforms: ["ios", "android"],
    severity: "low",
    authorName: "Spotify / Airbnb",
    categorySlug: "onboarding",
    tagSlugs: ["friction-reduction", "clarity", "cross-platform"],
    guidelines: [
      {
        title: "Respect user's time",
        body: "Power users hate forced flows. Allow skipping onboarding — they'll explore on their own.",
        source: "nielsen",
      },
      {
        title: "Make restore discoverable",
        body: "If you allow skipping, make sure users can find the tour again from Settings or Help. Don't hide it.",
        source: "hig",
      },
    ],
  },

  // ===== NEW: BIOMETRIC AUTH (authentication) =====
  {
    slug: "biometric-auth",
    title: "Biometric authentication (Face ID)",
    summary:
      "Вход через Face ID / Touch ID — мгновенная аутентификация без ввода пароля.",
    description:
      "При повторном входе — системный промпт Face ID с автоматическим распознаванием. Если биометрия недоступна — fallback на пароль или пин-код.",
    problemStatement:
      "Повторный ввод пароля каждый раз при открытии приложения раздражает и снижает retention.",
    solution:
      "Биометрия — мгновенный вход, не требует памяти и не вызывает фрустрацию.",
    pros: ["Вход за <1 секунды", "Не нужно помнить пароль", "Безопаснее пароля"],
    cons: [
      "Не все устройства поддерживают",
      "Биометрия может не сработать (мокрые руки, маска)",
    ],
    useCases: ["Banking", "Приложения с чувствительными данными", "Любое приложение с частым возвратом"],
    mockupType: "biometric-auth",
    mockupConfig: {
      appName: "UX Bank",
      lastLogin: "Последний вход 2 часа назад",
    },
    platforms: ["ios", "android"],
    severity: "medium",
    authorName: "Banking apps",
    categorySlug: "authentication",
    tagSlugs: ["friction-reduction", "ios", "android"],
    guidelines: [
      {
        title: "Always provide fallback",
        body: "Biometrics can fail (wet fingers, mask, etc). Always provide a fallback to passcode, never lock the user out.",
        source: "hig",
      },
      {
        title: "Biometrics for re-auth, not first login",
        body: "First login still requires password to establish trust. Use biometrics for subsequent re-authentications.",
        source: "nielsen",
      },
    ],
  },

  // ===== NEW: SEARCH FILTERS SHEET (search-discovery) =====
  {
    slug: "search-filters-sheet",
    title: "Search filters as bottom sheet",
    summary:
      "Быстрые фильтры-чипсы наверху, полный набор — в bottom sheet по тапу.",
    description:
      "Под поиском — горизонтальный скролл с быстрыми фильтрами (Цена, Рейтинг). Тап на «Все фильтры» → bottom sheet с полным набором (категории, бренды, радиус, наличие).",
    problemStatement:
      "Скрытые фильтры уменьшают discovery. Полная страница фильтров слишком тяжёлая для быстрого уточнения.",
    solution:
      "Гибрид — быстрые чипсы для частых фильтров + bottom sheet для редких.",
    pros: [
      "Быстрый доступ к popular фильтрам",
      "Полные фильтры всегда доступны",
      "Bottom sheet не блокирует контекст",
    ],
    cons: ["Нужно знать какие фильтры — popular"],
    useCases: ["E-commerce", "Real estate", "Любые приложения с большим каталогом"],
    mockupType: "search-filters-sheet",
    mockupConfig: {
      quickFilters: ["Под заказ", "Со скидкой", "Новинки", "Топ"],
      activeFilter: "Со скидкой",
      fullFilters: [
        { name: "Категория", options: ["Электроника", "Одежда", "Дом"] },
        { name: "Цена", options: ["До 1000 ₽", "1000–5000 ₽", "5000+ ₽"] },
      ],
    },
    platforms: ["ios", "android"],
    severity: "medium",
    authorName: "Airbnb / Wildberries",
    categorySlug: "search-discovery",
    tagSlugs: ["high-dropoff", "clarity", "progressive-disclosure", "cross-platform"],
    guidelines: [
      {
        title: "Surface common filters, hide rare ones",
        body: "Put the 3-4 most-used filters as quick chips. Less common filters go into a bottom sheet. Don't show all 20 filters upfront.",
        source: "nielsen",
      },
      {
        title: "Bottom sheet preserves context",
        body: "Use bottom sheets for filters so users can still see results above. Don't navigate to a separate filter page.",
        source: "material",
      },
    ],
  },

  // ===== NEW: SMART INPUT MASKS (forms-input) =====
  {
    slug: "smart-input-masks",
    title: "Smart input masks (phone, card)",
    summary:
      "Автоформатирование ввода по маске: телефон +7 (XXX) XXX-XX-XX, карта XXXX XXXX XXXX XXXX.",
    description:
      "По мере ввода текст автоматически форматируется. Пользователь не думает про скобки и пробелы. Копирование-вставка тоже корректно парсится.",
    problemStatement:
      "Ввод телефона/карты сплошным текстом ('+79161234567') — трудно проверить, легко ошибиться.",
    solution: "Маска форматирует по мере ввода — легко читать и проверять.",
    pros: ["Меньше ошибок ввода", "Легче проверить визуально", "Поддержка paste"],
    cons: ["Нужна аккуратная реализация paste"],
    useCases: ["Формы оплаты", "Регистрация по телефону", "Профиль пользователя"],
    mockupType: "smart-input-masks",
    mockupConfig: {
      fields: [
        { type: "phone", label: "Телефон", placeholder: "+7 (___) ___-__-__" },
        { type: "card", label: "Номер карты", placeholder: "____ ____ ____ ____" },
        { type: "date", label: "Срок действия", placeholder: "ММ/ГГ" },
      ],
    },
    platforms: ["ios", "android"],
    severity: "medium",
    authorName: "Stripe / Tinkoff",
    categorySlug: "forms-input",
    tagSlugs: ["error-prone", "friction-reduction", "cross-platform"],
    guidelines: [
      {
        title: "Format as user types",
        body: "Apply masks live as the user types. Don't wait for blur — by then the user has already moved on.",
        source: "nielsen",
      },
      {
        title: "Handle paste correctly",
        body: "When user pastes, strip non-digits and re-apply mask. Don't break pasted input.",
        source: "material",
      },
    ],
  },

  // ===== NEW: ORDER SUMMARY WITH DELIVERY (checkout-payment) =====
  {
    slug: "order-summary-delivery",
    title: "Order summary with delivery estimate",
    summary:
      "Перед оплатой — карточка с адресом, оценкой доставки и полной разбивкой цены.",
    description:
      "Полный order summary: адрес с возможностью изменить, ожидаемая дата доставки (с завтра), разбивка цены (товары + доставка + скидка). Все сюрпризы — до кнопки оплаты.",
    problemStatement:
      "Неожиданные расходы или сроки доставки на финальном шаге — главная причина cart abandonment.",
    solution:
      "Полная прозрачность до оплаты — пользователь не боится нажать «Оплатить».",
    pros: [
      "Снижает cart abandonment",
      "Управляет ожиданиями",
      "Возможность изменить адрес",
    ],
    cons: ["Нужна интеграция с delivery API"],
    useCases: ["E-commerce", "Food delivery", "Любой checkout"],
    mockupType: "order-summary-delivery",
    mockupConfig: {
      address: "Москва, ул. Тверская 12, кв 45",
      deliveryDate: "Завтра, до 21:00",
      itemsCount: 2,
      itemsTotal: "9 680 ₽",
      delivery: "Бесплатно",
      total: "9 680 ₽",
    },
    platforms: ["ios", "android"],
    severity: "high",
    authorName: "Amazon / Ozon",
    categorySlug: "checkout-payment",
    tagSlugs: ["high-dropoff", "clarity", "friction-reduction", "cross-platform"],
    guidelines: [
      {
        title: "No surprises before payment",
        body: "Show all costs, delivery estimates, and address before payment. Hidden fees on the final step cause 50%+ of abandonment.",
        source: "nielsen",
      },
      {
        title: "Allow last-minute edits",
        body: "Let users edit address and delivery options from the summary screen. Don't force them back to cart.",
        source: "material",
      },
    ],
  },

  // ===== NEW: OFFLINE MODE WITH CACHED (errors-recovery) =====
  {
    slug: "offline-mode-cached",
    title: "Offline mode with cached data",
    summary:
      "Когда нет сети — показываем кэшированные данные с баннером «Офлайн» и кнопкой «Повторить».",
    description:
      "Приложение detects offline → показывает жёлтый баннер «Нет соединения. Показаны последние данные.» + кнопка «Повторить». Контент остаётся видимым (кэш), действия с очередями на синхронизацию.",
    problemStatement:
      "Без интернета приложение показывает белый экран или бесконечный спиннер — пользователь думает что оно сломалось и уходит.",
    solution:
      "Показываем что есть (кэш), явно сообщаем статус, даём путь к восстановлению.",
    pros: [
      "Приложение «работает» даже офлайн",
      "Пользователь информирован",
      "Действия ставятся в очередь",
    ],
    cons: ["Нужна стратегия кэширования", "Конфликты при синхронизации"],
    useCases: [
      "News/feed",
      "Music streaming",
      "Любые приложения с частым использованием в метро",
    ],
    mockupType: "offline-mode-cached",
    mockupConfig: {
      lastUpdated: "Обновлено 5 минут назад",
      items: [
        "Заказ #1028 доставлён",
        "Скидка 20% на кроссовки",
        "Новое сообщение от поддержки",
      ],
    },
    platforms: ["ios", "android"],
    severity: "high",
    authorName: "Telegram / Spotify",
    categorySlug: "errors-recovery",
    tagSlugs: ["high-dropoff", "error-prone", "clarity", "cross-platform"],
    guidelines: [
      {
        title: "Degrade gracefully",
        body: "When network fails, show cached data with a clear offline banner. Empty screens or infinite spinners make users think the app is broken.",
        source: "nielsen",
      },
      {
        title: "Queue actions for sync",
        body: "Let users continue interacting offline. Queue writes and sync when connection returns. Notify on completion.",
        source: "material",
      },
    ],
  },

  // ===== NEW: RETRY WITH PROGRESSIVE STATUS (errors-recovery) =====
  {
    slug: "retry-with-status",
    title: "Retry with progressive status",
    summary:
      "Кнопка «Повторить» с прогрессом: «Подключение...» → «Загрузка данных...» → «Готово».",
    description:
      "При ошибке загрузки — кнопка «Повторить». При тапе — статусные сообщения сменяют друг друга, давая понимание что происходит. Не просто «Загрузка...» на 5 секунд.",
    problemStatement:
      "Generic «Загрузка...» без обратной связи воспринимается как зависло. Пользователь жмёт повторно, создавая дублирующие запросы.",
    solution:
      "Прогрессивные статусы дают чувство движения и понимание что приложение работает.",
    pros: ["Снижает чувство «зависло»", "Меньше повторных тапов", "Пользователь видит прогресс"],
    cons: ["Нужна детальная телеметрия на бэке"],
    useCases: ["Длинные загрузки", "Любые сетевые операции", "Upload/Download"],
    mockupType: "retry-with-status",
    mockupConfig: {
      errorMessage: "Не удалось загрузить ленту",
      steps: ["Подключение к серверу...", "Загрузка данных...", "Почти готово..."],
    },
    platforms: ["ios", "android"],
    severity: "medium",
    authorName: "Twitter / Instagram",
    categorySlug: "errors-recovery",
    tagSlugs: ["clarity", "friction-reduction", "cross-platform"],
    guidelines: [
      {
        title: "Show progressive status",
        body: "Don't show generic 'Loading...' for more than 2 seconds. Show what's happening: connecting, fetching, processing.",
        source: "nielsen",
      },
      {
        title: "Distinguish slow from broken",
        body: "If an operation exceeds expected time, show progress. Indeterminate spinners feel slower than they are.",
        source: "material",
      },
    ],
  },

  // ===== NEW: FIRST-TIME EMPTY WITH TUTORIAL (empty-states) =====
  {
    slug: "first-time-empty-tutorial",
    title: "First-time empty state with tutorial",
    summary:
      "При первом заходе — пустой экран с pulsing coach marks, указывающими на ключевые действия.",
    description:
      "Empty state с pulsing подсказками (coach marks): «Здесь появятся ваши заказы», «Нажмите + чтобы создать», «Используйте поиск для быстрого доступа».",
    problemStatement:
      "Новые пользователи видят пустой экран и не знают с чего начать. Текст «Создайте первый заказ» — слишком общий.",
    solution: "Визуальные подсказки указывают на конкретные места и действия.",
    pros: [
      "Обучает конкретным действиям",
      "Визуально привлекает внимание",
      "Может быть пропущен",
    ],
    cons: ["Сложно реализовать — нужен onboarding flow"],
    useCases: ["Приложения с dashboard", "Списки заказов/сообщений", "Первый запуск"],
    mockupType: "first-time-empty-tutorial",
    mockupConfig: {
      title: "Здесь появятся ваши заказы",
      coachMarks: [
        { target: "fab", label: "Создать заказ", body: "Нажмите + чтобы оформить первый заказ" },
        { target: "search", label: "Поиск", body: "Найдите старые заказы по номеру" },
      ],
    },
    platforms: ["ios", "android"],
    severity: "low",
    authorName: "Slack / Trello",
    categorySlug: "empty-states",
    tagSlugs: ["clarity", "progressive-disclosure", "cross-platform"],
    guidelines: [
      {
        title: "Coach marks teach by pointing",
        body: "Use pulsing highlights pointing to specific UI elements. Generic 'Tap the + button' text is less effective than seeing it pulse.",
        source: "nielsen",
      },
      {
        title: "Allow skipping tutorials",
        body: "Always let users skip the coach marks. They can come back later or explore on their own.",
        source: "hig",
      },
    ],
  },

  // ===== NEW: ERROR EMPTY STATE (empty-states) =====
  {
    slug: "error-empty-state",
    title: "Error empty state (distinct from no-data)",
    summary:
      "Чётко отличаем «данных нет» от «ошибка загрузки» — разные иконки, тексты и CTA.",
    description:
      "Если данные не загрузились — показываем error empty state: alert-иконка, «Не удалось загрузить», кнопка «Повторить». Никаких «Создать первый заказ» — это ошибка, а не пустота.",
    problemStatement:
      "Когда приложение показывает «No items yet» при ошибке загрузки — пользователь думает данные пропали или приложение не работает. Жмёт «Создать» и портит данные.",
    solution: "Разные empty state для no-data (CTA создать) и для error (CTA повторить).",
    pros: [
      "Пользователь понимает что произошло",
      "Правильная CTA",
      "Меньше ошибочных действий",
    ],
    cons: ["Нужно отслеживать тип empty state"],
    useCases: ["Любые списки/фиды", "Профили", "Дашборды"],
    mockupType: "error-empty-state",
    mockupConfig: {
      icon: "CloudOff",
      title: "Не удалось загрузить",
      body: "Проверьте соединение и попробуйте снова",
      retryLabel: "Повторить",
    },
    platforms: ["ios", "android"],
    severity: "high",
    authorName: "Apple News / Medium",
    categorySlug: "empty-states",
    tagSlugs: ["high-dropoff", "error-prone", "clarity", "cross-platform"],
    guidelines: [
      {
        title: "Distinguish error from empty",
        body: "Different states need different UI. Error: red alert icon + Retry. No-data: friendly icon + Create. Mixing them confuses users.",
        source: "nielsen",
      },
      {
        title: "Help users recover from errors",
        body: "Show what went wrong and how to fix it. Generic 'Something went wrong' is not actionable.",
        source: "material",
      },
    ],
  },

  // ===== NEW: INLINE PROGRESS WITH PERCENTAGE (loading-waiting) =====
  {
    slug: "inline-progress-percentage",
    title: "Inline progress with percentage and ETA",
    summary:
      "Для длинных операций — прогресс-бар с процентами и оценкой времени.",
    description:
      "При загрузке файла >2 секунд — показываем прогресс с % и ETA («12 сек осталось»). Лучше, чем indeterminate spinner.",
    problemStatement:
      "Indeterminate спиннеры на длинных операциях ощущаются как зависшие. Пользователь не знает сколько ждать.",
    solution: "Показываем конкретный прогресс и ETA — пользователь терпеливо ждёт.",
    pros: [
      "Снижает perceived waiting time",
      "Пользователь может решить подождать или вернуться",
      "Честность",
    ],
    cons: ["Нужна точная телеметрия на бэке"],
    useCases: ["Upload файлов", "Установка обновлений", "Длинные расчёты"],
    mockupType: "inline-progress-percentage",
    mockupConfig: {
      operation: "Загрузка фото",
      total: 24,
      current: 16,
    },
    platforms: ["ios", "android"],
    severity: "medium",
    authorName: "Google Photos / iCloud",
    categorySlug: "loading-waiting",
    tagSlugs: ["clarity", "friction-reduction", "cross-platform"],
    guidelines: [
      {
        title: "Show progress for >2s operations",
        body: "Indeterminate spinners feel slower than they are. Show percentage and ETA for operations longer than 2 seconds.",
        source: "nielsen",
      },
      {
        title: "Be honest about time",
        body: "Don't say 'Almost done' if you're not. Users will forgive accurate estimates; they'll hate false promises.",
        source: "material",
      },
    ],
  },

  // ===== NEW: IN-APP NOTIFICATION CENTER (notifications-feedback) =====
  {
    slug: "in-app-notification-center",
    title: "In-app notification center",
    summary:
      "Иконка колокольчика с unread badge → dropdown со списком недавних уведомлений.",
    description:
      "Bell icon в шапке с красным badge непрочитанных. Тап → dropdown с уведомлениями (заказы, сообщения, акции). Mark all as read. Push-уведомления дублируются сюда.",
    problemStatement:
      "Push-уведомления закрываются и забываются. Пользователь хочет вернуться к ним позже — не может.",
    solution:
      "Все уведомления сохраняются в центре — пользователь может вернуться когда удобно.",
    pros: ["Уведомления не теряются", "Снижает зависимость от push", "Mark-as-read управление"],
    cons: ["Нужна инфраструктура хранения"],
    useCases: ["E-commerce", "Соцсети", "Messenger"],
    mockupType: "in-app-notification-center",
    mockupConfig: {
      unread: 3,
      notifications: [
        { type: "order", title: "Заказ #1028 доставлён", time: "5 мин назад", unread: true },
        { type: "message", title: "Новое сообщение от поддержки", time: "1 час назад", unread: true },
        { type: "promo", title: "Скидка 20% на кроссовки", time: "3 часа назад", unread: true },
        { type: "system", title: "Обновление до v2.0", time: "Вчера", unread: false },
      ],
    },
    platforms: ["ios", "android"],
    severity: "low",
    authorName: "Facebook / Instagram",
    categorySlug: "notifications-feedback",
    tagSlugs: ["clarity", "friction-reduction", "cross-platform"],
    guidelines: [
      {
        title: "Persist notifications in-app",
        body: "Push notifications are dismissed and lost. Always persist them in an in-app center so users can return to them.",
        source: "nielsen",
      },
      {
        title: "Mark-as-read and filter",
        body: "Let users mark all as read and filter by type. Notification fatigue is real — give controls.",
        source: "material",
      },
    ],
  },

  // ===== NEW: PERMISSION STATUS DASHBOARD (settings-permissions) =====
  {
    slug: "permission-status-dashboard",
    title: "Permission status dashboard",
    summary:
      "Один экран со статусом всех разрешений: granted/denied + быстрый переход к настройкам.",
    description:
      "Список всех разрешений (Камера, Геолокация, Push, Контакты, Микрофон) с цветным статусом. Tap на denied → направляет в системные настройки.",
    problemStatement:
      "Пользователь не помнит какие разрешения выдал. Когда функция не работает — не понимает, что нужно разрешение.",
    solution:
      "Один экран показывает всё. Легко понять что не хватает и быстро перейти к настройкам.",
    pros: [
      "Прозрачность разрешений",
      "Лёгкое восстановление доступа",
      "Снижает support-тикеты",
    ],
    cons: ["Нужна интеграция с системным API"],
    useCases: ["Приложения с многими разрешениями", "Banking", "Соцсети"],
    mockupType: "permission-status-dashboard",
    mockupConfig: {
      permissions: [
        { name: "Геолокация", status: "granted", icon: "MapPin" },
        { name: "Камера", status: "denied", icon: "Camera" },
        { name: "Push-уведомления", status: "granted", icon: "Bell" },
        { name: "Контакты", status: "not-determined", icon: "Users" },
        { name: "Микрофон", status: "denied", icon: "Mic" },
      ],
    },
    platforms: ["ios", "android"],
    severity: "medium",
    authorName: "iOS Settings / WhatsApp",
    categorySlug: "settings-permissions",
    tagSlugs: ["clarity", "complexity", "error-prone", "cross-platform"],
    guidelines: [
      {
        title: "Show all permissions in one place",
        body: "Don't make users hunt through system settings. Show all your app's permissions with status in one screen.",
        source: "hig",
      },
      {
        title: "Direct link to system settings",
        body: "When a permission is denied, link directly to the system settings page for that permission. Don't make users search.",
        source: "nielsen",
      },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Categories
  for (const c of categories) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }
  console.log(`✓ ${categories.length} categories`);

  // 2. Tags
  for (const t of tags) {
    await db.tag.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
  }
  console.log(`✓ ${tags.length} tags`);

  // 3. Patterns
  // Clean existing
  await db.patternTag.deleteMany();
  await db.guideline.deleteMany();
  await db.pattern.deleteMany();

  for (const p of patterns) {
    const { categorySlug, tagSlugs, guidelines, ...patternData } = p;
    const category = await db.category.findUnique({ where: { slug: categorySlug } });
    if (!category) throw new Error(`Category not found: ${categorySlug}`);

    const created = await db.pattern.create({
      data: {
        ...patternData,
        pros: JSON.stringify(patternData.pros),
        cons: JSON.stringify(patternData.cons),
        useCases: JSON.stringify(patternData.useCases),
        mockupConfig: JSON.stringify(patternData.mockupConfig),
        platforms: JSON.stringify(patternData.platforms),
        categoryId: category.id,
      },
    });

    // tags
    for (const slug of tagSlugs) {
      const tag = await db.tag.findUnique({ where: { slug } });
      if (tag) {
        await db.patternTag.create({
          data: { patternId: created.id, tagId: tag.id },
        });
      }
    }

    // guidelines
    for (const g of guidelines) {
      await db.guideline.create({
        data: {
          title: g.title,
          body: g.body,
          source: g.source,
          patternId: created.id,
        },
      });
    }
  }
  console.log(`✓ ${patterns.length} patterns with tags and guidelines`);

  console.log("🌱 Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
