-- V5: Test data for development and testing

-- Clear existing data (reverse dependency order)
DELETE FROM KUDOS_CARDS WHERE true;
DELETE FROM USER_CLASSES WHERE true;
DELETE FROM CLASSES WHERE true;
DELETE FROM USERS WHERE true;

-- Test instructors
INSERT INTO USERS (user_id, email, name, google_id, role) VALUES
('11111111-1111-1111-1111-111111111111', 'prof.smith@university.edu', 'Dr. Sarah Smith', 'google_id_prof_smith_111111', 'INSTRUCTOR'),
('22222222-2222-2222-2222-222222222222', 'prof.johnson@university.edu', 'Dr. Michael Johnson', 'google_id_prof_johnson_222222', 'INSTRUCTOR'),
('33333333-3333-3333-3333-333333333333', 'prof.williams@university.edu', 'Dr. Emily Williams', 'google_id_prof_williams_333333', 'INSTRUCTOR');

-- Test students
INSERT INTO USERS (user_id, email, name, google_id, role) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'alice.anderson@student.edu', 'Alice Anderson', 'google_id_alice_aaaaaa', 'STUDENT'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bob.baker@student.edu', 'Bob Baker', 'google_id_bob_bbbbbb', 'STUDENT'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'charlie.chen@student.edu', 'Charlie Chen', 'google_id_charlie_cccccc', 'STUDENT'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'diana.davis@student.edu', 'Diana Davis', 'google_id_diana_dddddd', 'STUDENT'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'evan.evans@student.edu', 'Evan Evans', 'google_id_evan_eeeeee', 'STUDENT'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'fiona.foster@student.edu', 'Fiona Foster', 'google_id_fiona_ffffff', 'STUDENT'),
('99999999-9999-9999-9999-999999999999', 'george.garcia@student.edu', 'George Garcia', 'google_id_george_999999', 'STUDENT'),
('88888888-8888-8888-8888-888888888888', 'hannah.harris@student.edu', 'Hannah Harris', 'google_id_hannah_888888', 'STUDENT');

-- Test classes
INSERT INTO CLASSES (class_id, class_name) VALUES
('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'CSC 480 - Software Engineering'),
('c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'CSC 365 - Database Systems'),
('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'CSC 321 - Data Structures');

-- Instructor enrollments
INSERT INTO USER_CLASSES (user_id, class_id) VALUES
('11111111-1111-1111-1111-111111111111', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'),
('11111111-1111-1111-1111-111111111111', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3'),
('22222222-2222-2222-2222-222222222222', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2'),
('33333333-3333-3333-3333-333333333333', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1');

-- Student enrollments
INSERT INTO USER_CLASSES (user_id, class_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3'),
('99999999-9999-9999-9999-999999999999', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'),
('99999999-9999-9999-9999-999999999999', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2'),
('88888888-8888-8888-8888-888888888888', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'),
('88888888-8888-8888-8888-888888888888', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2'),
('88888888-8888-8888-8888-888888888888', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3');

-- Test kudos cards: PENDING status
INSERT INTO KUDOS_CARDS (card_id, sender_id, recipient_id, class_id, title, content, is_anonymous, status, created_at) VALUES
('a0000001-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1',
 'Great Teamwork!',
 'Bob was an excellent team member during our sprint. He helped debug complex issues and always showed up prepared for our meetings.',
 false, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '2 hours'),

('a0000001-0000-0000-0000-000000000002', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1',
 'Thank You for Help',
 'Alice helped me understand the design patterns we needed for the project. She took time to explain everything clearly.',
 true, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '1 hour'),

('a0000001-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2',
 'SQL Query Wizard',
 'Diana helped me optimize my database queries. What was taking 5 seconds now runs in milliseconds!',
 false, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '30 minutes');

-- Test kudos cards: APPROVED status
INSERT INTO KUDOS_CARDS (card_id, sender_id, recipient_id, class_id, title, content, is_anonymous, status, approved_by, professor_note, created_at) VALUES
('a0000001-0000-0000-0000-000000000004', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1',
 'Code Review Champion',
 'Your code reviews are always thorough and constructive. You catch bugs before they make it to production!',
 false, 'APPROVED', '11111111-1111-1111-1111-111111111111', 'Great peer collaboration!', CURRENT_TIMESTAMP - INTERVAL '1 day'),

('a0000001-0000-0000-0000-000000000005', '99999999-9999-9999-9999-999999999999', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1',
 'Documentation Hero',
 'Bob wrote amazing documentation for our API. It made integration so much easier for everyone.',
 true, 'APPROVED', '11111111-1111-1111-1111-111111111111', null, CURRENT_TIMESTAMP - INTERVAL '2 days'),

('a0000001-0000-0000-0000-000000000006', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '99999999-9999-9999-9999-999999999999', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2',
 'Database Design Expert',
 'George designed an elegant schema that perfectly handles all our edge cases.',
 false, 'APPROVED', '22222222-2222-2222-2222-222222222222', 'Excellent technical work', CURRENT_TIMESTAMP - INTERVAL '3 days');

-- Test kudos cards: RECEIVED status
INSERT INTO KUDOS_CARDS (card_id, sender_id, recipient_id, class_id, title, content, is_anonymous, status, approved_by, professor_note, created_at) VALUES
('a0000001-0000-0000-0000-000000000007', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3',
 'Algorithm Genius',
 'Alice explained the sorting algorithm in a way that finally made sense to me. Thanks for your patience!',
 true, 'RECEIVED', '11111111-1111-1111-1111-111111111111', null, CURRENT_TIMESTAMP - INTERVAL '5 days'),

('a0000001-0000-0000-0000-000000000008', '88888888-8888-8888-8888-888888888888', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1',
 'Testing Enthusiast',
 'Charlie wrote comprehensive unit tests that caught several bugs early in development.',
 false, 'RECEIVED', '33333333-3333-3333-3333-333333333333', 'Great attention to quality', CURRENT_TIMESTAMP - INTERVAL '7 days'),

('a0000001-0000-0000-0000-000000000009', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3',
 'Study Group Leader',
 'Fiona organized study sessions that helped everyone prepare for the exam.',
 false, 'RECEIVED', '11111111-1111-1111-1111-111111111111', null, CURRENT_TIMESTAMP - INTERVAL '10 days');

-- Test kudos cards: DENIED status
INSERT INTO KUDOS_CARDS (card_id, sender_id, recipient_id, class_id, title, content, is_anonymous, status, approved_by, professor_note, created_at) VALUES
('a0000001-0000-0000-0000-00000000000a', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1',
 'Test Card',
 'This is a test.',
 false, 'DENIED', '11111111-1111-1111-1111-111111111111', 'Too generic - please provide specific examples of contribution', CURRENT_TIMESTAMP - INTERVAL '4 days');

-- Additional test cards
INSERT INTO KUDOS_CARDS (card_id, sender_id, recipient_id, class_id, title, content, is_anonymous, status, approved_by, professor_note, created_at) VALUES
('a0000001-0000-0000-0000-00000000000b', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '88888888-8888-8888-8888-888888888888', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1',
 'Presentation Pro',
 'Hannah delivered an amazing presentation on our project. Clear, engaging, and professional!',
 false, 'RECEIVED', '11111111-1111-1111-1111-111111111111', 'Outstanding communication skills', CURRENT_TIMESTAMP - INTERVAL '6 days'),

('a0000001-0000-0000-0000-00000000000c', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1',
 'Problem Solver',
 'Evan found a creative solution to our deployment issue that saved us hours of work.',
 true, 'APPROVED', '33333333-3333-3333-3333-333333333333', null, CURRENT_TIMESTAMP - INTERVAL '8 hours'),

('a0000001-0000-0000-0000-00000000000d', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '88888888-8888-8888-8888-888888888888', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2',
 'Normalization Expert',
 'Hannah helped me understand database normalization. My schema is now in 3NF thanks to her!',
 false, 'APPROVED', '22222222-2222-2222-2222-222222222222', 'Excellent peer teaching', CURRENT_TIMESTAMP - INTERVAL '12 hours');

-- Summary: 3 instructors, 8 students, 3 classes, 13 kudos cards (various statuses)