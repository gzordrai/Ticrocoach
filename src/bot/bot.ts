import { Embed, Coach } from "../utils/"
import { ITicrocoachConfig, LolInfo } from "./";
import { IBot, Client, CommandMap, ParsedArgs, Interface, SuccessfulParsedMessage, Message, MessageEmbed } from 'discord-bot-quickstart';

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
                back: '◀️',
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

            let i: number = 0, j: number = 0, k: number = 0, step: number = 0;
            let embeds: MessageEmbed[] = this.embed.createCoachChoiceEmbeds(Object.keys(this.lolInfo), this.lolInfo);
            let ret: string[] = new Array();
            let coach: Coach = new Coach(msg.author.id);
            let reactionsNumber: number[] = new Array();

            msg.channel.send(embeds[step])
                .then(m => {
                    //Message reactions
                    for (i = 0; i < this.lolInfo.lanes.length; i++)
                        m.react(this.config.emojis.numbers[i]);
                    m.react(this.config.emojis.back);
                    m.react(this.config.emojis.validate);
                    m.react(this.config.emojis.cancel);

                    const filter = (reaction: any, user: any) => user.id === msg.author.id &&
                        (
                            reaction.emoji.name === this.config.emojis.back ||
                            reaction.emoji.name === this.config.emojis.validate ||
                            reaction.emoji.name === this.config.emojis.cancel
                        );

                    const collector = m.createReactionCollector(filter, {})
                        .on("collect", async (reaction, user) => {
                            reactionsNumber = new Array();
                            i = 0;
                            k = 0;

                            //Reaction number collector
                            await m.reactions.cache.array().forEach(reaction => {
                                if (reaction.count !== null) {
                                    if (reaction.count === 2)
                                        reaction.users.remove(msg.author.id);
                                    reactionsNumber.push(reaction.count);
                                    i++;
                                }
                                else
                                    reactionsNumber.push(1);
                            })
                            reactionsNumber = reactionsNumber.splice(0, reactionsNumber.length - 3);

                            switch (reaction.emoji.name) {
                                //Choice back
                                case this.config.emojis.back:
                                    if (step !== 0) {
                                        step--;
                                        coach.reset(step);
                                        m.edit(embeds[step])
                                            .then(mg => {
                                                switch (step) {
                                                    case 1:
                                                        m.reactions.removeAll();

                                                        for (j = 0; j < this.lolInfo.divisions.length; j++)
                                                            m.react(this.config.emojis.numbers[j]);

                                                        m.react(this.config.emojis.back);
                                                        m.react(this.config.emojis.validate);
                                                        m.react(this.config.emojis.cancel);
                                                        break;

                                                    case 2:
                                                        m.reactions.removeAll();

                                                        for (j = 0; j < this.lolInfo.specialties.length; j++)
                                                            m.react(this.config.emojis.numbers[j]);

                                                        m.react(this.config.emojis.back);
                                                        m.react(this.config.emojis.validate);
                                                        m.react(this.config.emojis.cancel);
                                                        break;
                                                }
                                            })
                                    }
                                    else
                                        return msg.channel.send(new Embed(this.config).createErrorEmbed("Vous êtes déja à la première étape !")).then(mg => mg.delete({ timeout: 3000 }));
                                    break;

                                //Choice cancel
                                case this.config.emojis.cancel: collector.stop(); break;

                                //Choice validation
                                case this.config.emojis.validate:
                                    for (i = 0; i < reactionsNumber.length; i++) {
                                        if (reactionsNumber[i] === 2) {
                                            switch (step) {
                                                //Lane selection
                                                case 0:
                                                    coach.add_lane(this.lolInfo.lanes[i]);
                                                    k++;
                                                    break;

                                                //Rank selection
                                                case 1:
                                                    if (k < 2) {
                                                        coach.add_rank(this.lolInfo.ranks[i]);
                                                        k++;
                                                    }
                                                    break;

                                                //Divisions selection
                                                case 2:
                                                    if (k < 2) {
                                                        ret.push(this.lolInfo.divisions[i]);
                                                        coach.add_division(ret);
                                                        k++;
                                                    }
                                                    break;

                                                //Specialties selection
                                                case 3:
                                                    coach.add_specialty(this.lolInfo.specialties[i]);
                                                    k++;
                                                    break;
                                            }
                                        }
                                    }

                                    if (k === 0)
                                        msg.channel.send(new Embed(this.config).createErrorEmbed("Vous n'avez pas selectionner un choix !")).then(mg => mg.delete({ timeout: 3000 }));
                                    else if (k !== 0) {
                                        switch (step) {
                                            case 1:
                                                m.reactions.removeAll();

                                                for (j = 0; j < this.lolInfo.divisions.length; j++)
                                                    m.react(this.config.emojis.numbers[j]);

                                                m.react(this.config.emojis.back);
                                                m.react(this.config.emojis.validate);
                                                m.react(this.config.emojis.cancel);
                                                break;

                                            case 2:
                                                m.reactions.removeAll();

                                                for (j = 0; j < this.lolInfo.specialties.length; j++)
                                                    m.react(this.config.emojis.numbers[j]);

                                                m.react(this.config.emojis.back);
                                                m.react(this.config.emojis.validate);
                                                m.react(this.config.emojis.cancel);
                                                break;
                                        }

                                        step++;
                                        if (step < embeds.length)
                                            m.edit(embeds[step]);
                                        else
                                            collector.stop();
                                    }
                                    break;
                            }
                        })

                    collector.on("end", () => {
                        msg.channel.send("Veuillez saisir votre présentation de coach (en un seul message):")
                            .then(mg => {
                                const f = (message: any) => message.author.id === msg.author.id;
                                mg.channel.awaitMessages(f, { max: 1 })
                                    .then(collected => {
                                        let s: string | undefined = collected.first()?.content;
                                        if (s !== undefined)
                                            coach.set_description(s);
                                        else
                                            coach.set_description("");

                                        msg.delete();
                                        m.delete();
                                        mg.delete();
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            })
                    })
                })
        })
    }
    onClientCreated(client: Client): void { }
    onReady(client: Client): void { }
}