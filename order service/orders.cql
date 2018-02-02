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


copy orders from '/Users/larry/microspore/order service/bigFile1.txt' with delimiter = ',';
copy orders from '/Users/larry/microspore/order service/bigFile2.txt' with delimiter = ',';
copy orders from '/Users/larry/microspore/order service/bigFile3.txt' with delimiter = ',';
copy orders from '/Users/larry/microspore/order service/bigFile4.txt' with delimiter = ',';
copy orders from '/Users/larry/microspore/order service/bigFile5.txt' with delimiter = ',';


-- first query resulted in way too many partitions;
	--realized my primary key was not fit for the query;
	--way too long (couple seconds total)
--set partition key to match my query
--set clustering key to match query and for uniqueness
	--response between 1ms - 90ms per query
