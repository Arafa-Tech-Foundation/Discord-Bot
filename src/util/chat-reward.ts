import { updateUsers } from './database';
const rewarded = new Map();
const dueRewards = new Map();

const rewardCooldown = 30     // seconds
const updateCooldown = 60 * 5 // seconds
const rewardAmount   = 1      // currency


function getGroups(): Record<string, string[]> {
    const groups = {} 
    for (const due of dueRewards) {
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
        setTimeout(() => rewarded.delete(id), rewardCooldown * 1000);
        dueRewards.set(id, (dueRewards.get(id) + rewardAmount) || 1);
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
        dueRewards.clear();
        setTimeout(update, updateCooldown * 1000);
    }
    update();
}