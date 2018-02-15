DROP KEYSPACE IF EXISTS orders;

CREATE KEYSPACE orders
    WITH REPLICATION = {
        'class': 'SimpleStrategy', 
        'replication_factor': 1
    };

USE orders;

CREATE TABLE orders (
    order_id INT,
    user_id INT,
    amount DECIMAL,
    products TEXT,
    completed BOOLEAN,
    PRIMARY KEY(user_id, completed, amount)
);

CREATE TABLE completed (
	order_id INT,
	user_id INT,
	amount DECIMAL,
	PRIMARY KEY(user_id, amount)
);

copy orders from '/usr/src/cassandra/dockerData.txt' with delimiter = ',';

