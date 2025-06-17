UPDATE board
SET innerUrl = REPLACE(innerUrl, 'J:2023', 'J:\\2023\\')
WHERE innerUrl LIKE 'J:2023%';