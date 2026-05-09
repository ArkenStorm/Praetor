export interface StatEntry {
	stat: string;
	value: number;
}

interface FunctionalityConfig {
	enabled: boolean;
}

interface QuoteConfig extends FunctionalityConfig {
	embedColor?: string;
	channelId?: string;
}

interface ReactionBoardConfig extends FunctionalityConfig {
	threshold?: number;
	channelId?: string;
	emojis?: string[];
	board?: Record<string, Record<string, string>>;
}

export interface GuildConfig {
	defaults: { embedColor: string };
	commands?: {
		role?: FunctionalityConfig;
		quote?: QuoteConfig;
		story?: FunctionalityConfig;
		tag?: FunctionalityConfig;
		git?: FunctionalityConfig;
		gift?: FunctionalityConfig;
		stats?: FunctionalityConfig;
		autoreact?: FunctionalityConfig;
		reactionBoard?: ReactionBoardConfig;
	};
}

export interface Database {
	guilds: Record<string, GuildConfig>;
	statistics: Record<string, StatEntry[]>;
}
