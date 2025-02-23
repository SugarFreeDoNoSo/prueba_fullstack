import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

import { pgTable, text, integer, date, timestamp, foreignKey, bigint } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const db = drizzle(process.env.DATABASE_URL || "postgres://user:password@localhost:5432/database");

export const set = pgTable("set", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	series: text().notNull(),
	printedTotal: integer("printed_total"),
	total: integer(),
	ptcgoCode: text("ptcgo_code"),
	releaseDate: date("release_date"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	symbolUrl: text("symbol_url"),
	logoUrl: text("logo_url"),
});

export const card = pgTable("card", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	supertype: text().notNull(),
	subtypes: text().array(),
	types: text().array(),
	setId: text("set_id").notNull(),
	number: text().notNull(),
	rarity: text(),
}, (table) => [
	foreignKey({
			columns: [table.setId],
			foreignColumns: [set.id],
			name: "card_set_id_fkey"
		}),
]);

export const image = pgTable("image", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	// biome-ignore lint/correctness/noPrecisionLoss: <explanation>
		id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "image_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	cardId: text("card_id").notNull(),
	url: text().notNull(),
	type: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.cardId],
			foreignColumns: [card.id],
			name: "image_card_id_fkey"
		}),
]);

export const market = pgTable("market", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	// biome-ignore lint/correctness/noPrecisionLoss: <explanation>
		id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "market_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	cardId: text("card_id").notNull(),
	url: text().notNull(),
	updatedAt: date("updated_at").notNull(),
	market: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.cardId],
			foreignColumns: [card.id],
			name: "market_card_id_fkey"
		}),
]);
