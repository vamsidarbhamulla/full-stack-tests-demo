-- SQLite
DELETE FROM USERS;

INSERT INTO users (fullName, userName, email, password, phone, privillage) 
            VALUES ('Administrator', 'Admin', 'admin@test.com', 'admin@1234', 'x', 1)


SELECT * FROM USERS;            

-- SQLite
SELECT name FROM sqlite_master WHERE type='table';


-- SQLite

select * from users;
--delete from users where userName = 'testuser';

