import { Message, MessageEmbed } from "discord-bot-quickstart";
import { ITicrocoachConfig, LolInfo } from "../bot";

export class Registration {
    private config: ITicrocoachConfig;
    private message: Message;
    private authorID: string;
    private embeds: MessageEmbed[];
    private steps: string[];
    private step: number = 0;
    private lolInfo: LolInfo;

    constructor(config: ITicrocoachConfig, message: Message, authorID: string, embeds: MessageEmbed[], lolInfo: LolInfo) {
        this.config = config;
        this.message = message;
        this.authorID = authorID;
        this.embeds = embeds;
        this.lolInfo = lolInfo;
        this.steps = Object.keys(lolInfo);
    }

    public nextStep(): void {
        if(this.step < this.steps.length)
            this.step++;

        this.edit();
    }

    public previousStep(): void {
        if(this.step > 0) {
            this.step--;
            this.edit();

            switch(this.step) {
                case 1:
                case 2:
                case 3:
                    this.message.reactions.removeAll();
                    this.react();
                    break;
            }
        }
        let reactions: any = this.message.reactions.cache.array();
        reactions[reactions.length - 3].users.remove(this.authorID);
    }

    public get_step(): number {
        return this.step;
    }

    public collectReactionsNumber(): number[] {
        let ret: number[] = new Array();
        this.message.reactions.cache.array().forEach(reaction => {
            if(reaction.count !== null) {
                if(reaction.count === 2)
                    reaction.users.remove(this.authorID);
                ret.push(reaction.count);
            } else {
                ret.push(1);
            }
        })
        return ret.slice(0, ret.length - 3);
    }

    public react(): void {

        for(let i = 0; i < (this.lolInfo as any)[this.steps[this.step]].length; i++)
            this.message.react(this.config.emojis.numbers[i]);
        
        this.message.react(this.config.emojis.previous);
        this.message.react(this.config.emojis.validate);
        this.message.react(this.config.emojis.cancel);
    }

    private edit(): void {
        this.message.edit(this.embeds[this.step]);
        if(this.step == 2 || this.step == 3) {
            this.message.reactions.removeAll();
            this.react();
        }
    }
}