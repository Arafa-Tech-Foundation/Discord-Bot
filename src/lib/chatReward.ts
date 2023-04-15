import { updateUsers } from './database';

const updateCooldown: number = 6; // seconds
const rewardConfig: Record<string, object> = {
    xp: {
        amount: (id: string) => { return 1 }, 
        cooldown: 0
    },

    currency: {
        amount: (id: string) => { return 1 },
        cooldown: 1
    }
};
let toReward: Record<string, object> = {};

function createLog(id: string): void {
    toReward[id] = {};
    for (const rewardType in rewardConfig) {
        toReward[id][rewardType] = {
            amount: 0,
            cooldownActive: false
        };
    }
}

function getGroups(): Record<string, Array<string>> {
    const groups = {};

    for (const id in toReward) {
        for (const rewardType in toReward[id]) {
            const amount = toReward[id][rewardType]['amount'];
            if (amount === 0) continue;
            if (!groups[rewardType]) groups[rewardType] = {};

            if (groups[rewardType][amount]) {
                groups[rewardType][amount].push(id);
            } else {
                groups[rewardType][amount] = [id];
            }
        }
    }
    
    return groups;
}

export function tryReward(id: string, rewardType: string): void {
    if (!toReward[id]) createLog(id);
    const rewardTypeData = toReward[id][rewardType];
    if (rewardTypeData['cooldownActive'] === false) {
        rewardTypeData['cooldownActive'] = true;
        setTimeout(() => {
            rewardTypeData['cooldownActive'] = false;
        }, rewardConfig[rewardType]['cooldown']);

        rewardTypeData['amount'] += rewardConfig[rewardType]['amount'](id)
    }
};

export function start(): void {
    function update(): void {
        const groups = getGroups();
        for (const rewardType in groups) {
            const group = groups[rewardType];
            for (const amount in group) {
                updateUsers([...group[amount]], {
                    [rewardType]: {
                        increment: Number(amount)
                    }
                })
            }
        }
        toReward = {};

        setTimeout(update, updateCooldown * 1000);
    }
    update();
};