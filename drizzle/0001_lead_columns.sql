-- The leads table had no real data yet, so recreate it with all columns
-- (SQLite cannot ADD a NOT NULL column without a default).
DROP TABLE IF EXISTS `leads`;--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`idempotency_key` text NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`contact_method` text NOT NULL,
	`phone` text,
	`company_name` text NOT NULL,
	`company_size` text NOT NULL,
	`country` text NOT NULL,
	`demo_date` text NOT NULL,
	`data` text NOT NULL,
	`webhook_status` integer,
	`created_at` text NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX `leads_idempotency_key_unique` ON `leads` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `idx_leads_email_created` ON `leads` (`email`,`created_at`);
