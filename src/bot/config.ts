import { IBotConfig } from 'discord-bot-quickstart';

export interface ITicrocoachConfig extends IBotConfig {
    keys?: {
        riot?: string
    },
    path?: {
        db?: string
    },
    emojis?: {
        numbers?: string[],
        validate?: string,
        cancel?: string
    }
}