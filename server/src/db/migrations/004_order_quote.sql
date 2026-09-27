-- The estimate the order was placed against: price, working days and the
-- itemised lines, computed on the server from the stored pricing version with
-- the front end's own estimate(). Until now an order only kept
-- pricing_version, so what the customer was quoted had to be recomputed by
-- hand, and a version that never existed was accepted.
--
-- NULL when there is nothing to price (e.g. site_type "unsure").

ALTER TABLE orders ADD COLUMN quote JSONB;
