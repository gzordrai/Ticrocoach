import { Embed } from "../utils/"
import { ITicrocoachConfig, LolInfo } from "./";
import { IBot, Client, CommandMap, ParsedArgs, Interface, SuccessfulParsedMessage, Message, MessageEmbed } from 'discord-bot-quickstart';
import { Registration, Coach } from "../coach";

export class Ticrocoach extends IBot<ITicrocoachConfig> {
    private lolInfo: LolInfo = new LolInfo();
    private embed: Embed = new Embed(this.config);

    constructor(config: ITicrocoachConfig) {
        super(config, <ITicrocoachConfig>{
            command: {
                symbol: '/'
            },
            discord: {
                log: false
            },
            directory: {
                plugins: "../plugins",
                logs: "../../log"
            },
            path: {
                db: {
                    ticket: "../data/tickets.json",
                    coach: "../data/coachs.json"
                }
            },
            emojis: {
                numbers: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'],
                previous: '◀️',
                validate: '✅',
                cancel: '❌'
            }
        });
    }

    onRegisterConsoleCommands(map: CommandMap<(args: ParsedArgs, rl: Interface) => void>): void { }
    onRegisterDiscordCommands(map: CommandMap<(cmd: SuccessfulParsedMessage<Message>, msg: Message) => void>): void {
        map.on("register", (cmd: SuccessfulParsedMessage<Message>, msg: Message) => {
            if (msg.channel.type !== "text")
                return msg.reply("le channel n'est pas de type 'text'");

            let steps: string[] = Object.keys(this.lolInfo);
            let embeds: MessageEmbed[] = this.embed.createCoachChoiceEmbeds(steps, this.lolInfo);
            let j: number = 0;

            msg.channel.send(embeds[0])
                .then(m => {
                    let coach = new Coach(msg.author.id);
                    let registration = new Registration(this.config, m, msg.author.id, embeds, this.lolInfo);
                    registration.react();

                    const filter = (reaction: any, user: any) => user.id === msg.author.id &&
                        (
                            reaction.emoji.name === this.config.emojis.previous ||
                            reaction.emoji.name === this.config.emojis.validate ||
                            reaction.emoji.name === this.config.emojis.cancel
                        );

                    const collector = m.createReactionCollector(filter, {})
                        .on("collect", async (reaction, user) => {

                            switch(reaction.emoji.name) {
                                case this.config.emojis.cancel: m.delete(); break;
                                case this.config.emojis.previous: registration.previousStep(); break;
                                case this.config.emojis.validate:

                                    let reactionsNumber: number[] = await registration.collectReactionsNumber();
                                    for (let i: number = 0; i < reactionsNumber.length; i++) {
                                        if (reactionsNumber[i] === 2) {
                                            j++;
                                            switch(registration.get_step()) {
                                                case 0:
                                                    coach.add_lane(this.lolInfo.lanes[i]);
                                                    break;

                                                //MAX: 2 ranks
                                                case 1:
                                                    if(j < 2)
                                                        coach.add_rank(this.lolInfo.ranks[i]);
                                                    break;

                                                //MAX: 2 divisions
                                                case 2:
                                                    if(j < coach.get_rank.length)
                                                        coach.add_division(this.lolInfo.divisions[i]);
                                                    break;

                                                case 3:
                                                    coach.add_specialty(this.lolInfo.specialties[i]);
                                                    break;
                                            }
                                        }
                                    }

                                    if(j === 0) {
                                        msg.channel.send("Pas de choix selectionné !")
                                            .then(m => m.delete({timeout: 5000}));
                                    } else {
                                        if(registration.get_step() < 3)
                                            registration.nextStep();
                                        else
                                            collector.stop();
                                    }
                                    break;
                            }
                        })
                        .on("end", () => {
                            if(registration.get_step() === 3) {
                                msg.channel.send("Veuillez choisir votre présentation de coach (en un seul message)")
                                    .then(m => {
                                        m.channel.awaitMessages((message: Message) => message.author.id === msg.author.id, { max: 1 })
                                            .then(collected => {
                                                let s: string | undefined = collected.first()?.content;

                                                if(s !== undefined)
                                                    coach.set_description(s);
                                                else {
                                                    msg.channel.send("Une erreur est survenue !");
                                                    coach.set_description("");
                                                }

                                                msg.channel.send("Votre profil de coach a été enregistrer avec succès !")
                                                    .then(mg => mg.delete({ timeout: 5000 }));
                                                m.delete();
                                                msg.delete();
                                            })
                                    })
                            }
                        })
                })
        })
        .on("add", (cmd: SuccessfulParsedMessage<Message>, msg: Message) => {
            console.log(cmd);
        })
    }
    onClientCreated(client: Client): void { }
    onReady(client: Client): void { }
}