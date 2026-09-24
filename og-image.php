<?php
/**
 * Динамический генератор OG-изображений
 * Использование: <meta property="og:image" content="https://doit.dev/og-image.php?title=Привет&subtitle=Тест">
 */

header('Content-Type: image/jpeg');
header('Cache-Control: public, max-age=31536000'); // кеш на год

// Параметры из URL
$title = mb_substr($_GET['title'] ?? 'DOIT — Донбасс АйТи', 0, 60);
$subtitle = mb_substr($_GET['subtitle'] ?? 'Fullstack-разработка IT-решений', 0, 80);

// Создание изображения 1200×630
$width = 1200;
$height = 630;
$image = imagecreatetruecolor($width, $height);

// Цвета
$bgColor = imagecolorallocate($image, 10, 10, 15);        // #0a0a0f
$textColor = imagecolorallocate($image, 240, 240, 245);   // #f0f0f5
$accentColor = imagecolorallocate($image, 255, 107, 0);   // #ff6b00
$mutedColor = imagecolorallocate($image, 102, 102, 119);  // #666677

// Фон
imagefill($image, 0, 0, $bgColor);

// Градиент-свечение (простая имитация)
for ($i = 0; $i < 200; $i++) {
    $alpha = (int)(10 * (1 - $i / 200));
    $glow = imagecolorallocatealpha($image, 255, 107, 0, 127 - $alpha);
    imagefilledellipse($image, 1050, 150, 400 + $i*2, 400 + $i*2, $glow);
}

// ВАЖНО: загрузите шрифт Inter Bold в папку /assets/fonts/Inter-Bold.ttf
$fontPath = __DIR__ . '/assets/fonts/Inter-Bold.ttf';
$fontRegular = __DIR__ . '/assets/fonts/Inter-Regular.ttf';

// Проверка наличия шрифта (fallback на встроенный)
if (!file_exists($fontPath)) {
    // Используем встроенные шрифты GD (без UTF-8)
    imagestring($image, 5, 60, 80, 'DOIT.', $textColor);
    imagestring($image, 3, 60, 140, $subtitle, $mutedColor);
    imagestring($image, 5, 60, 220, $title, $accentColor);
} else {
    // Логотип DOIT.
    imagettftext($image, 72, 0, 60, 130, $textColor, $fontPath, 'DOIT');
    imagettftext($image, 72, 0, 215, 130, $accentColor, $fontPath, '.');

    // Подзаголовок
    imagettftext($image, 18, 0, 62, 170, $mutedColor, $fontRegular, 'DONBASS IT');

    // Основной заголовок
    imagettftext($image, 56, 0, 60, 280, $textColor, $fontPath, $title);

    // Статистика
    imagettftext($image, 32, 0, 60, 420, $accentColor, $fontPath, '50+');
    imagettftext($image, 14, 0, 60, 445, $mutedColor, $fontRegular, 'проектов');

    imagettftext($image, 32, 0, 180, 420, $accentColor, $fontPath, '10+');
    imagettftext($image, 14, 0, 180, 445, $mutedColor, $fontRegular, 'лет опыта');

    imagettftext($image, 32, 0, 300, 420, $accentColor, $fontPath, '15+');
    imagettftext($image, 14, 0, 300, 445, $mutedColor, $fontRegular, 'технологий');

    // URL
    imagettftext($image, 20, 0, 1060, 580, $mutedColor, $fontRegular, 'doit.dev');
}

// Вывод JPG с качеством 90%
imagejpeg($image, null, 90);
imagedestroy($image);