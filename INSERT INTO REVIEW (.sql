INSERT INTO REVIEW (
    id,
    restaurant_id,
    member_id,
    rating,
    content,
    revisit,
    verification_status,
    receipt_url,
    like_count,
    helpful_count
)
WITH restaurants AS (
    SELECT id,
           ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM RESTAURANT
),
members AS (
    SELECT id,
           ROW_NUMBER() OVER (ORDER BY id) AS rn,
           COUNT(*) OVER () AS cnt
    FROM MEMBER
    WHERE email IN (
        'test1@test.com', 'test2@test.com', 'test3@test.com',
        'test4@test.com', 'test5@test.com', 'test6@test.com',
        'test7@test.com', 'test8@test.com', 'test9@test.com',
        'test10@test.com', 'test11@test.com', 'test12@test.com',
        'test13@test.com', 'test14@test.com', 'test15@test.com'
    )
),
slots AS (
    SELECT 1 AS slot FROM dual
    UNION ALL SELECT 2 FROM dual
    UNION ALL SELECT 3 FROM dual
)
SELECT
    REVIEW_SEQ.NEXTVAL,
    r.id,
    m.id,
    CASE
        WHEN MOD(r.rn + s.slot, 5) IN (0, 2) THEN 5
        WHEN MOD(r.rn + s.slot, 5) IN (1, 4) THEN 4
        ELSE 3
    END,
    CASE s.slot
        WHEN 1 THEN '음식이 깔끔하고 맛있었습니다. 전체적으로 만족스러운 방문이었습니다.'
        WHEN 2 THEN '분위기가 좋고 직원분들도 친절해서 다시 방문하고 싶습니다.'
        WHEN 3 THEN '가격 대비 괜찮은 편이고 상황에 맞게 추천할 만한 맛집입니다.'
    END,
    CASE
        WHEN s.slot = 3 AND MOD(r.rn, 4) = 0 THEN 'N'
        ELSE 'Y'
    END,
    CASE
        WHEN s.slot = 1 THEN 'A'
        WHEN s.slot = 2 THEN 'N'
        ELSE 'R'
    END,
    'https://picsum.photos/400/600?random=' || r.rn || s.slot,
    MOD(r.rn * s.slot, 20),
    MOD(r.rn + s.slot, 10)
FROM restaurants r
CROSS JOIN slots s
JOIN members m
  ON m.rn = MOD((r.rn - 1) * 3 + s.slot - 1, m.cnt) + 1;

COMMIT;

UPDATE RESTAURANT rt
SET review_count = (
        SELECT COUNT(*)
        FROM REVIEW rv
        WHERE rv.restaurant_id = rt.id
    ),
    average_rating = (
        SELECT NVL(ROUND(AVG(rv.rating), 1), 0)
        FROM REVIEW rv
        WHERE rv.restaurant_id = rt.id
    );

COMMIT;

UPDATE REVIEW
SET receipt_url =
'https://firebasestorage.googleapis.com/v0/b/miniproject2-cheonan-matzip.firebasestorage.app/o/receipts%2F1778831267452_%EB%A7%88%EC%B4%88%EC%89%90%ED%94%841%20%EC%98%81%EC%88%98%EC%A6%9D.jfif?alt=media'
|| '&token=617c3824-3c4f-4e97-98e5-a35061f04980'
WHERE receipt_url IS NOT NULL;

COMMIT;

COMMIT;

SELECT receipt_url
FROM review
WHERE rownum = 1;