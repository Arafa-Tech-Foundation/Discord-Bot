import { updateUsers } from './database';

const rewarded = new Map();
const due_rewards = new Map();

const reward_cooldown = 30     // seconds
const update_cooldown = 60 * 5 // seconds
const reward_amount   = 1      // currency


function getGroups(): Record<string, string[]> {
    const groups = {} 
    for (const due of due_rewards) {
        if (groups[due[1]])
            groups[due[1]].push(due[0]);
        else
            groups[due[1]] = [due[0]];
    }
    return groups;
}

export function tryReward(id: string): void {
    if (rewarded.get(id) == undefined) {
        rewarded.set(id, true);
        setTimeout(() => rewarded.delete(id), reward_cooldown * 1000);
        due_rewards.set(id, (due_rewards.get(id) + reward_amount) || 1);
    }
}

export function start(): void {
    function update(): void {
        const groups = getGroups();
        for (const rewardAmt in groups) {
            const ids = groups[rewardAmt];
            updateUsers(ids, {
                currency: {
                    increment: Number(rewardAmt)
                }
            });
        }
        due_rewards.clear();
        setTimeout(update, update_cooldown * 1000);
    }
    update();
}