
# my-bot

## usage

### init the bot

```sh
git clone https://github.com/baiyuanneko/my-bot
cd my-bot
mv ./scripts_example scripts
mv ./config_example.json config.json
mv ./rule_sets_example.json rule_sets.json
```

Then use your favourite editor to edit ```config.json```, change the value of ```account_number``` to the account number of your **bot** and change the value ```owner``` to the account number of ```yourself```.

### start the bot

```sh
npm run start
```

### use the bot

#### Rule set

The Rule set is a series of rules that defines how to trigger the bot and how the bot replies. You can configurate the rule set by editing ```rule_sets.json```. 

> The value of ```when_triggered_execute_script``` doesn't need to add ```.js``` prefix, but you need to put the js file with prefix in the ```scripts``` folder.

```rule_sets.json``` is read when the program starts. Every 20 minutes (after the program started) will the program auto-check whether its content has been updated. Also see **Trigger debug operations of the bot** chapter in this README file if you want do this manually.

#### Scripts

When the bot is triggered by the rules in rule set, the bot will execute a script (which script to execute is defined in ```rule_sets.json```).

#### Trigger debug operations of the bot

You can "at" the bot while sending the following messages to trigger debug operations.

1. Update Rule set manually
```
debug:update-ruleset
```

2. Show the content of Rule set
```
debug:show-ruleset
```