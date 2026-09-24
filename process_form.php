<?php
/**
 * ============================================================
 *  DOIT — Process Form (обработчик форм обратной связи)
 *  Версия: 2.0 (ФЗ-152 + ФЗ-38, ред. от 01.09.2025)
 * ============================================================
 *  Обрабатывает:
 *    - Формы: question, cooperation, job
 *    - Согласия на cookies
 *    - Валидация трёх согласий (ПДн, передача, рассылка)
 *    - HTML-письма с брендингом
 *    - Telegram-уведомления (опционально)
 *    - Rate-limit и защита от спама
 * ============================================================
 */

// ===== 1. ЗАГОЛОВКИ И БЕЗОПАСНОСТЬ =====
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Отключаем вывод ошибок в продакшене
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// CORS для preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Только POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не поддерживается'], JSON_UNESCAPED_UNICODE);
    exit;
}

// ===== 2. КОНФИГУРАЦИЯ =====
$config = [
    // Email получателя
    'to_email'             => 'exxxar@vk.com',

    // Отправитель (должен существовать на домене сервера)
    'from_email'           => 'noreply@donbassit.ru',
    'from_name'            => 'DOIT Website',

    // Telegram-уведомления (опционально — оставьте пустыми, если не нужно)
    'telegram_bot_token'   => '', // Пример: '123456:ABC-DEF...'
    'telegram_chat_id'     => '', // Пример: '987654321' или ID группы

    // Лимит запросов с одного IP в час (защита от флуда)
    'rate_limit_per_hour'  => 10,

    // Директория для логов
    'logs_dir'             => __DIR__ . '/logs/',

    // Версия политики (для аудита согласий)
    'policy_version'       => '2026-09-24',

    // Ссылки на документы согласий (используются в письмах и логах)
    'docs' => [
        'privacy'  => 'https://donbassit.ru/privacy.html',
        'pd'       => 'https://donbassit.ru/privacy.html#pd-consent',
        'transfer' => 'https://donbassit.ru/privacy.html#transfer-consent',
        'mailing'  => 'https://donbassit.ru/privacy.html#mailing-consent',
    ],
];

// ===== 3. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

/**
 * Очистка входных данных
 */
function clean($value) {
    if ($value === null) return '';
    $value = trim((string)$value);
    $value = stripslashes($value);
    $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    // Удаляем zero-width символы и невидимый спам
    $value = preg_replace('/[\x{200B}-\x{200D}\x{FEFF}]/u', '', $value);
    return $value;
}

/**
 * Валидация email
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Валидация телефона (российский формат)
 */
function isValidPhone($phone) {
    if (empty($phone)) return true; // опциональное поле
    $cleaned = preg_replace('/[^0-9+]/', '', $phone);
    return preg_match('/^\+?[0-9]{10,15}$/', $cleaned) === 1;
}

/**
 * JSON-ответ
 */
function respond($success, $message, $httpCode = 200) {
    if ($httpCode !== 200) http_response_code($httpCode);
    echo json_encode([
        'success' => (bool)$success,
        'message' => $message,
        'time'    => date('c'),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Запись в лог (создаёт директорию при необходимости)
 */
function logToFile($filename, $data, $config) {
    if (!is_dir($config['logs_dir'])) {
        mkdir($config['logs_dir'], 0755, true);
    }
    // Защита .htaccess от прямого доступа к логам
    $htaccess = $config['logs_dir'] . '.htaccess';
    if (!file_exists($htaccess)) {
        file_put_contents($htaccess, "Deny from all\n");
    }
    $logFile = $config['logs_dir'] . $filename;
    $line = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
    file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);
}

/**
 * Rate-limit: проверка количества запросов с IP за последний час
 */
function checkRateLimit($ip, $config) {
    $rateFile = $config['logs_dir'] . 'rate_limit.json';
    $data = [];

    if (file_exists($rateFile)) {
        $raw = file_get_contents($rateFile);
        $data = json_decode($raw, true) ?: [];
    }

    $now = time();
    $oneHourAgo = $now - 3600;

    // Очистка старых записей
    $data = array_filter($data, function ($timestamp) use ($oneHourAgo) {
        return $timestamp >= $oneHourAgo;
    });

    // Фильтрация по IP
    $ipCount = 0;
    foreach ($data as $entry) {
        if (is_array($entry) && isset($entry['ip']) && $entry['ip'] === $ip) {
            if ($entry['ts'] >= $oneHourAgo) $ipCount++;
        }
    }

    if ($ipCount >= $config['rate_limit_per_hour']) {
        return false;
    }

    // Добавляем новую запись
    $data[] = ['ip' => $ip, 'ts' => $now];
    file_put_contents($rateFile, json_encode($data), LOCK_EX);

    return true;
}

/**
 * Honeypot-проверка (скрытое поле, боты его заполняют)
 */
function isBot($post) {
    return !empty($post['website_url']) || !empty($post['fax_number']);
}

// ===== 4. СБОР СИСТЕМНОЙ ИНФОРМАЦИИ =====
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$formType = clean($_POST['form_type'] ?? '');

// ===== 5. RATE LIMIT И HONEYPOT =====
if (isBot($_POST)) {
    logToFile('spam.jsonl', [
        'event' => 'bot_detected',
        'ip' => $ip,
        'user_agent' => $userAgent,
        'timestamp' => date('c'),
    ], $config);
    respond(false, 'Ошибка отправки. Попробуйте позже.', 403);
}

if ($formType !== 'cookie_consent' && !checkRateLimit($ip, $config)) {
    respond(false, 'Слишком много запросов. Попробуйте через час.', 429);
}

// ===== 6. ОБРАБОТКА ПО ТИПУ ФОРМЫ =====

// --- 6.1. СОГЛАСИЕ НА COOKIES (отдельный кейс) ---
if ($formType === 'cookie_consent') {
    $prefs = [
        'event'      => 'cookie_consent',
        'timestamp'  => date('c'),
        'ip'         => $ip,
        'user_agent' => $userAgent,
        'technical'  => !empty($_POST['technical']),
        'analytics'  => !empty($_POST['analytics']),
        'functional' => !empty($_POST['functional']),
        'version'    => clean($_POST['consent_version'] ?? ''),
    ];
    logToFile('cookie_consent.jsonl', $prefs, $config);
    respond(true, 'Настройки cookies сохранены');
}

// --- 6.2. ВАЛИДАЦИЯ СОГЛАСИЙ (ФЗ-152 + ФЗ-38, ред. от 01.09.2025) ---
$consentPd       = !empty($_POST['consent_pd']);
$consentTransfer = !empty($_POST['consent_transfer']);
$consentMailing  = !empty($_POST['consent_mailing']);

if (!$consentPd) {
    respond(false, 'Необходимо дать согласие на обработку персональных данных', 400);
}

if (!$consentTransfer) {
    respond(false, 'Необходимо дать согласие на передачу персональных данных третьим лицам для обработки заявки', 400);
}

// ===== 7. СБОР ДАННЫХ ПО ТИПУ ФОРМЫ =====
$data = [];
$subject = '';

switch ($formType) {
    case 'question':
        $subject = '❓ Новый вопрос с сайта DOIT';
        $data = [
            'Имя'       => clean($_POST['name'] ?? ''),
            'Email'     => clean($_POST['email'] ?? ''),
            'Тема'      => clean($_POST['topic'] ?? ''),
            'Вопрос'    => clean($_POST['message'] ?? ''),
        ];
        break;

    case 'cooperation':
        $subject = '🤝 Заявка на сотрудничество — DOIT';
        $data = [
            'Имя'                   => clean($_POST['name'] ?? ''),
            'Компания'              => clean($_POST['company'] ?? ''),
            'Email'                 => clean($_POST['email'] ?? ''),
            'Телефон'               => clean($_POST['phone'] ?? ''),
            'Тип сотрудничества'    => clean($_POST['cooperation_type'] ?? ''),
            'Описание проекта'      => clean($_POST['message'] ?? ''),
        ];
        break;

    case 'job':
        $subject = '👨‍💻 Отклик на вакансию — DOIT';
        $data = [
            'Имя'       => clean($_POST['name'] ?? ''),
            'Позиция'   => clean($_POST['position'] ?? ''),
            'Email'     => clean($_POST['email'] ?? ''),
            'Telegram'  => clean($_POST['telegram'] ?? ''),
            'Уровень'   => clean($_POST['level'] ?? ''),
            'О себе'    => clean($_POST['message'] ?? ''),
        ];
        break;

    default:
        respond(false, 'Неизвестный тип формы', 400);
}

// ===== 8. ВАЛИДАЦИЯ ОБЯЗАТЕЛЬНЫХ ПОЛЕЙ =====
if (empty($data['Имя']) || mb_strlen($data['Имя']) < 2) {
    respond(false, 'Укажите ваше имя (минимум 2 символа)', 400);
}

if (empty($data['Email']) || !isValidEmail($data['Email'])) {
    respond(false, 'Укажите корректный email', 400);
}

if (isset($data['Телефон']) && !isValidPhone($data['Телефон'])) {
    respond(false, 'Укажите корректный номер телефона', 400);
}

// Определяем поле с основным сообщением
$messageField = $data['Вопрос'] ?? $data['Описание проекта'] ?? $data['О себе'] ?? '';
if (empty($messageField) || mb_strlen($messageField) < 10) {
    respond(false, 'Сообщение слишком короткое (минимум 10 символов)', 400);
}
if (mb_strlen($messageField) > 5000) {
    respond(false, 'Сообщение слишком длинное', 400);
}

// ===== 9. ЛОГИРОВАНИЕ СОГЛАСИЙ (аудит по ФЗ-152) =====
$consentLog = [
    'event'            => 'consent_given',
    'form_type'        => $formType,
    'timestamp'        => date('c'),
    'ip'               => $ip,
    'user_agent'       => $userAgent,
    'referer'          => $referer,
    'policy_version'   => $config['policy_version'],
    'user'             => [
        'name'  => $data['Имя'],
        'email' => $data['Email'],
    ],
    'consents'         => [
        'pd_processing' => [
            'granted'      => $consentPd,
            'required'     => true,
            'document_url' => $config['docs']['pd'],
            'legal_basis'  => '152-ФЗ, ст. 9',
        ],
        'pd_transfer'   => [
            'granted'      => $consentTransfer,
            'required'     => true,
            'document_url' => $config['docs']['transfer'],
            'legal_basis'  => '152-ФЗ, ст. 9, ч. 3 (ред. от 01.09.2025)',
        ],
        'mailing'       => [
            'granted'      => $consentMailing,
            'required'     => false,
            'document_url' => $config['docs']['mailing'],
            'legal_basis'  => '38-ФЗ, ст. 18 (ред. от 01.09.2025)',
        ],
    ],
];

logToFile('consent_log.jsonl', $consentLog, $config);

// Если дано согласие на рассылку — отдельный лог для маркетинг-команды
if ($consentMailing) {
    logToFile('mailing_optin.jsonl', [
        'event'     => 'mailing_optin',
        'timestamp' => date('c'),
        'name'      => $data['Имя'],
        'email'     => $data['Email'],
        'source'    => $formType,
    ], $config);
}

// ===== 10. ПОСТРОЕНИЕ ТЕКСТОВОГО ПИСЬМА =====
$bodyText = "══════════════════════════════════════\n";
$bodyText .= "  DOIT — Новая заявка\n";
$bodyText .= "══════════════════════════════════════\n\n";
$bodyText .= "📋 Тип: {$formType}\n";
$bodyText .= "📅 Дата: " . date('d.m.Y H:i:s') . "\n";
$bodyText .= "🌐 IP: {$ip}\n\n";
$bodyText .= "──────────────────────────────────────\n";

foreach ($data as $key => $value) {
    if (!empty($value)) {
        $bodyText .= "{$key}: {$value}\n";
    }
}

$bodyText .= "\n──────────────────────────────────────\n";
$bodyText .= "🔒 Согласия пользователя:\n";
$bodyText .= "  ✓ Обработка ПДн: ДА\n";
$bodyText .= "  ✓ Передача третьим лицам: ДА\n";
$bodyText .= "  " . ($consentMailing ? '✓' : '✗') . " Рассылка: " . ($consentMailing ? 'ДА' : 'НЕТ') . "\n";
$bodyText .= "  Версия политики: {$config['policy_version']}\n\n";
$bodyText .= "──────────────────────────────────────\n";
$bodyText .= "Отправлено с сайта donbassit.ru\n";
$bodyText .= "Политика конфиденциальности: {$config['docs']['privacy']}\n";

// ===== 11. ПОСТРОЕНИЕ HTML-ПИСЬМА =====
$rowsHtml = '';
foreach ($data as $key => $value) {
    if (!empty($value)) {
        $rowsHtml .= "
            <tr>
                <td style='padding: 12px 16px; color: #9999aa; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top; width: 180px; border-bottom: 1px solid rgba(255,255,255,0.06);'>
                    {$key}
                </td>
                <td style='padding: 12px 16px; color: #f0f0f5; font-size: 14px; line-height: 1.6; border-bottom: 1px solid rgba(255,255,255,0.06);'>
                    {$value}
                </td>
            </tr>";
    }
}

$htmlBody = "<!DOCTYPE html>
<html lang='ru'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>{$subject}</title>
</head>
<body style='margin: 0; padding: 0; background: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Inter, Arial, sans-serif;'>
    <div style='max-width: 640px; margin: 0 auto; background: #0a0a0f; padding: 32px 16px;'>

        <!-- HEADER -->
        <div style='text-align: center; padding: 24px 0; border-bottom: 1px solid rgba(255,255,255,0.06);'>
            <h1 style='margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.02em;'>
                <span style='color: #f0f0f5;'>DOIT</span><span style='color: #ff6b00;'>.</span>
            </h1>
            <p style='color: #9999aa; margin: 8px 0 0; font-size: 14px;'>Новая заявка с сайта</p>
        </div>

        <!-- TITLE -->
        <div style='padding: 24px 0 16px;'>
            <h2 style='margin: 0; color: #ff6b00; font-size: 20px; font-weight: 700;'>{$subject}</h2>
            <p style='margin: 8px 0 0; color: #666677; font-size: 12px;'>
                Отправлено: " . date('d.m.Y H:i:s') . " · IP: {$ip}
            </p>
        </div>

        <!-- DATA TABLE -->
        <table cellpadding='0' cellspacing='0' width='100%' style='background: #16161f; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; margin-bottom: 24px;'>
            {$rowsHtml}
        </table>

        <!-- CONSENTS -->
        <div style='background: #16161f; border: 1px solid rgba(255,107,0,0.3); border-left: 3px solid #ff6b00; border-radius: 12px; padding: 20px; margin-bottom: 24px;'>
            <div style='color: #ff6b00; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;'>
                🔒 Согласия пользователя (ФЗ-152, ФЗ-38)
            </div>
            <div style='font-size: 13px; color: #9999aa; line-height: 1.8;'>
                <span style='color: #4ade80;'>✓</span> Обработка персональных данных: <strong style='color: #f0f0f5;'>дано</strong><br>
                <span style='color: #4ade80;'>✓</span> Передача третьим лицам: <strong style='color: #f0f0f5;'>дано</strong><br>
                " . ($consentMailing
        ? "<span style='color: #4ade80;'>✓</span> Рекламная рассылка: <strong style='color: #f0f0f5;'>согласен получать</strong>"
        : "<span style='color: #9999aa;'>✗</span> Рекламная рассылка: <strong style='color: #9999aa;'>отказ</strong>") . "
            </div>
            <div style='color: #666677; font-size: 11px; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06);'>
                Версия политики: {$config['policy_version']}<br>
                <a href='{$config['docs']['privacy']}' style='color: #ff6b00; text-decoration: none;'>Посмотреть документ</a>
            </div>
        </div>

        <!-- CTA -->
        <div style='text-align: center; padding: 24px 0;'>
            <a href='mailto:{$data['Email']}?subject=Re: {$subject}'
               style='display: inline-block; padding: 14px 28px; background: #ff6b00; color: #0a0a0f; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px;'>
                Ответить клиенту →
            </a>
        </div>

        <!-- FOOTER -->
        <div style='text-align: center; padding: 24px 0; border-top: 1px solid rgba(255,255,255,0.06); color: #666677; font-size: 12px;'>
            <p style='margin: 0 0 4px;'>© 2026 Донбасс АйТи (DOIT)</p>
            <p style='margin: 0;'>Донецк | Краснодар | Remote</p>
            <p style='margin: 8px 0 0;'>
                <a href='{$config['docs']['privacy']}' style='color: #ff6b00; text-decoration: none;'>Политика конфиденциальности</a>
            </p>
        </div>

    </div>
</body>
</html>";

// ===== 12. ОТПРАВКА EMAIL =====
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    "From: {$config['from_name']} <{$config['from_email']}>",
    "Reply-To: {$data['Имя']} <{$data['Email']}>",
    "X-Mailer: DOIT-PHP/2.0",
    "X-Priority: 3 (Normal)",
    "X-Entity-Ref: DOIT-{$formType}-" . time(),
];

$mailSent = @mail(
    $config['to_email'],
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    $htmlBody,
    implode("\r\n", $headers),
    "-f{$config['from_email']}"
);

// ===== 13. ОТПРАВКА В TELEGRAM (опционально) =====
$telegramSent = false;
if (!empty($config['telegram_bot_token']) && !empty($config['telegram_chat_id'])) {

    $typeLabel = [
        'question'     => '❓ Вопрос',
        'cooperation'  => '🤝 Сотрудничество',
        'job'          => '👨‍💻 Вакансия',
    ][$formType] ?? '📨 Заявка';

    $tgMessage = "*{$typeLabel} с сайта DOIT*\n\n";
    foreach ($data as $key => $value) {
        if (!empty($value)) {
            $tgMessage .= "*{$key}:* " . str_replace(['*', '_', '`'], '', $value) . "\n";
        }
    }
    $tgMessage .= "\n🔒 *Согласия:* ПДн ✓ · Передача ✓ · Рассылка " . ($consentMailing ? '✓' : '✗');
    $tgMessage .= "\n_{$ip}_ · _" . date('d.m.Y H:i') . "_";

    $tgUrl = "https://api.telegram.org/bot{$config['telegram_bot_token']}/sendMessage";
    $tgData = [
        'chat_id'    => $config['telegram_chat_id'],
        'text'       => $tgMessage,
        'parse_mode' => 'Markdown',
    ];

    $ch = curl_init($tgUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($tgData),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 5,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $tgResult = curl_exec($ch);
    $telegramSent = curl_getinfo($ch, CURLINFO_HTTP_CODE) === 200;
    curl_close($ch);

    if (!$telegramSent) {
        logToFile('telegram_errors.jsonl', [
            'timestamp' => date('c'),
            'error'     => $tgResult,
            'form_type' => $formType,
        ], $config);
    }
}

// ===== 14. ЛОГ ОТПРАВКИ =====
logToFile('submissions.jsonl', [
    'event'          => 'form_submitted',
    'form_type'      => $formType,
    'timestamp'      => date('c'),
    'ip'             => $ip,
    'user_email'     => $data['Email'],
    'mail_sent'      => $mailSent,
    'telegram_sent'  => $telegramSent,
    'mailing_optin'  => $consentMailing,
    'policy_version' => $config['policy_version'],
], $config);

// ===== 15. ОТВЕТ КЛИЕНТУ =====
if ($mailSent || $telegramSent) {
    respond(true, 'Сообщение отправлено! Скоро свяжемся с вами.');
} else {
    respond(false, 'Не удалось отправить сообщение. Попробуйте позже или напишите нам на info@donbassit.ru', 500);
}