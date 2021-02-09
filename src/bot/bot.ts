import { ITicrocoachConfig } from "./config";
import { IBot, Client, CommandMap, ParsedArgs, Interface, SuccessfulParsedMessage, Message} from 'discord-bot-quickstart';

export class Ticrocoach extends IBot<ITicrocoachConfig> {

    constructor(config: ITicrocoachConfig) {
        super(config, <ITicrocoachConfig>{
            command: {
                symbol: '/'
            },
            discord: {
                log: true
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
            leagueOfLegendsInfo: {
                lanes: ["Top", "Jungle", "Mid", "Adc", "Support", "Tout"],
                ranks: ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Diamond"],
                divisions: ["I", "II", "III", "IV"],
                specialtys: ["Laning phase", "Trade", "Vision", "Teamfights", "Pathing", "Ganking", "Jungle tracking", "Mental"]
            },
            emojis: {
                numbers: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'],
                validate: '✅',
                cancel: '❌'
            }
        });
    }

    onRegisterConsoleCommands(map: CommandMap<(args: ParsedArgs, rl: Interface) => void>): void {}
    onRegisterDiscordCommands(map: CommandMap<(cmd: SuccessfulParsedMessage<Message>, msg: Message) => void>): void {}
    onClientCreated(client: Client): void {}
    onReady(client: Client): void {}
}