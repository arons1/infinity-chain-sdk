import { WEBSOCKETS } from '../constants';
import WebSocket from 'ws';
const no_op = () => {};
export class TrezorWebsocket {
    messageID: number;
    url: string;
    connected: boolean;
    wallets: Record<string, string[]> = {};
    pendingMessages: Record<string, any> = {};
    subscribeAddressesId: any;
    ws: WebSocket | undefined;
    subscriptions: any;
    coin: string;
    timeOutInt: NodeJS.Timeout | undefined;
    callbacks: Record<string, any> = {};
    constructor(coin: string) {
        this.url = WEBSOCKETS[coin];
        this.messageID = 0;
        this.coin = coin;
        this.connected = false;
        this.wallets = {};
    }
    clean() {
        this.unsubscribeAddresses();
        this.wallets = {};
    }

    send(
        method: string,
        params: Record<string, any>,
        callback: (rs?: any) => void,
    ) {
        try {
            if (!this.connected) {
                callback();
            } else {
                var id = this.messageID.toString();
                this.messageID++;
                this.pendingMessages[id] = callback;
                setTimeout(() => {
                    if (this.pendingMessages[id]) callback();
                }, 5000);
                var req = {
                    id,
                    method,
                    params,
                };
                if (this.ws && this.ws.readyState === this.ws.OPEN) {
                    this.ws.send(JSON.stringify(req));
                } else {
                    callback();
                }
                return id;
            }
        } catch (e) {
            console.error(e);
            callback();
        }
    }
    subscribe(
        method: string,
        params: Record<string, any>,
        callback: (rs?: any) => void,
    ) {
        var ts = this;

        try {
            if (!this.connected) {
                this.connect();
                return;
            }
            var id = this.messageID.toString();
            this.messageID++;
            this.subscriptions[id] = callback;
            var req = {
                id,
                method,
                params,
            };
            if (this.ws == undefined) {
                setTimeout(function () {
                    ts.subscribe(method, params, callback);
                }, 5000);
                return;
            }
            if (this.ws && this.ws.readyState === this.ws.OPEN) {
                this.ws.send(JSON.stringify(req));
                callback();
            } else {
                console.log(
                    '[ERROR] ' +
                        this.coin +
                        ' websockets: Trying to subscribe an address with the connection closed',
                );
            }
            return id;
        } catch (e) {
            console.error(e);
            callback();
        }
    }
    unsubscribe(
        method: string,
        id: string,
        params: Record<string, any>,
        callback: (rs?: any) => void,
    ) {
        var ts = this;

        try {
            delete this.subscriptions[id];
            this.pendingMessages[id] = callback;
            var req = {
                id,
                method,
                params,
            };
            if (this.ws == undefined) {
                setTimeout(function () {
                    ts.unsubscribe(method, id, params, callback);
                }, 5000);
                return;
            }
            if (this.ws && this.ws.readyState === this.ws.OPEN) {
                this.ws.send(JSON.stringify(req));
            } else {
                console.log(
                    '[ERROR] ' +
                        this.coin +
                        ' websockets: Trying to unsubscribe an address with the connection closed',
                );
            }
            return id;
        } catch (e) {
            console.error(e);
        }
    }

    subscribeAddresses(
        wallet: string,
        accounts: string[],
        callback: (pr?: any) => void,
    ) {
        if (accounts.length > 50) {
            accounts = accounts.slice(accounts.length - 50, 50);
        }
        accounts = accounts.map(s => s.trim());
        if (this.subscribeAddressesId) {
            this.subscribeAddressesId = '';
        }
        this.callbacks[wallet] = callback;
        this.subscribeAddressesId = this.subscribe(
            'subscribeAddresses',
            { accounts },
            this.callbacks[wallet],
        );
    }

    unsubscribeAddresses() {
        var _ = this;
        this.unsubscribe(
            'unsubscribeAddresses',
            this.subscribeAddressesId,
            {},
            () => {
                _.subscribeAddressesId = '';
            },
        );
    }

    get listAddresses() {
        var allAddresses: string[] = [];
        for (let wallet of Object.keys(this.wallets)) {
            allAddresses = [...allAddresses, ...this.wallets[wallet]];
        }
        return allAddresses;
    }

    async connectCoin(accounts: string[], wallet: string) {
        this.wallets[wallet] = accounts;
        this.subscribeAddresses(wallet, accounts, this.callbacks[wallet]);
    }

    connect() {
        if (this.ws != undefined || this.connected) return;
        this.messageID = 0;
        this.pendingMessages = {};
        this.subscriptions = {};
        this.connected = false;

        var pusher = this;
        this.subscribeAddressesId = '';
        var server = this.url;
        if (server.startsWith('http')) {
            server = server.replace('http', 'ws');
        }
        if (!server.endsWith('/websocket')) {
            server += '/websocket';
        }
        this.ws = new WebSocket(server);
        this.ws.onopen = function () {
            console.log(pusher.coin + ' websockets: Connected');
            pusher.connected = true;
            for (let wallet in pusher.wallets) {
                pusher.connectCoin(pusher.wallets[wallet], wallet);
            }
            pusher.timeOutInt = setInterval(function () {
                if (
                    pusher.ws != undefined &&
                    pusher.ws.readyState === pusher.ws.OPEN
                )
                    pusher.send('getInto', {}, no_op);
            }, 20000);
        };
        this.ws.onclose = function () {
            pusher.connected = false;
            console.log(pusher.coin + ' websockets: Disconnected');
            clearInterval(pusher.timeOutInt);
            console.log(
                pusher.coin +
                    ' websocket disconected, reconnecting in 30 seconds',
            );
            pusher.timeOutInt = setTimeout(function () {
                pusher.connect();
            }, 30000);
        };
        this.ws.onerror = function (e) {
            pusher.connected = false;
            console.error(e);
            console.log('[ERROR] ' + pusher.coin + ' websockets: ');
        };
        this.ws.onmessage = async function (e: any) {
            var resp = JSON.parse(e.data);
            var f = pusher.pendingMessages[resp.id];
            if (f != undefined) {
                delete pusher.pendingMessages[resp.id];
                f(resp.data);
            } else {
                f = pusher.subscriptions[resp.id];
                if (f != undefined) {
                    f(resp.data);
                }
            }
        };
    }
}
