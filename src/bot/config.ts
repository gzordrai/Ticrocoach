import { IBotConfig } from 'discord-bot-quickstart';

export interface ITicrocoachConfig extends IBotConfig {
    keys?: {
        riot?: string
    },
    path?: {
        db?: {
            ticket?: string,
            coach?: string
        }
    },
    leagueOfLegendsInfo?: {
        lanes?: string[],
        ranks?: string[],
        divisions?: string[],
        specialtys?: string[]
    },
    emojis?: {
        numbers?: string[],
        validate?: string,
        cancel?: string
    }
}