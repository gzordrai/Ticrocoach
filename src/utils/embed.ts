import { MessageEmbed } from "discord.js"

export class Embed {
    create() {
        return new MessageEmbed()
            .setColor("39f564");
    }

    createInfoEmbed(title: string, message: string) {
        return new MessageEmbed()
            .setColor("Blue")
            .setTitle(title)
            .setDescription(message);
    }

    createErrorEmbed(message: string) {
        return new MessageEmbed()
            .setColor("Red")
            .setTitle("Error !")
            .setDescription(message);
    }
}