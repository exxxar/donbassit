/**
 * DOIT — Main Scripts
 * Handles: header scroll, burger menu, tabs, portfolio filters, animations, forms
 */

(function () {
    'use strict';

    // ===== HEADER SCROLL =====
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===== BURGER MENU =====
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', function () {
            burger.classList.toggle('burger--active');
            nav.classList.toggle('nav--open');
            document.body.style.overflow = nav.classList.contains('nav--open') ? 'hidden' : '';
        });

        // Close on link click
        nav.querySelectorAll('.nav__link').forEach(function (link) {
            link.addEventListener('click', function () {
                burger.classList.remove('burger--active');
                nav.classList.remove('nav--open');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (nav.classList.contains('nav--open') && !nav.contains(e.target) && !burger.contains(e.target)) {
                burger.classList.remove('burger--active');
                nav.classList.remove('nav--open');
                document.body.style.overflow = '';
            }
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = header.offsetHeight + 20;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ===== TABS =====
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            tabBtns.forEach(function (b) { b.classList.remove('tab-btn--active'); });
            tabContents.forEach(function (c) { c.classList.remove('tab-content--active'); });

            this.classList.add('tab-btn--active');
            var target = document.getElementById('form-' + tabId);
            if (target) target.classList.add('tab-content--active');
        });
    });

    // ===== PORTFOLIO: DATA =====
    var projectsData = [
        // ===== ENTERPRISE =====
        {
            id: 'foresightzone',
            title: 'ForesightZone',
            category: 'enterprise',
            categoryLabel: 'Enterprise / AI',
            icon: '🔮',
            description: 'ИИ-форсайт платформа для бизнеса на микросервисной архитектуре с real-time коллаборацией',
            fullDescription: 'AI-платформа для стратегических решений, анализирующая сигналы рынка, новости и данные для прогнозирования сценариев развития бизнеса.',
            complexity: 'very-high',
            complexityLabel: 'Очень высокая',
            duration: '24 месяца',
            features: [
                'Микросервисы на .NET 8 (Clean Architecture)',
                'Real-time коллаборация через SignalR',
                'Redis-бэкплейн для масштабирования',
                'Keycloak OAuth2/OIDC аутентификация',
                'API Gateway на YARP',
                'Паттерны: CQRS, Saga, Outbox',
                'DevOps: Docker, Terraform, Yandex Cloud',
                'Frontend: React + TypeScript'
            ],
            tech: ['.NET 8', 'PostgreSQL', 'Redis', 'SignalR', 'React', 'TypeScript', 'Docker', 'Yandex Cloud']
        },
        {
            id: 'mychess',
            title: 'myChess',
            category: 'enterprise',
            categoryLabel: 'Enterprise / Gaming',
            icon: '♟️',
            description: 'Распределённая шахматная платформа с AI-аналитикой и высоконагруженными микросервисами',
            fullDescription: 'Шахматная экосистема с интеграцией AI-движков Stockfish и lc0, руководством командой и распределённой архитектурой.',
            complexity: 'very-high',
            complexityLabel: 'Очень высокая',
            duration: '3,5 года',
            features: [
                'Микросервисы на .NET 6+',
                'Интеграция Stockfish и lc0',
                'NestJS backend + Redis message queue',
                'Team Lead технической команды',
                'Мониторинг: Grafana + Prometheus',
                'Kubernetes оркестрация',
                'GitLab CI/CD',
                'Code review и стандартизация'
            ],
            tech: ['.NET 6+', 'NestJS', 'PostgreSQL', 'MongoDB', 'Redis', 'Kubernetes', 'Grafana']
        },
        {
            id: 'gorsvodokanal',
            title: 'ГорВодоканал',
            category: 'enterprise',
            categoryLabel: 'Enterprise / ЖКХ',
            icon: '💧',
            description: 'Комплексная ИС для водоканала: сайт, 2 ЛК, админка и Telegram-бот',
            fullDescription: 'Многоролевая информационная система ресурсоснабжающей организации с личными кабинетами для ФЛ и ЮЛ, оплатой и документооборотом.',
            complexity: 'very-high',
            complexityLabel: 'Очень высокая',
            duration: '6 месяцев',
            features: [
                'ЛК физлица: показания, оплата, заявки',
                'ЛК юрлица: организация, история, документы',
                'Telegram-бот с полным функционалом',
                'Интеграция с СБП, QR-кодами, картами',
                'Запись на приём к руководству',
                'Ролевая модель и SSL',
                'Админ-панель с управлением контентом',
                'Адаптивная вёрстка'
            ],
            tech: ['Laravel', 'Vue 3', 'MySQL', 'Telegram Bot API', 'СБП API']
        },
        {
            id: 'dodoors',
            title: 'Dodoors',
            category: 'enterprise',
            categoryLabel: 'Enterprise / CRM',
            icon: '🚪',
            description: 'CRM для управления продажами дверей скрытого монтажа с интерактивным конструктором',
            fullDescription: 'Система управления заказами с динамическим расчётом стоимости, генерацией договоров и интеграцией с Bitrix24, Мой склад, Google Drive.',
            complexity: 'very-high',
            complexityLabel: 'Очень высокая',
            duration: '6 месяцев',
            features: [
                'Интерактивный конструктор дверей',
                'Динамический расчёт стоимости',
                'Генерация Word/PDF договоров',
                'Интеграция Bitrix24 + Мой склад',
                'Google Drive для документов',
                'Многоуровневая ролевая модель',
                'Telegram-уведомления',
                'Промокоды и скидки'
            ],
            tech: ['Laravel', 'Vue 3', 'MySQL', 'Bitrix24 API', 'Мой склад API']
        },

        // ===== HIGH-LOAD =====
        {
            id: 'vulcan-forged',
            title: 'Vulcan Forged',
            category: 'highload',
            categoryLabel: 'High-Load / Web3',
            icon: '🌋',
            description: 'Web3-гейминг платформа с NFT и метавселенной VulcanVerse на блокчейне Elysium',
            fullDescription: 'Разработка серверной части игровых сервисов для экосистемы блокчейн-игр с высоконагруженной инфраструктурой.',
            complexity: 'very-high',
            complexityLabel: 'Очень высокая',
            duration: '3 года',
            features: [
                'Серверные сервисы на .NET Core',
                'Интеграция с блокчейн Elysium',
                'MS SQL с оптимизацией хранимых процедур',
                'CI/CD через GitLab',
                'Распределённая архитектура',
                'Мониторинг и логирование',
                'Code review и архитектурные решения',
                'Поддержка продакшн-среды'
            ],
            tech: ['.NET Core', 'MS SQL', 'Redis', 'MongoDB', 'WebSocket', 'GitLab CI']
        },
        {
            id: 'crypto-soyuz',
            title: 'Crypto-союз',
            category: 'highload',
            categoryLabel: 'High-Load / FinTech',
            icon: '₿',
            description: 'MLM-платформа криптовалютного клуба с биржевым стаканом и мультивалютным кошельком',
            fullDescription: 'Инвестиционная платформа с 8 уровнями лицензий, бинарной и линейной структурами, внутренним обменником и интеграцией с крипто-шлюзами.',
            complexity: 'very-high',
            complexityLabel: 'Очень высокая',
            duration: '6 месяцев',
            features: [
                '8 уровней лицензий',
                'Бинарная + линейная рефералка',
                'Биржевой стакан лицензий',
                'Мультивалютный кошелёк (vUSDT/WUSDT)',
                'WestWallet интеграция',
                'Еженедельные бонусы с "схлопыванием"',
                'Совет Лидеров с ТОП-20',
                'Cron-задачи начислений'
            ],
            tech: ['Laravel', 'MySQL', 'WestWallet API', 'Binance API', 'Cron']
        },
        {
            id: 'betroute',
            title: 'BetRoute',
            category: 'highload',
            categoryLabel: 'High-Load / Betting',
            icon: '🎰',
            description: 'ERP/CRM-система для букмекерских контор: десктоп, мобильные клиенты, live-ставки',
            fullDescription: 'Комплексное корпоративное решение с приёмом ставок, расчётом коэффициентов, live-обновлениями и интеграцией с внешним оборудованием.',
            complexity: 'very-high',
            complexityLabel: 'Очень высокая',
            duration: '3 года',
            features: [
                'WPF и WinForms десктоп-клиенты',
                'Android-приложение на Xamarin',
                'REST и WCF сервисы',
                'Интеграция с камерами и сканерами',
                'Live-обновления данных',
                'MSSQL + SQLite',
                'Миграция с .NET Framework на Core',
                'Масштабный рефакторинг'
            ],
            tech: ['.NET Framework', '.NET Core', 'WPF', 'Xamarin', 'MSSQL', 'WCF']
        },

        // ===== WEB PLATFORMS =====
        {
            id: 'tvoya-respublika',
            title: 'Твоя республика',
            category: 'web',
            categoryLabel: 'Веб-платформа',
            icon: '🏛️',
            description: 'Система мониторинга городской инфраструктуры: мобильное приложение, админка, Telegram/VK-боты',
            fullDescription: 'Многоплатформенная система сбора проблемных ситуаций с геолокацией, тепловыми картами и автоматической отправкой в исполнительные органы.',
            complexity: 'very-high',
            complexityLabel: 'Очень высокая',
            duration: '6 месяцев',
            features: [
                'Flutter-приложение с геолокацией',
                'Рейтинг заявок по полноте данных',
                'Тепловые карты проблемных зон',
                'Telegram/VK-боты',
                'Автоматическая отправка в госорганы',
                'Многоуровневая ролевая модель',
                'PDF-отчёты по заявкам',
                'SMS-шлюз и push-уведомления'
            ],
            tech: ['Laravel', 'Flutter', 'Nuxt.js', 'PostgreSQL', 'Telegram Bot API']
        },
        {
            id: 'kislovodsk',
            title: 'Туризм Кисловодск',
            category: 'web',
            categoryLabel: 'Веб-платформа',
            icon: '🏔️',
            description: 'Туристическая платформа города: агрегатор туров, бронирование, ЛК туристов и агентств',
            fullDescription: 'Многофункциональный сайт-агрегатор с системой бронирования, чатами, рейтингами и интеграцией с платёжными системами.',
            complexity: 'high',
            complexityLabel: 'Высокая',
            duration: '5 месяцев',
            features: [
                'Каталог туров с фильтрацией',
                'Система бронирования с оплатами',
                '5 ролей пользователей',
                'Чат турист ↔ гид',
                'Интерактивные карты маршрутов',
                'Мультиязычность (RU/EN)',
                'WebSocket-уведомления',
                'Redis-кеширование'
            ],
            tech: ['Laravel', 'Vue 3', 'PostgreSQL', 'ЮKassa', 'WebSocket']
        },
        {
            id: 'panda-padel',
            title: 'Panda Padel',
            category: 'web',
            categoryLabel: 'Веб-платформа',
            icon: '🎾',
            description: 'Платформа управления спортивным клубом с онлайн-бронированием кортов',
            fullDescription: 'Система для padel-клуба: каталог кортов, расписание, ЛК клиентов, тренеры, мобильное приложение.',
            complexity: 'high',
            complexityLabel: 'Высокая',
            duration: '14 недель',
            features: [
                'Онлайн-бронирование площадок',
                'Календарь занятости кортов',
                'ЛК клиентов и тренеров',
                'CRM для администраторов',
                'Система лояльности',
                'Онлайн-оплата',
                'React Native приложение',
                'REST API'
            ],
            tech: ['Laravel', 'Vue.js', 'PostgreSQL', 'React Native']
        },
        {
            id: 'your-beauty',
            title: 'YourOwn Beauty',
            category: 'web',
            categoryLabel: 'Веб-платформа / CRM',
            icon: '💅',
            description: 'CRM и платформа лояльности для салонов красоты',
            fullDescription: 'Управление клиентской базой, бонусами, акциями и автоматизация бизнес-процессов салонов красоты.',
            complexity: 'high',
            complexityLabel: 'Высокая',
            duration: '10 недель',
            features: [
                'Учёт посещений клиентов',
                'Бонусная накопительная система',
                'Сегментация клиентской базы',
                'Личные кабинеты',
                'Аналитика активности',
                'REST API для интеграций',
                'Управление ролями',
                'Система уведомлений'
            ],
            tech: ['Laravel', 'Vue.js', 'MySQL', 'REST API', 'Swagger']
        },
        {
            id: 'v-put',
            title: 'Клуб "В ПУТЬ"',
            category: 'web',
            categoryLabel: 'Веб-платформа',
            icon: '🧭',
            description: 'Туристическая платформа с каталогом туров, магазином атрибутики и обучающими курсами',
            fullDescription: 'Презентация туристических услуг, интернет-магазин, анонсы экспедиций и публикация отзывов участников.',
            complexity: 'high',
            complexityLabel: 'Высокая',
            duration: '5 месяцев',
            features: [
                'Каталог путешествий',
                'Анонсы мероприятий',
                'Интернет-магазин атрибутики',
                'Отзывы участников',
                'Обучающие курсы',
                'Админ-панель',
                'SEO-оптимизация',
                'Адаптивная вёрстка'
            ],
            tech: ['Laravel', 'Vue 3', 'MySQL', 'Bootstrap 5']
        },
        {
            id: 'master-kit',
            title: 'Мастер Кит',
            category: 'web',
            categoryLabel: 'Веб-платформа',
            icon: '👥',
            description: 'Виртуальное сообщество: Telegram-бот, биллинг, закрытые каналы, геймификация',
            fullDescription: 'Сообщество с подписочной моделью, модерацией чатов, статусами и детальной аналитикой активности.',
            complexity: 'high',
            complexityLabel: 'Высокая',
            duration: '3 месяца',
            features: [
                'Telegram-бот с биллингом',
                'Закрытые каналы по подписке',
                'Автоматическая модерация чатов',
                'Геймификация и статусы',
                'Массовые рассылки',
                'Веб-админка',
                'Аналитика активности',
                'Интеграция с лендингами'
            ],
            tech: ['Python', 'FastAPI', 'Aiogram', 'PostgreSQL', 'Redis', 'Celery']
        },
        {
            id: 'wolmar-auction',
            title: 'Платформа аукционов',
            category: 'web',
            categoryLabel: 'Веб-платформа',
            icon: '🔨',
            description: 'Онлайн-аукционы на 1С-Битрикс с автопарсингом Wolmar',
            fullDescription: 'Специализированная платформа с автоматическим парсингом данных через Selenium и синхронизацией через Cron.',
            complexity: 'high',
            complexityLabel: 'Высокая',
            duration: '4 месяца',
            features: [
                'CMS 1С-Битрикс',
                'Аукционная система торгов',
                'Парсинг Wolmar через Selenium',
                'Автосинхронизация через Cron',
                'Импорт изображений и описаний',
                'Оптимизация БД',
                'SEO-структура',
                'Админ-панель'
            ],
            tech: ['1С-Битрикс', 'PHP', 'MySQL', 'Selenium', 'Cron']
        },
        {
            id: 'salero',
            title: 'Salero.io',
            category: 'web',
            categoryLabel: 'SaaS-платформа',
            icon: '📈',
            description: 'SaaS для аналитики и увеличения продаж на Wildberries',
            fullDescription: 'Модульная платформа с алертами, расчётом автозаказа, ABC-анализом и финансовым моделированием.',
            complexity: 'high',
            complexityLabel: 'Высокая',
            duration: '6 месяцев',
            features: [
                'Алерты с уведомлениями',
                'Расчёт автозаказа на WB',
                'ABC-анализ матрицы товаров',
                'Финансовые графики',
                'Формула оборачиваемости',
                'XLS/PDF отчёты',
                'Wildberries API',
                'Лендинг с trial-периодом'
            ],
            tech: ['Laravel', 'Vue.js', 'MySQL', 'Wildberries API', 'Chart.js']
        },
        {
            id: 'samovykup',
            title: 'Самовыкуп',
            category: 'web',
            categoryLabel: 'SaaS-платформа',
            icon: '🛍️',
            description: 'SaaS для автоматизации самовыкупов на Wildberries и Ozon',
            fullDescription: 'Платформа продвижения товаров с управлением пулом аккаунтов, прокси, биллингом и аналитикой позиций.',
            complexity: 'high',
            complexityLabel: 'Высокая',
            duration: '8 месяцев',
            features: [
                'Парсинг WB/Ozon API',
                'Пул аккаунтов с прокси',
                'Внутренний биллинг',
                'Планирование отзывов',
                'Отслеживание позиций',
                'Excel-отчёты',
                'Тарифные планы',
                'Swagger API'
            ],
            tech: ['Laravel', 'PostgreSQL', 'Wildberries API', 'Ozon API', 'Swagger']
        },
        {
            id: 'emojis-wiki',
            title: 'emojis.wiki',
            category: 'web',
            categoryLabel: 'Веб-платформа',
            icon: '😀',
            description: 'Энциклопедия эмодзи с интерактивной клавиатурой на 7 языках',
            fullDescription: 'Информационный портал со значениями эмодзи, примерами использования и мультиязычным интерфейсом.',
            complexity: 'medium',
            complexityLabel: 'Средняя',
            duration: '3 месяца',
            features: [
                'Emoji Keyboard',
                'Копирование в буфер',
                'Каталог по категориям',
                'Поиск по названию',
                '7 языков интерфейса',
                'Страницы значений',
                'Комбинации эмодзи',
                'Mobile-first дизайн'
            ],
            tech: ['Node.js', 'Vue 3', 'i18n', 'REST API']
        },
        {
            id: 'mpsпот',
            title: 'MPSPOT Admin',
            category: 'web',
            categoryLabel: 'Веб-платформа / CRM',
            icon: '⚙️',
            description: 'Кастомизация административной панели с интеграцией бэкенда',
            fullDescription: 'Доработка UI-шаблона CRM, подвязка интерфейса к реальным данным и адаптация под бизнес-задачи.',
            complexity: 'medium',
            complexityLabel: 'Средняя',
            duration: '4 месяца',
            features: [
                'Кастомизация шаблона',
                'Биндинг к бэкенду',
                'Вывод реальных данных',
                'Адаптация UI-компонентов',
                'Поддержка кода',
                'Webpack-сборка',
                'SCSS-стилизация',
                'npm-пакеты'
            ],
            tech: ['Vue.js', 'Bootstrap', 'SCSS', 'Webpack']
        },

        // ===== E-COMMERCE =====
        {
            id: 'leoflowers',
            title: 'LeoFlowers',
            category: 'ecommerce',
            categoryLabel: 'E-Commerce / High-Load',
            icon: '🌸',
            description: 'Высоконагруженный интернет-магазин цветов с кастомной логикой',
            fullDescription: 'Глубокая кастомизация OpenCart, разработка модулей с нуля, два типа ЛК и динамический расчёт доставки.',
            complexity: 'high',
            complexityLabel: 'Высокая',
            duration: '4 месяца',
            features: [
                'Кастомизация OpenCart',
                'Модуль расчёта доставки',
                'Два ЛК: клиент и партнёр',
                'Реферальная программа',
                'Промокоды и скидки',
                'Защита от дублирования',
                'Корзина и оформление',
                'Уведомления'
            ],
            tech: ['OpenCart', 'PHP', 'MySQL']
        },
        {
            id: 'foxshop',
            title: 'FoxShop',
            category: 'ecommerce',
            categoryLabel: 'E-Commerce',
            icon: '🦊',
            description: 'Интернет-магазин с личным кабинетом и системой скидок',
            fullDescription: 'Полноценный магазин с каталогом, фильтрами, корзиной, ЛК и аналитикой заказов.',
            complexity: 'medium',
            complexityLabel: 'Средняя',
            duration: '6 недель',
            features: [
                'Каталог с фильтрацией',
                'Корзина и оформление',
                'Личный кабинет',
                'Система скидок',
                'Аналитика заказов',
                'REST API',
                'SEO-оптимизация',
                'Адаптивная вёрстка'
            ],
            tech: ['Laravel', 'MySQL', 'Bootstrap 5', 'REST API']
        },
        {
            id: 'goodiets',
            title: 'Goodiets',
            category: 'ecommerce',
            categoryLabel: 'E-Commerce',
            icon: '🥗',
            description: 'Информационно-коммерческий сайт в нише фитнес-питания',
            fullDescription: 'Платформа здорового образа жизни с внутренним чатом в реальном времени и системой уведомлений.',
            complexity: 'medium',
            complexityLabel: 'Средняя',
            duration: '5 месяцев',
            features: [
                'Чат в реальном времени',
                'Система уведомлений',
                'UI/UX обновление',
                'Серверная логика',
                'Рефакторинг кода',
                'WebSocket',
                'Адаптивная вёрстка',
                'Оптимизация'
            ],
            tech: ['Vue.js', 'Nuxt', 'Laravel', 'WebSockets']
        },
        {
            id: 'cashman',
            title: 'CashMan',
            category: 'ecommerce',
            categoryLabel: 'Telegram Mini App',
            icon: '💵',
            description: 'Платформа мини-магазинов в Telegram с интеграцией iiko и Frontpad',
            fullDescription: 'Telegram Mini Apps для автоматизации доставки еды с СБП, лояльностью, геймификацией и CRM.',
            complexity: 'high',
            complexityLabel: 'Высокая',
            duration: '4 месяца',
            features: [
                'Telegram Mini Apps',
                'Интеграция iiko и Frontpad',
                'Оплата через СБП',
                'Кэшбэк и бонусы',
                'Колесо Фортуны',
                'Реферальная программа',
                'CRM и аналитика',
                'Интеграция с 1С, AmoCRM'
            ],
            tech: ['Laravel', 'Vue 3', 'Telegram Bot API', 'СБП API', 'PWA']
        },

        // ===== GAMING =====
        {
            id: 'money-cup',
            title: 'Money Cup',
            category: 'gaming',
            categoryLabel: 'Игровая / P2P',
            icon: '🏆',
            description: 'P2P-маркетплейс киберспортивных сделок с арбитражем и турнирами',
            fullDescription: 'Агрегатор киберспортивных сделок с автоматической генерацией сеток, чатом с модератором и мультивалютным кошельком.',
            complexity: 'very-high',
            complexityLabel: 'Очень высокая',
            duration: '7 месяцев',
            features: [
                'Автогенерация турнирных сеток',
                'Real-time чат с модератором',
                'Арбитраж сделок',
                'Мультиязычность (4 языка)',
                'OAuth (FB, Google, Discord, Twitch)',
                'Распределение призовых',
                'Крипто/фиат платежи',
                'Google Analytics + Вебвизор'
            ],
            tech: ['Laravel', 'Vue.js', 'WebSockets', 'Redis']
        },

        // ===== FINTECH =====
        {
            id: 'lekary',
            title: 'Lekary',
            category: 'fintech',
            categoryLabel: 'FinTech / MLM',
            icon: '💊',
            description: 'MLM-платформа БАДов с Zoom-консультациями и 14 квалификациями',
            fullDescription: 'Сетевой маркетинг с бинарной/линейной структурами, 5 видами бонусов, Zoom-консультациями и крипто-выплатами.',
            complexity: 'very-high',
            complexityLabel: 'Очень высокая',
            duration: '13 месяцев',
            features: [
                'Бинарная + линейная структуры',
                '5 видов бонусов',
                '14 карьерных квалификаций',
                'Zoom-консультации',
                'BTC Alpha интеграция',
                'Автоматические выплаты',
                '3 роли пользователей',
                'Система тестов'
            ],
            tech: ['Laravel', 'Vue.js', 'Zoom API', 'BTC Alpha API', 'MySQL']
        },
        {
            id: 'lotofond',
            title: 'Lotofond',
            category: 'fintech',
            categoryLabel: 'FinTech / Агрегатор',
            icon: '📜',
            description: 'Агрегатор торгов по банкротству и залоговому имуществу',
            fullDescription: 'Fullstack-приложение с SOAP-интеграциями, REST API и адаптивным каталогом торгов.',
            complexity: 'high',
            complexityLabel: 'Высокая',
            duration: '10 месяцев',
            features: [
                'SOAP-интеграции',
                'REST API + Swagger',
                'Фильтрация лотов',
                'Личный кабинет',
                'Vue 3 фронтенд',
                'Laravel backend',
                'Адаптивный UI',
                'Оптимизация'
            ],
            tech: ['Laravel', 'Vue 3', 'MySQL', 'SOAP', 'Swagger']
        },

        // ===== INDUSTRIAL =====
        {
            id: 'sdm',
            title: 'СДМ',
            category: 'industrial',
            categoryLabel: 'Промышленная система',
            icon: '🚦',
            description: 'Система дистанционного мониторинга дорожного движения',
            fullDescription: 'Комплексная платформа с обработкой видеопотоков, интеграцией камер и микросервисом парсинга погодных данных.',
            complexity: 'very-high',
            complexityLabel: 'Очень высокая',
            duration: '5 лет',
            features: [
                'Обработка видеопотоков',
                'Распознавание нарушений',
                'Python FastAPI микросервис',
                'Интеграция камер (АвтоИнтеллект, Кордон)',
                'Парсинг погоды',
                'Celery + Redis',
                'Swagger документация',
                'Адаптивный веб-клиент'
            ],
            tech: ['Laravel', 'Python', 'FastAPI', 'Vue.js', 'PostgreSQL', 'OpenCV']
        },
        {
            id: 'interceptor',
            title: 'Interceptor',
            category: 'industrial',
            categoryLabel: 'Промышленная система',
            icon: '📡',
            description: 'Система быстрого детектирования проездов с интеграцией камер',
            fullDescription: 'Клиент-серверное приложение с WPF-интерфейсом и интеграцией камер фиксации (Кордон, Мираж, Интегра).',
            complexity: 'high',
            complexityLabel: 'Высокая',
            duration: '2 года',
            features: [
                'WPF десктоп-клиент',
                'T-SQL запросы',
                'Интеграция камер',
                'REST API + WebSocket',
                'Микросервисы',
                'Crystal Reports',
                'Code review',
                'GitLab CI'
            ],
            tech: ['C#', '.NET', 'WPF', 'MSSQL', 'WebSocket']
        },
        {
            id: 'allotrans',
            title: 'Allotrans',
            category: 'industrial',
            categoryLabel: 'B2B / Логистика',
            icon: '🚚',
            description: 'Аукцион логистики: грузоперевозки и частные переезды',
            fullDescription: 'Маркетплейс с системой скрытых ставок, верификацией перевозчиков и эскроу-оплатой комиссии.',
            complexity: 'high',
            complexityLabel: 'Высокая',
            duration: '4 месяца',
            features: [
                'Аукцион со скрытыми ставками',
                'Калькулятор кубатуры',
                'Верификация перевозчиков',
                'Эскроу-оплата',
                'Фильтрация контактов в чате',
                'Рейтинги и отзывы',
                'Push/SMS/Email уведомления',
                'Гибкая комиссия'
            ],
            tech: ['Laravel', 'Vue.js', 'MySQL', 'Visa/Mastercard']
        },
        {
            id: 'sportbaza',
            title: 'Спортбаза.рф',
            category: 'industrial',
            categoryLabel: 'B2B-маркетплейс',
            icon: '⚽',
            description: 'Каталог спортивных объектов с тендерной системой и эскроу',
            fullDescription: 'Маркетплейс аренды с тремя режимами отображения, арбитражем и финансовым модулем.',
            complexity: 'very-high',
            complexityLabel: 'Очень высокая',
            duration: '13 месяцев',
            features: [
                '3 режима отображения',
                'Тендерная система',
                'Эскроу-оплата',
                'Арбитраж споров',
                'Генерация PDF-смет',
                'Real-time чат',
                'OAuth авторизация',
                'VIP-продвижение'
            ],
            tech: ['Laravel', 'Vue.js', 'MySQL', 'WebSocket', 'Яндекс.Карты']
        },

        // ===== EDUCATION =====
        {
            id: 'rosvuz',
            title: 'Rosvuz School',
            category: 'education',
            categoryLabel: 'Образование / LMS',
            icon: '🎓',
            description: 'Онлайн-школа с системой дистанционного обучения',
            fullDescription: 'LMS-платформа с внутренним чатом, уведомлениями и периодическим внедрением новых модулей.',
            complexity: 'medium',
            complexityLabel: 'Средняя',
            duration: 'Поддержка',
            features: [
                'Образовательная платформа',
                'Внутренний чат',
                'Система уведомлений',
                'UI/UX обновления',
                'Серверная логика',
                'Адаптивная вёрстка',
                'Оптимизация кода',
                'Поддержка'
            ],
            tech: ['Vue.js', 'Nuxt', 'Laravel', 'WebSockets']
        },
        {
            id: 'doctor-reutov',
            title: 'Доктор Реутов',
            category: 'education',
            categoryLabel: 'Образование / Медицина',
            icon: '🧠',
            description: 'Медицинский портал с интерактивными тестами по неврологии',
            fullDescription: 'Образовательный портал с динамическими тестами и интеграцией с серверной логикой.',
            complexity: 'medium',
            complexityLabel: 'Средняя',
            duration: '2 месяца',
            features: [
                'Интерактивные тесты на Vue',
                'Динамические UI',
                'Обработка ответов',
                'Отображение результатов',
                'Медицинские модули',
                'UX-оптимизация',
                'Webpack-сборка',
                'Поддержка кода'
            ],
            tech: ['Vue.js', 'PHP', 'Webpack']
        },

        // ===== CORPORATE =====
        {
            id: 'nof',
            title: 'СК NOF',
            category: 'corporate',
            categoryLabel: 'Корпоративный сайт',
            icon: '🏗️',
            description: 'Сайт строительной компании с каталогом объектов и админ-панелью',
            fullDescription: 'Презентация строительной компании с демонстрацией проектов, объектов недвижимости и удобным управлением контентом.',
            complexity: 'medium',
            complexityLabel: 'Средняя',
            duration: '4 месяца',
            features: [
                'Авторский дизайн',
                'Каталог объектов',
                'Страницы услуг',
                'Формы обратной связи',
                'Админ-панель',
                'SEO-оптимизация',
                'REST API',
                'Адаптивная вёрстка'
            ],
            tech: ['Laravel', 'MySQL', 'Bootstrap']
        },
        {
            id: 'petrostone',
            title: 'PetroStone',
            category: 'corporate',
            categoryLabel: 'Корпоративный сайт',
            icon: '🪨',
            description: 'Сайт производителя натурального камня с каталогом и мультиязычностью',
            fullDescription: 'Корпоративный сайт с каталогом продукции, галереей проектов и мультиязычной поддержкой.',
            complexity: 'medium',
            complexityLabel: 'Средняя',
            duration: '5 недель',
            features: [
                'Каталог видов камня',
                'Карточки товаров',
                'Галерея проектов',
                'Мультиязычность',
                'Формы расчёта',
                'ACF Pro',
                'Swiper/Slick',
                'SEO-оптимизация'
            ],
            tech: ['WordPress', 'PHP', 'MySQL', 'ACF', 'Swiper']
        },
        {
            id: 'ket33',
            title: 'КЭТ33',
            category: 'corporate',
            categoryLabel: 'Корпоративный сайт',
            icon: '⚙️',
            description: 'Сайт компании по продаже и обслуживанию оборудования',
            fullDescription: 'Полностью кастомная WordPress-тема без готовых шаблонов с каталогом оборудования.',
            complexity: 'medium',
            complexityLabel: 'Средняя',
            duration: '4 недели',
            features: [
                'Кастомная тема WP',
                'Каталог оборудования',
                'Формы заявок',
                'SEO-структура',
                'Оптимизация скорости',
                'Управление медиа',
                'Адаптивная вёрстка',
                'Интеграция плагинов'
            ],
            tech: ['WordPress', 'PHP', 'MySQL']
        },
        {
            id: 'booster-rus',
            title: 'Booster Rus',
            category: 'corporate',
            categoryLabel: 'Корпоративный сайт',
            icon: '🔥',
            description: 'Сайт поставщика промышленного котельного оборудования',
            fullDescription: 'Многостраничный B2B-сайт с каталогом оборудования и лидогенерацией.',
            complexity: 'medium',
            complexityLabel: 'Средняя',
            duration: '5 недель',
            features: [
                'Каталог оборудования',
                'B2B-заявки',
                'Лидогенерация',
                'Админ-панель',
                'ЧПУ и мета-теги',
                'Кеширование',
                'Антиспам',
                'SEO-подготовка'
            ],
            tech: ['WordPress', 'PHP', 'MySQL']
        },
        {
            id: 'tola-ai',
            title: 'Tola AI',
            category: 'corporate',
            categoryLabel: 'Лендинг',
            icon: '🤖',
            description: 'Маркетинговый лендинг AI-сервиса',
            fullDescription: 'Продающая страница с hero-блоком, преимуществами и CTA-блоками, подготовленная под рекламный трафик.',
            complexity: 'medium',
            complexityLabel: 'Средняя',
            duration: '3 недели',
            features: [
                'Mobile First',
                'Hero-блок',
                'Тарифные планы',
                'CTA-блоки',
                'Лидогенерация',
                'Оптимизация скорости',
                'Подготовка под трафик',
                'Масштабируемая структура'
            ],
            tech: ['WordPress', 'PHP']
        },
        {
            id: 'belyi-parus',
            title: 'Белый парус',
            category: 'corporate',
            categoryLabel: 'Лендинг / HoReCa',
            icon: '⛵',
            description: 'Продающий лендинг для B2B-поставщика в сегменте HoReCa',
            fullDescription: 'Одностраничный сайт-каталог с деревянной текстурой, программой лояльности и логотипами клиентов.',
            complexity: 'medium',
            complexityLabel: 'Средняя',
            duration: '2 месяца',
            features: [
                'Стильный дизайн',
                'Каталог товаров',
                'Программа лояльности',
                'Логотипы партнёров',
                'Блок преимуществ',
                'Mobile-first',
                'Hover-эффекты',
                'Иконки соцсетей'
            ],
            tech: ['HTML5', 'SCSS', 'JavaScript', 'Bootstrap']
        }
    ];

    // ===== PORTFOLIO: RENDER =====
    var portfolioGrid = document.getElementById('portfolio-grid');
    var portfolioMoreBtn = document.getElementById('portfolio-more');
    var INITIAL_SHOW = 9;
    var currentShowCount = INITIAL_SHOW;
    var currentFilter = 'all';

    function getFilteredProjects() {
        if (currentFilter === 'all') return projectsData;
        return projectsData.filter(function (p) { return p.category === currentFilter; });
    }

    function renderProjects() {
        if (!portfolioGrid) return;

        var filtered = getFilteredProjects();
        var toShow = filtered.slice(0, currentShowCount);

        portfolioGrid.innerHTML = '';

        toShow.forEach(function (project, index) {
            var card = document.createElement('article');
            card.className = 'project-card';
            card.setAttribute('data-project-id', project.id);
            card.setAttribute('data-category', project.category);
            card.style.animationDelay = (index * 0.05) + 's';

            // Tech tags (max 3)
            var techHtml = '';
            var visibleTech = project.tech.slice(0, 3);
            visibleTech.forEach(function (t) {
                techHtml += '<span class="tag">' + t + '</span>';
            });
            if (project.tech.length > 3) {
                techHtml += '<span class="project-card__tech-more">+' + (project.tech.length - 3) + '</span>';
            }

            card.innerHTML = '' +
                '<div class="project-card__header">' +
                '<div class="project-card__icon">' + project.icon + '</div>' +
                '<div class="project-card__header-info">' +
                '<span class="project-card__category">' + project.categoryLabel + '</span>' +
                '<h3 class="project-card__title">' + project.title + '</h3>' +
                '</div>' +
                '</div>' +
                '<div class="project-card__body">' +
                '<p class="project-card__description">' + project.description + '</p>' +
                '<div class="project-card__meta">' +
                '<span class="complexity-badge complexity-badge--' + project.complexity + '">' + project.complexityLabel + '</span>' +
                '<span class="project-card__meta-item">' +
                '<span class="project-card__meta-icon">⏱️</span>' + project.duration +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div class="project-card__tech">' + techHtml + '</div>' +
                '<div class="project-card__footer">' +
                '<span class="project-card__cta">' +
                'Подробнее ' +
                '<span class="project-card__cta-arrow">→</span>' +
                '</span>' +
                '</div>';

            card.addEventListener('click', function () {
                openProjectModal(project);
            });

            portfolioGrid.appendChild(card);
        });

        // Show/hide "load more" button
        if (portfolioMoreBtn) {
            if (currentShowCount >= filtered.length) {
                portfolioMoreBtn.classList.add('btn--hidden');
            } else {
                portfolioMoreBtn.classList.remove('btn--hidden');
                portfolioMoreBtn.innerHTML = 'Показать ещё (' + (filtered.length - currentShowCount) + ') <span class="btn__arrow">↓</span>';
            }
        }
    }

    // ===== FILTER COUNTS =====
    function updateFilterCounts() {
        var allCount = projectsData.length;
        document.querySelectorAll('[data-count-all]').forEach(function (el) {
            el.textContent = allCount;
        });
        document.querySelectorAll('[data-count]').forEach(function (el) {
            var category = el.getAttribute('data-count');
            if (category === 'all') return;
            var count = projectsData.filter(function (p) { return p.category === category; }).length;
            el.textContent = count;
        });
    }

    // ===== FILTERS HANDLERS =====
    var filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('filter-btn--active'); });
            this.classList.add('filter-btn--active');
            currentFilter = this.getAttribute('data-filter');
            currentShowCount = INITIAL_SHOW;
            renderProjects();
        });
    });

    // ===== LOAD MORE =====
    if (portfolioMoreBtn) {
        portfolioMoreBtn.addEventListener('click', function () {
            currentShowCount += 6;
            renderProjects();
        });
    }

    // ===== MODAL =====
    var projectModal = document.getElementById('project-modal');
    var projectModalBody = document.getElementById('project-modal-body');

    function openProjectModal(project) {
        if (!projectModal || !projectModalBody) return;

        // Build features list
        var featuresHtml = '';
        project.features.forEach(function (f) {
            featuresHtml += '<li>' + f + '</li>';
        });

        // Build tech stack
        var techHtml = '';
        project.tech.forEach(function (t) {
            techHtml += '<span class="tag">' + t + '</span>';
        });

        projectModalBody.innerHTML = '' +
            '<div class="modal-project__header">' +
            '<div class="modal-project__icon">' + project.icon + '</div>' +
            '<div class="modal-project__header-info">' +
            '<span class="modal-project__category">' + project.categoryLabel + '</span>' +
            '<h2 class="modal-project__title">' + project.title + '</h2>' +
            '<div class="modal-project__meta">' +
            '<span class="complexity-badge complexity-badge--' + project.complexity + '">' + project.complexityLabel + '</span>' +
            '<span class="project-card__meta-item">' +
            '<span class="project-card__meta-icon">⏱️</span>' + project.duration +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="modal-project__section">' +
            '<h3 class="modal-project__section-title">О проекте</h3>' +
            '<p class="modal-project__description">' + project.fullDescription + '</p>' +
            '</div>' +

            '<div class="modal-project__section">' +
            '<h3 class="modal-project__section-title">Ключевые возможности</h3>' +
            '<ul class="modal-project__features">' + featuresHtml + '</ul>' +
            '</div>' +

            '<div class="modal-project__section">' +
            '<h3 class="modal-project__section-title">Технологический стек</h3>' +
            '<div class="modal-project__tech">' + techHtml + '</div>' +
            '</div>';

        projectModal.classList.add('project-modal--visible');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove('project-modal--visible');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Close handlers
    document.querySelectorAll('[data-modal-close]').forEach(function (el) {
        el.addEventListener('click', closeProjectModal);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('project-modal--visible')) {
            closeProjectModal();
        }
    });

    // ===== INIT PORTFOLIO =====
    updateFilterCounts();
    renderProjects();

    // ===== SCROLL ANIMATIONS =====
    function animateOnScroll() {
        var elements = document.querySelectorAll('[data-animate="fade-up"]:not(.animated)');
        elements.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            var windowHeight = window.innerHeight;
            if (rect.top < windowHeight - 80) {
                el.classList.add('animated');
            }
        });
    }

    window.addEventListener('scroll', animateOnScroll, { passive: true });
    window.addEventListener('load', animateOnScroll);

    // ===== FORM SUBMISSION (AJAX) =====
    var forms = document.querySelectorAll('.contact-form');
    var toast = document.getElementById('toast');

    function showToast(message, isError) {
        if (!toast) return;
        var icon = toast.querySelector('.toast__icon');
        var text = toast.querySelector('.toast__text');
        if (icon) icon.textContent = isError ? '❌' : '✅';
        if (text) text.textContent = message || 'Сообщение отправлено! Скоро свяжемся с вами.';
        toast.classList.add('toast--visible');
        setTimeout(function () {
            toast.classList.remove('toast--visible');
        }, 4000);
    }

    forms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var formData = new FormData(form);
            var submitBtn = form.querySelector('button[type="submit"]');
            var originalText = submitBtn.textContent;

            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';

            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(function (response) { return response.json(); })
            .then(function (data) {
                if (data.success) {
                    showToast(data.message, false);
                    form.reset();
                } else {
                    showToast(data.message || 'Ошибка отправки', true);
                }
            })
            .catch(function () {
                showToast('Ошибка сети. Попробуйте позже.', true);
            })
            .finally(function () {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
        });
    });

    // ===== UNIVERSAL COUNTER ANIMATION =====
    // Анимирует любые элементы с атрибутом data-count при появлении в viewport
    function animateCounter(el) {
        if (el.dataset.animated === 'true') return; // защита от повторного запуска
        el.dataset.animated = 'true';

        var target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) return;

        var duration = 1800; // мс
        var startTime = null;
        var startValue = 0;

        // Easing функция для плавного замедления
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var easedProgress = easeOutCubic(progress);
            var currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

            el.textContent = currentValue;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }

        window.requestAnimationFrame(step);
    }

    // IntersectionObserver для автозапуска анимации при появлении
    if ('IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var counters = entry.target.querySelectorAll('[data-count]');
                    counters.forEach(function (counter, index) {
                        // Небольшая задержка для каждого следующего счётчика
                        setTimeout(function () {
                            animateCounter(counter);
                        }, index * 120);
                    });
                    counterObserver.unobserve(entry.target); // запускаем только один раз
                }
            });
        }, {
            threshold: 0.3, // 30% элемента должно быть видно
            rootMargin: '0px 0px -50px 0px'
        });

        // Наблюдаем за всеми блоками со счётчиками
        document.querySelectorAll('.hero__stats, .portfolio-summary').forEach(function (section) {
            counterObserver.observe(section);
        });
    } else {
        // Fallback для старых браузеров — просто показываем финальные значения
        document.querySelectorAll('[data-count]').forEach(function (el) {
            el.textContent = el.getAttribute('data-count');
        });
    }

    // ===== ACTIVE NAV LINK ON SCROLL =====
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav__link');

    function highlightNav() {
        var scrollPos = window.pageYOffset + 200;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('nav__link--active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('nav__link--active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ===== CONSENT CHECKBOX VALIDATION (ФЗ-152 + ФЗ-38) =====
    forms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            // Проверяем только обязательные согласия (ПДн + передача)
            var requiredConsents = form.querySelectorAll('input[name="consent_pd"], input[name="consent_transfer"]');
            var allChecked = true;

            requiredConsents.forEach(function (checkbox) {
                var group = checkbox.closest('.checkbox');
                if (!checkbox.checked) {
                    allChecked = false;
                    if (group) {
                        group.classList.add('checkbox--error');
                        setTimeout(function () {
                            group.classList.remove('checkbox--error');
                        }, 3000);
                    }
                }
            });

            if (!allChecked) {
                e.preventDefault();
                var firstError = form.querySelector('.checkbox--error input');
                if (firstError) firstError.focus();
                showToast('Необходимо дать обязательные согласия на обработку и передачу персональных данных', true);
                return false;
            }
        });
    });

    // ===== COOKIE BANNER =====
    var cookieBanner = document.getElementById('cookie-banner');
    var cookieAcceptAll = document.getElementById('cookie-accept-all');
    var cookieAcceptSelected = document.getElementById('cookie-accept-selected');
    var cookieReject = document.getElementById('cookie-reject');
    var cookieSettingsBtn = document.getElementById('cookie-settings-btn');
    var COOKIE_KEY = 'doit_cookie_consent';
    var CONSENT_VERSION = '1.0';

    function getCookiePreferences() {
        try {
            return JSON.parse(localStorage.getItem(COOKIE_KEY));
        } catch (e) {
            return null;
        }
    }

    function saveCookiePreferences(prefs) {
        prefs.version = CONSENT_VERSION;
        prefs.timestamp = new Date().toISOString();
        localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs));

        // Log consent to server
        fetch('process_form.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'form_type=cookie_consent' +
                  '&technical=' + (prefs.technical ? 1 : 0) +
                  '&analytics=' + (prefs.analytics ? 1 : 0) +
                  '&functional=' + (prefs.functional ? 1 : 0) +
                  '&consent_version=' + CONSENT_VERSION
        }).catch(function () { /* silent */ });
    }

    function hideCookieBanner() {
        if (cookieBanner) {
            cookieBanner.classList.remove('cookie-banner--visible');
        }
    }

    function showCookieBanner() {
        if (cookieBanner) {
            setTimeout(function () {
                cookieBanner.classList.add('cookie-banner--visible');
            }, 800);
        }
    }

    function applyPreferences(prefs) {
        if (prefs.analytics) {
            initAnalytics();
        }
    }

    // Placeholder for analytics
    function initAnalytics() {
        // Яндекс.Метрика / Google Analytics — подключить здесь
        console.log('[Analytics] Initialized with consent');
    }

    function handleCookieAction(action) {
        var prefs = {
            technical: true,
            analytics: false,
            functional: false
        };

        if (action === 'all') {
            prefs.analytics = true;
            prefs.functional = true;
        } else if (action === 'selected') {
            prefs.analytics = document.getElementById('cookie-analytics').checked;
            prefs.functional = document.getElementById('cookie-functional').checked;
        }
        // 'reject' — только технические

        saveCookiePreferences(prefs);
        applyPreferences(prefs);
        hideCookieBanner();
        showToast('Настройки cookies сохранены', false);
    }

    // Init
    var existing = getCookiePreferences();
    if (!existing) {
        showCookieBanner();
    } else {
        applyPreferences(existing);
    }

    if (cookieAcceptAll) {
        cookieAcceptAll.addEventListener('click', function () { handleCookieAction('all'); });
    }
    if (cookieAcceptSelected) {
        cookieAcceptSelected.addEventListener('click', function () { handleCookieAction('selected'); });
    }
    if (cookieReject) {
        cookieReject.addEventListener('click', function () { handleCookieAction('reject'); });
    }
    if (cookieSettingsBtn) {
        cookieSettingsBtn.addEventListener('click', function () {
            var prefs = getCookiePreferences() || { technical: true, analytics: false, functional: false };
            document.getElementById('cookie-analytics').checked = prefs.analytics;
            document.getElementById('cookie-functional').checked = prefs.functional;
            showCookieBanner();
        });
    }

    // Expose for privacy.html
    window.showCookieSettings = function () {
        if (cookieSettingsBtn) cookieSettingsBtn.click();
    };

    // ===== PROFILE LINK BUTTON: эффект свечения за курсором =====
    document.querySelectorAll('.profile-link-btn').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            var rect = btn.getBoundingClientRect();
            var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
            var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
            btn.style.setProperty('--x', x + '%');
            btn.style.setProperty('--y', y + '%');
        });
    });

    // ===== PROFILE MODAL DATA =====
    var profilesData = {
        gukay: {
            name: 'Алексей Гукай',
            role: 'Team Lead / Fullstack Developer',
            avatar: '👨‍💻',
            avatarClass: '',
            quote: 'Разрабатываю сложные системы, которые работают годами',
            bio: 'Senior fullstack разработчик с опытом более 10 лет. Специализация: сложные высоконагруженные системы, enterprise-решения, блокчейн-платформы. Преподаватель кафедры компьютерных технологий ДонНУ, наставник федеральной программы «Я в деле», соучредитель IT-компаний.',
            stats: [
                { value: '50+', label: 'проектов' },
                { value: '10+', label: 'лет опыта' },
                { value: '15+', label: 'технологий' }
            ],
            projects: [
                { name: 'ForesightZone', cat: 'AI Platform' },
                { name: 'Vulcan Forged', cat: 'Web3 Gaming' },
                { name: 'BetRoute', cat: 'Betting ERP' },
                { name: 'myChess', cat: 'Chess Platform' },
                { name: 'ГорВодоканал', cat: 'Enterprise ИС' }
            ],
            contacts: [
                { icon: '✈️', label: 'Telegram', value: '@gukay', href: 'https://t.me/exxxar' },
                { icon: '🌐', label: 'Сайт', value: 'гукай.рф', href: 'https://гукай.рф' },
                { icon: '📧', label: 'Email', value: 'exxxar@vk.com', href: 'mailto:exxxar@vk.com' }
            ]
        },
        shipilov: {
            name: 'Егор Шипилов',
            role: 'Entrepreneur / Marketing Director',
            avatar: '🚀',
            avatarClass: 'profile-modal__avatar--partner',
            quote: 'Я не просто рассказываю о бизнесе — я создавал его сам',
            bio: 'Предприниматель, маркетолог и создатель цифровых продуктов с 15+ годами опыта. Прошёл путь от классического ресторанного маркетинга и event-индустрии к созданию комплексных IT- и CRM-экосистем для бизнеса. Рабочая формула: <strong>ГИПОТЕЗА → ЗАПУСК → ИЗМЕРЕНИЕ → ВЫВОД → НОВЫЙ ЭКСПЕРИМЕНТ</strong>.',
            stats: [
                { value: '20+', label: 'собственных проектов' },
                { value: '1000+', label: 'рекламных кампаний' },
                { value: '1000+', label: 'мероприятий' },
                { value: '18', label: 'номеров журнала' }
            ],
            timeline: [
                { year: '2009', text: 'Старт медиапроекта Rest in Donetsk и компании Rest Service' },
                { year: '2014', text: 'Открытие первого ресторанного проекта «Аркадия»' },
                { year: '2014–2019', text: 'Активное развитие заведений и event-направления' },
                { year: '2020–2022', text: 'Создание Next Group и Next IT — переход к маркетинг + IT' },
                { year: '2026', text: 'Запуск проекта «Визит Донецк» — городское медиа 2.0' }
            ],
            projects: [
                { name: 'Аркадия', cat: 'Restaurant, 2014' },
                { name: 'Бочка', cat: 'Brewery, 2015' },
                { name: 'Большой Джон', cat: 'Pizza, 2016' },
                { name: 'E-Burger', cat: 'Burger, 2017' },
                { name: 'Куба', cat: 'Restaurant, 2017' },
                { name: 'Virus', cat: 'Night Club, 2015' },
                { name: 'IMAGINE', cat: 'Cafe, 2016' },
                { name: 'Пироги', cat: 'Cafe, 2018' },
                { name: 'Лица', cat: 'Night Club, 2018' },
                { name: 'Свинья', cat: 'Pub, 2017' },
                { name: 'Аркадия Beach', cat: 'Beach, 2019' },
                { name: 'iSushi', cat: 'Food, 2015' },
                { name: 'Дайнер', cat: 'Food, 2016' },
                { name: 'Burgers&iSushi', cat: 'Food, 2017' },
                { name: 'Fastoran', cat: 'Delivery, 2018' },
                { name: 'Азовская Креветка', cat: 'Resort, 2019' },
                { name: 'ЁЖ', cat: 'Gastropub, 2021' },
                { name: 'Шаурма на Углях', cat: 'Food, 2022' },
                { name: 'Обеды GO', cat: 'Food, 2023' },
                { name: 'Next IT', cat: 'IT-разработка, 2020' }
            ],
            speaking: [
                { city: 'Донецк', topic: 'Ресторанный маркетинг', year: '2018' },
                { city: 'Москва', topic: 'Маркетинг × IT', year: '2021' },
                { city: 'Санкт-Петербург', topic: 'Telegram как канал продаж', year: '2022' },
                { city: 'Ростов-на-Дону', topic: 'Событийный маркетинг', year: '2023' },
                { city: 'Краснодар', topic: 'Программы лояльности', year: '2024' },
                { city: 'Донецк', topic: 'Городское медиа 2.0', year: '2025' }
            ],
            contacts: [
                { icon: '✈️', label: 'Telegram', value: '@vkysnuu_marketing', href: 'https://t.me/vkysnuu_marketing' },
                { icon: '🌐', label: 'Сайт', value: 'шипилов-бизнес.рф', href: 'https://шипилов-бизнес.рф' },
                { icon: '📧', label: 'Email', value: 'hello@шипилов-бизнес.рф', href: 'mailto:hello@шипилов-бизнес.рф' },

            ]
        }
    };

    // ===== PROFILE MODAL RENDER =====
    var profileModal = document.getElementById('profile-modal');
    var profileModalBody = document.getElementById('profile-modal-body');

    function openProfileModal(profileKey) {
        if (!profileModal || !profileModalBody) return;
        var profile = profilesData[profileKey];
        if (!profile) return;

        var html = '';

        // Header
        html += '<div class="profile-modal__header">';
        html += '<div class="profile-modal__avatar ' + (profile.avatarClass || '') + '">' + profile.avatar + '</div>';
        html += '<div class="profile-modal__info">';
        html += '<h2 class="profile-modal__name">' + profile.name + '</h2>';
        html += '<div class="profile-modal__role">' + profile.role + '</div>';
        if (profile.quote) {
            html += '<div class="profile-modal__quote">"' + profile.quote + '"</div>';
        }
        html += '</div></div>';

        // Stats
        if (profile.stats && profile.stats.length) {
            html += '<div class="profile-stats">';
            profile.stats.forEach(function (s) {
                html += '<div class="profile-stat">';
                html += '<span class="profile-stat__value">' + s.value + '</span>';
                html += '<span class="profile-stat__label">' + s.label + '</span>';
                html += '</div>';
            });
            html += '</div>';
        }

        // Bio
        html += '<div class="profile-section">';
        html += '<h3 class="profile-section__title">👤 О себе</h3>';
        html += '<p class="profile-section__text">' + profile.bio + '</p>';
        html += '</div>';

        // Timeline (для Егора)
        if (profile.timeline && profile.timeline.length) {
            html += '<div class="profile-section">';
            html += '<h3 class="profile-section__title">🗺 Профессиональный путь</h3>';
            html += '<div class="profile-timeline">';
            profile.timeline.forEach(function (t) {
                html += '<div class="profile-timeline__item">';
                html += '<span class="profile-timeline__year">' + t.year + '</span>';
                html += '<div class="profile-timeline__text">' + t.text + '</div>';
                html += '</div>';
            });
            html += '</div></div>';
        }

        // Projects
        if (profile.projects && profile.projects.length) {
            html += '<div class="profile-section">';
            html += '<h3 class="profile-section__title">🚀 Проекты (' + profile.projects.length + ')</h3>';
            html += '<div class="profile-projects">';
            profile.projects.forEach(function (p) {
                html += '<div class="profile-project-item">';
                html += '<span class="profile-project-item__name">' + p.name + '</span>';
                html += '<span class="profile-project-item__cat">' + p.cat + '</span>';
                html += '</div>';
            });
            html += '</div></div>';
        }

        // Speaking (для Егора)
        if (profile.speaking && profile.speaking.length) {
            html += '<div class="profile-section">';
            html += '<h3 class="profile-section__title">🎤 Публичные выступления</h3>';
            html += '<div class="profile-speaking">';
            profile.speaking.forEach(function (s) {
                html += '<div class="profile-speaking__item">';
                html += '<span class="profile-speaking__city">' + s.city + '</span>';
                html += '<span class="profile-speaking__topic">' + s.topic + '</span>';
                html += '<span class="profile-speaking__year">' + s.year + '</span>';
                html += '</div>';
            });
            html += '</div></div>';
        }

        // Contacts (только в модалке!)
        if (profile.contacts && profile.contacts.length) {
            html += '<div class="profile-section">';
            html += '<h3 class="profile-section__title">📞 Контактные данные</h3>';
            html += '<div class="profile-contacts">';
            profile.contacts.forEach(function (c) {
                html += '<a href="' + c.href + '" class="profile-contact" target="_blank" rel="noopener noreferrer">';
                html += '<span class="profile-contact__icon">' + c.icon + '</span>';
                html += '<div>';
                html += '<span class="profile-contact__label">' + c.label + '</span>';
                html += '<span class="profile-contact__value">' + c.value + '</span>';
                html += '</div></a>';
            });
            html += '</div></div>';
        }

        profileModalBody.innerHTML = html;
        profileModal.classList.add('profile-modal--visible');
        profileModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeProfileModal() {
        if (!profileModal) return;
        profileModal.classList.remove('profile-modal--visible');
        profileModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Open handlers
    document.querySelectorAll('[data-profile]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var key = this.getAttribute('data-profile');
            openProfileModal(key);
        });
    });

    // Close handlers
    document.querySelectorAll('[data-profile-close]').forEach(function (el) {
        el.addEventListener('click', closeProfileModal);
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && profileModal && profileModal.classList.contains('profile-modal--visible')) {
            closeProfileModal();
        }
    });
})();