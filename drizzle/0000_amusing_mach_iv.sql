CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`idempotency_key` text NOT NULL,
	`email` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `leads_idempotency_key_unique` ON `leads` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `idx_leads_email_created` ON `leads` (`email`,`created_at`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`ip` text NOT NULL,
	`window_start` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`ip`, `window_start`)
);
