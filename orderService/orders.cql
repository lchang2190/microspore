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
    PRIMARY KEY((user_id, completed), amount)
);

CREATE TABLE completed (
	order_id INT,
	user_id INT,
	amount DECIMAL,
	PRIMARY KEY(user_id, amount)
);



copy orders from '/Users/larry/microspore/orderService/bigFile1.txt' with delimiter = ',';
copy orders from '/Users/larry/microspore/orderService/bigFile2.txt' with delimiter = ',';
copy orders from '/Users/larry/microspore/orderService/bigFile3.txt' with delimiter = ',';
copy orders from '/Users/larry/microspore/orderservice/bigFile4.txt' with delimiter = ',';
copy orders from '/Users/larry/microspore/orderService/bigFile5.txt' with delimiter = ',';


-- first query resulted in way too many partitions;
	--realized my primary key was not fit for the query;
	--way too long (~2-3 seconds)
--set partition key to match my query
--set clustering key to match query and for uniqueness
	--response between 4ms - 150ms per query
	--new relic time between 100-220ms per query

--with artillery first run 449 rps; 60s, 10 users, 150 rps
--second run: 448 rps; 60s, 10 users, 300 rps
--third run: 452 rps; 60s, 10 users, 100 rps
--foruth run: 413.74 rps; 60s, 10 users, 50 rps

