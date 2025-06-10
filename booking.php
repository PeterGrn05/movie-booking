<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Путь к базе
$dbPath = __DIR__ . '/cinema.db';

try {
    // Подключение
    $pdo = new PDO("sqlite:$dbPath");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Получение данных
    $session_id = $_POST['session_id'] ?? null;
    $seat_ids = $_POST['seat_ids'] ?? [];

    if (!$session_id || !is_array($seat_ids) || empty($seat_ids)) {
        echo json_encode(['error' => 'Неверные входные данные']);
        exit;
    }

    // Транзакция
    $pdo->beginTransaction();

    // Вставка бронирования
    $stmt = $pdo->prepare("INSERT INTO Booking (session_id) VALUES (:session_id)");
    $stmt->execute([':session_id' => $session_id]);
    $booking_id = $pdo->lastInsertId();

    // Вставка мест
    $stmt = $pdo->prepare("INSERT INTO BookingSeat (booking_id, seat_id) VALUES (:booking_id, :seat_id)");
    foreach ($seat_ids as $seat_id) {
        $stmt->execute([
            ':booking_id' => $booking_id,
            ':seat_id' => $seat_id
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'booking_id' => $booking_id
    ]);

} catch (Exception $e) {
    // Проверяем, определена ли переменная $pdo и активна ли транзакция
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    echo json_encode(['error' => $e->getMessage()]);
}
?>
