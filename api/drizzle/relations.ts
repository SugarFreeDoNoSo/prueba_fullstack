import { relations } from "drizzle-orm/relations";
import { set, card, image, market } from "./schema.js";

export const cardRelations = relations(card, ({one, many}) => ({
	set: one(set, {
		fields: [card.setId],
		references: [set.id]
	}),
	images: many(image),
	markets: many(market),
}));

export const setRelations = relations(set, ({many}) => ({
	cards: many(card),
}));

export const imageRelations = relations(image, ({one}) => ({
	card: one(card, {
		fields: [image.cardId],
		references: [card.id]
	}),
}));

export const marketRelations = relations(market, ({one}) => ({
	card: one(card, {
		fields: [market.cardId],
		references: [card.id]
	}),
}));