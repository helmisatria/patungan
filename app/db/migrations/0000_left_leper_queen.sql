CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`owned_by_email` text,
	`owned_by_tg_username` text NOT NULL,
	`monthly_price` integer NOT NULL,
	`activated_at` text NOT NULL,
	`participants` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
