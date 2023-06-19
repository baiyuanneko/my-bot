const { createClient, segment } = require("oicq");
const { readFileSync, writeFileSync, existsSync, read } = require("fs");


// load configuartion file

if (existsSync(__dirname + "/config.json") === false) {
    console.log("[ERROR] Cannot found a valid config.json inside the bot directory! Exiting...");
    process.exit();
}

const configuration_raw = readFileSync(__dirname + "/config.json", "utf-8");

try {
    JSON.parse(configuration_raw);
} catch (error) {
    console.log("[ERROR] The format of index.json is wrong! Exiting...");
    process.exit();

}

const configuration = JSON.parse(configuration_raw);


if (typeof configuration.account_number === "undefined" || typeof configuration.login_via === "undefined" || typeof configuration.owner === "undefined") {
    console.log("[ERROR] Cannot found account_number or login_via section in the configuration file! Exiting...");
    process.exit();
}

// load ruleset file

const judgeWhetherTriggerPossibility = function (possibility_percentage) {
    if (Math.ceil(Math.random() * 100) >= possibility_percentage) {
        return false;
    } else {
        return true;
    }
}

if (existsSync(__dirname + "/rule_sets.json") === false) {
    console.log("[ERROR] Cannot found a valid rule_sets.json inside the bot directory! Exiting...");
    process.exit();
} else {

    ruleset = JSON.parse(readFileSync(__dirname + "/rule_sets.json", "utf-8"));
    console.log("[INFO] Ruleset loaded!");

    setInterval(function () {

        ruleset = JSON.parse(readFileSync(__dirname + "/rule_sets.json", "utf-8"));

        let currentDate = new Date();

        console.log(`[INFO] Ruleset is automatically updated at ${currentDate}`);

        if(typeof ruleset.every_20_minutes_has_possibility_to_trigger_script === "undefined"){
            
        }else{
            for(let ruleset_forvar=0;ruleset_forvar<ruleset.every_20_minutes_has_possibility_to_trigger_script.length;ruleset_forvar++){
                if(judgeWhetherTriggerPossibility(ruleset.every_20_minutes_has_possibility_to_trigger_script[ruleset_forvar]["possibility_percentage"])){
                    eval(readFileSync(__dirname + "/scripts/" + ruleset.every_20_minutes_has_possibility_to_trigger_script[ruleset_forvar]["when_triggered_execute_script"] + ".js", "utf-8")); 
                }
            }
        }

    }, 1200000);


}

const account_number = parseInt(configuration.account_number);
const login_via = configuration.login_via;

switch (login_via) {
    case "qrcode":
        {
            // output some basic info
            console.log(`[INFO] Now try to login ${account_number} via qrcode.`);
            console.log("[INFO] Now the bot is using android watch platform by default.");

            // create bot client

            bot_client = createClient(account_number, { platform: 3 });

            // login bot client via qrcode

            bot_client.on("system.login.qrcode", function () {

                // notice users to press Enter to login or refresh QRCode image
                console.log("\n");
                console.log("[IMPORTANT] After you approved this login on your mobile device, press Enter to continue");
                console.log("[IMPORTANT] If the QRCode image has been expired, you may also press Enter to request a new QRCode image to login.");
                console.log("\n");

                // get logged in

                process.stdin.once("data", () => {
                    this.login();
                })
            }).login();

            bot_client.on("message.group", function (msg) {

                if (typeof ruleset.only_works_in_group_number_array === "undefined" || ruleset.only_works_in_group_number_array.length === 0 || ruleset.only_works_in_group_number_array.indexOf(msg.group.group_id) !== -1) {

                    if (typeof ruleset.exclude_group_number_array === "undefined" || ruleset.exclude_group_number_array.length === 0 || ruleset.exclude_group_number_array.indexOf(msg.group.group_id) === -1) {

                        if (typeof ruleset.rules_of_triggered_by_messages_including_specific_words_sent_by_everyone_in_a_group === "undefined") {
                        } else {
                            for (let ruleset_forvar = 0; ruleset_forvar < ruleset.rules_of_triggered_by_messages_including_specific_words_sent_by_everyone_in_a_group.length; ruleset_forvar++) {
                                if (msg.raw_message.indexOf(ruleset.rules_of_triggered_by_messages_including_specific_words_sent_by_everyone_in_a_group[ruleset_forvar].a_trigger_word) !== -1) {
                                    eval(readFileSync(__dirname + "/scripts/" + ruleset.rules_of_triggered_by_messages_including_specific_words_sent_by_everyone_in_a_group[ruleset_forvar]["when_triggered_execute_script"] + ".js", "utf-8"));
                                }
                            }
                        }

                        if (typeof ruleset.rules_of_triggered_by_someone_at_bot === "undefined") {

                        } else {
                            if (msg.atme === true) {
                                for (let ruleset_forvar = 0; ruleset_forvar < ruleset.rules_of_triggered_by_someone_at_bot.length; ruleset_forvar++) {
                                    if (msg.raw_message.indexOf(ruleset.rules_of_triggered_by_someone_at_bot[ruleset_forvar].a_trigger_word) !== -1) {
                                        eval(readFileSync(__dirname + "/scripts/" + ruleset.rules_of_triggered_by_someone_at_bot[ruleset_forvar]["when_triggered_execute_script"] + ".js", "utf-8"));
                                    }
                                }

                                if (msg.sender.user_id === configuration.owner) {
                                    if (msg.raw_message.indexOf("debug:update-ruleset") !== -1) {
                                        ruleset = JSON.parse(readFileSync(__dirname + "/rule_sets.json", "utf-8"));
                                        let currentDate = new Date();
                                        msg.reply(`[INFO] Ruleset is manually updated at ${currentDate}`);
                                    }

                                    if (msg.raw_message.indexOf("debug:show-ruleset") !== -1) {
                                        msg.reply("[INFO] " + JSON.stringify(ruleset));
                                    }

                                    if (msg.raw_message.indexOf("debug:stop-now") !== -1) {
                                        msg.reply("[INFO] Interrupt signal received, the bot is going to be stopped in 2 seconds");
                                        setTimeout(function () {
                                            process.exit();
                                        }, 2000);
                                    }
                                }
                            }
                        }

                        if (msg.sender.user_id === configuration.owner) {
                            if (typeof ruleset.rules_of_triggered_by_messages_including_specific_words_sent_by_owner_of_bot === "undefined") {

                            } else {
                                for (let ruleset_forvar = 0; ruleset_forvar < ruleset.rules_of_triggered_by_messages_including_specific_words_sent_by_owner_of_bot.length; ruleset_forvar++) {
                                    if (msg.raw_message.indexOf(ruleset.rules_of_triggered_by_messages_including_specific_words_sent_by_owner_of_bot[ruleset_forvar].a_trigger_word) !== -1) {
                                        eval(readFileSync(__dirname + "/scripts/" + ruleset.rules_of_triggered_by_messages_including_specific_words_sent_by_owner_of_bot[ruleset_forvar]["when_triggered_execute_script"] + ".js", "utf-8"));
                                    }
                                }
                            }
                        }

                        if (typeof ruleset.rules_of_triggered_by_messages_including_specific_words_sent_by_specific_person_in_a_group === "undefined") {

                        } else {
                            for (let ruleset_forvar = 0; ruleset_forvar < ruleset.rules_of_triggered_by_messages_including_specific_words_sent_by_specific_person_in_a_group.length; ruleset_forvar++) {
                                if (msg.raw_message.indexOf(ruleset.rules_of_triggered_by_messages_including_specific_words_sent_by_specific_person_in_a_group[ruleset_forvar].a_trigger_word) !== -1) {
                                    if (ruleset.rules_of_triggered_by_messages_including_specific_words_sent_by_specific_person_in_a_group[ruleset_forvar].can_be_triggered_by_person_array.indexOf(msg.sender.user_id) !== -1) {
                                        eval(readFileSync(__dirname + "/scripts/" + ruleset.rules_of_triggered_by_messages_including_specific_words_sent_by_specific_person_in_a_group[ruleset_forvar]["when_triggered_execute_script"] + ".js", "utf-8"));
                                    }
                                }
                            }
                        }
                    }
                }
            })

        }
        break;
    case "password":
        {
            console.error("[IMPORTANT] Currently not support login via password, please login via qrcode");
        }
        break;
    default:
        {
            console.error(`[IMPORTANT] Currently not support login via ${login_via}, please try login via other methods`);
        }
        break;
}

process.on("unhandledRejection", (rejection_reason, rejection_promise) => {
    console.log(`[ERROR] The reason is specified as follow.`)
    console.log(rejection_reason);
})
