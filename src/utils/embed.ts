import { MessageEmbed } from "discord-bot-quickstart";
import { ITicrocoachConfig, LolInfo } from "../bot"

export class Embed {
    private config: ITicrocoachConfig;

    constructor(config: ITicrocoachConfig) {
        this.config = config;
    }

    public create(): MessageEmbed {
        return new MessageEmbed()
            .setColor("#629530");
    }

    private createCoachChoiceEmbedDescriptions(obj: Object): string[] {
        let description: string, descriptions: string[] = new Array();
        Object.keys(obj).forEach(info => {
            description = "";
            for(let i: number = 0; i < (obj as any)[info].length; i++)
                description += `${this.config.emojis.numbers[i]} - ${(obj as any)[info][i]}\n`;
            descriptions.push(description);
        })
        return descriptions;
    }

    public createCoachChoiceEmbeds(steps: string[], lolInfo: LolInfo): MessageEmbed[] {
        let embeds: MessageEmbed[] = new Array();
        let descriptions: string[] = this.createCoachChoiceEmbedDescriptions(lolInfo);
        console.log(descriptions)
        for(let i: number = 0; i < steps.length; i++) {
            let embed: MessageEmbed = new MessageEmbed()
                .setTitle(`Veuillez choisir le/la/les ${steps[i]} que vous souhaitez coacher`)
                .setColor("#629530")
                .setDescription(descriptions[i])
                .setFooter(`${this.config.emojis.validate} pour valider votre selection\n${this.config.emojis.back} pour retourner à l'étape précedente\n${this.config.emojis.cancel} pour annuler la commande`);
            embeds.push(embed);
        }
        return embeds;
    }

    public createInfoEmbed(title: string, message: string) {
        return new MessageEmbed()
            .setColor("Blue")
            .setTitle(title)
            .setDescription(message);
    }

    public createErrorEmbed(message: string) {
        return new MessageEmbed()
            .setColor("Red")
            .setTitle("Error !")
            .setDescription(message);
    }
}