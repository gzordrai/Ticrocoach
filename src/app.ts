import { requireFile } from 'discord-bot-quickstart';
import { Ticrocoach, ITicrocoachConfig } from './bot';

const config: ITicrocoachConfig = requireFile('../config.json');
const bot = new Ticrocoach(config);

bot.connect()
    .then(() => {
        bot.logger.debug("Ticrocoah is Online");
        bot.listen();
    })
    .catch(err => bot.logger.error(err));