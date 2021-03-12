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
    emojis: {
        numbers: string[],
        previous: string,
        validate: string,
        cancel: string
    }
}