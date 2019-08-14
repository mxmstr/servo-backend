INSERT INTO business
	(id, address, images, is_opened, name)
	VALUES ('00uoudimbcBaMgXYj356', 'address', NULL, 0, 'name');

INSERT INTO business
	(id, address, images, is_opened, name)
	VALUES ('00u147czsbl3ous2u357', 'address', NULL, 0, 'name');

INSERT INTO customer
	(id, name)
	VALUES ('00uyza6nwAy2X8Tmr356', 'Joe Smith');


INSERT INTO menu_item
	(id, image, name, options, price, business_id)
	VALUES (1, NULL, 'asdf', 'fdsa', '1234', '00uoudimbcBaMgXYj356');
	
INSERT INTO ticket
	(id, options, quantity, `status`, timestamp, customer_id, menu_item_id)
	VALUES (1, 'options', '1', 'OPEN', NOW(), '00uyza6nwAy2X8Tmr356', 1);

INSERT INTO ticket
	(id, options, quantity, `status`, timestamp, customer_id, menu_item_id)
	VALUES (2, 'options', '2', 'COMPLETE', NOW(), '00uyza6nwAy2X8Tmr356', 1);

INSERT INTO ticket
	(id, options, quantity, `status`, timestamp, customer_id, menu_item_id)
	VALUES (3, 'options', '2', 'INCOMPLETE', NOW(), '00uyza6nwAy2X8Tmr356', 1);
	
INSERT INTO servo_table
	(id, position, business_id, customer_id)
	VALUES (1, NULL, '00uoudimbcBaMgXYj356', '00uyza6nwAy2X8Tmr356');
	
INSERT INTO servo_table
	(id, position, business_id, customer_id)
	VALUES (2, NULL, '00uoudimbcBaMgXYj356', NULL);
	
SELECT *
	FROM servo_table
	WHERE business_id = '00uoudimbcBaMgXYj356';
