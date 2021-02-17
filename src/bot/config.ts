import { IBotConfig } from 'discord-bot-quickstart';

export interface ITicrocoachConfig extends IBotConfig {
    keys: {
        riot: string
    },
    path: {
        db: {
            ticket: string,
            coach: string
        }
    },
    leagueOfLegendsInfo: {
        lanes: string[],
        ranks: string[],
        divisions: string[],
        specialties: string[]
    },
    emojis: {
        numbers: string[],
        back: string,
        validate: string,
        cancel: string
    }
}