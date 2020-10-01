import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import { JsonRpc } from 'eosjs';//import { Api, JsonRpc } from 'eosjs';
//import ScatterJS from 'scatterjs-core';
//import ScatterEOS from 'scatterjs-plugin-eosjs2';
/** Para iniciar se debe crear el objeto EosService para un mejor manejo de los datos
 * this.scatter sirve para comprobar si Scatter se encuentra en corriendo en el fondo
 * this.account es para guardar los datos de la sesión (cerrada o iniciada)
 */

const endpoint = 'http://localhost:8888';
const network = ScatterJS.Network.fromJson({
    blockchain:'eos',
    chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
    host:'localhost',
    port:8888,
    protocol:'http'
});
class EosService {
    constructor(dappName, contractAccount) {
        this.dappName = dappName;
        this.contractAccount = contractAccount;
        ScatterJS.plugins(new ScatterEOS());
        this.rpc = new JsonRpc(endpoint);//network.fullhost);
        this.account = null;
        this.scatter = null;
        window.ScatterJS = null;
    }

    connectas = async () => {
        //await ScatterJS.connect('EOSDiseños', {network}).then(connected => {
        //await ScatterJS.scatter.connect(this.dappName).then(connected => {
            //if(!connected) return console.error('Erro al intentar conectarse con Scatter');//'No se encuentra Scatter');

            //this.scatter = ScatterJS.scatter;
            
            //const eos = ScatterJS.eos(network, Api, {rpc: this.rpc});
        //try {
        await ScatterJS.connect(this.dappName, {network}).then(connected => {
            if(!connected) return console.error(this.dappName);//'No se encuentra Scatter');
            //return console.error(this.dappName);
            // No llamas a esta función a menos que vallas a hacer una transacción
            //const eos = ScatterJS.eos(network, Api, {rpc: this.rpc});
        
            /*ScatterJS.login().then(id => {
                if(!id) return console.error('No se encontró identity');
                
                this.account = ScatterJS.account('eos');
                / *const account = ScatterJS.account('eos');
        
                eos.transact({
                    actions: [{
                        account: `hello`,
                        name: 'hi',
                        authorization: [{
                            actor: account.name,
                            permission: account.authority,
                        }],
                        data: {
                            user: account.name
                        },
                    }]
                }, {
                    blocksBehind: 3,
                    expireSeconds: 30,
                }).then(res => {
                    console.log('sent: ', res);
                }).catch(err => {
                    console.error('error: ', err);
                });* /
            });*/
        });

        /*} catch (e){
            alert(e.message);
        }*/

        /*await this.scatter.getIdentity({ accounts: [network] }).then(() => {
            this.account = this.scatter.identity.accounts.find(
                e => e.blockchain === 'eos'
            );
        });*/
        await ScatterJS.login().then(id => {
            if(!id) return console.error('No se encontró identity');
            
            this.account = ScatterJS.account('eos');
            /*const account = ScatterJS.account('eos');
    
            eos.transact({
                actions: [{
                    account: `hello`,
                    name: 'hi',
                    authorization: [{
                        actor: account.name,
                        permission: account.authority,
                    }],
                    data: {
                        user: account.name
                    },
                }]
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            }).then(res => {
                console.log('sent: ', res);
            }).catch(err => {
                console.error('error: ', err);
            });*/
        });
      
        if (this.account === null) {
            //alert("fffffffffffffff");
            return false;
        }//else{
            //alert(this.account.name);
        //}
      
        return true;
    }

    connectNet = async () => {
        /*ScatterJS.scatter.connect('YOUR_APP_NAME').then(connected => {
            if(!connected){
                // Either the user doesn't have Scatter, or it's closed.
                console.error('Could not connect to Scatter.');
                return;
            }

            // If we are connected, let's make a reference to the Scatter object now.
            this.scatter = ScatterJS.scatter;
        })*/
        //await ScatterJS.connect('EOSDiseños', {network}).then(connected => {
        //await ScatterJS.scatter.connect(this.dappName).then(connected => {
            //if(!connected) return console.error('Erro al intentar conectarse con Scatter');//'No se encuentra Scatter');

            //this.scatter = ScatterJS.scatter;
            
            //const eos = ScatterJS.eos(network, Api, {rpc: this.rpc});
        //try {
        await ScatterJS.connect(this.dappName, {network}).then(connected => {
            if(!connected) return false;//console.error(this.dappName);//'No se encuentra Scatter');
            //return console.error(this.dappName);
            // No llamas a esta función a menos que vallas a hacer una transacción
            //const eos = ScatterJS.eos(network, Api, {rpc: this.rpc});
            
            // If we are connected, let's make a reference to the Scatter object now.
            this.scatter = ScatterJS.scatter;
        });

        if (this.scatter !== null) {
            return true;
        } else {
            return false;
        }

        
      
        /*if (this.account === null) {
            alert("fffffffffffffff");
            return false;
        }else{
            alert(this.account.name);
        }
      
        return true;*/
    }

    // Aquí solo se retorna la cuenta en caso de existir una
    verificarSesionEos () {
        // No scatter or no Identity/Login yet
        if(!this.scatter || !this.scatter.identity) return null;
        // Returning the EOSIO account
        return this.scatter.identity.accounts[0];
    }

    // Aquí se obtiene la cuenta en caso de que el usuario ecepte dar el permiso (allow)
    iniciarSesion = async () => {
        //this.scatter.getIdentity({accounts:[network]});
        //alert(this.account);
        console.log(this.account);
        //alert(this.scatter);
        console.log(this.scatter);
        await ScatterJS.login().then(id => {
            if(!id) return console.error('No se encontró identity');
            this.account = ScatterJS.account('eos');
        });
        return true;
        /*if (this.account === null) {
            alert("fffffffffffffff");
            return false;
        }else{
            alert(this.account.name);
        }*/
    }

    logout = async () => {
        //this.scatter.forgetIdentity();
        try {
            /*await ScatterJS.connect(this.dappName, {network}).then(connected => {
                if(!connected) return console.error(this.dappName);//'No se encuentra Scatter');
                //const eos = ScatterJS.eos(network, Api, {rpc: this.rpc});
                await ScatterJS.logout();
                this.account = null;
                this.scatter = ScatterJS.scatter;
                alert(this.scatter.identity.accounts[0].name);
            });
            alert("Función desconectar");
            alert(this.scatter.identity.accounts[0].name);*/
            await ScatterJS.logout();
            //this.account = null;
        //this.scatter = ScatterJS.scatter;
            //alert(this.scatter.identity.accounts[0].name);
            //alert("Función desconectar");
            //alert(this.scatter.identity.accounts[0].name);
        } catch (e){
            alert(e.message);
        }
      
        return true;
    }
}
export default EosService;

//ScatterJS.plugins( new ScatterEOS() );

/*const network = ScatterJS.Network.fromJson({
    blockchain:'eos',
    chainId:'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
    host:'localhost',   
    port:8888,
    protocol:'http'
});*/
//const rpc = new JsonRpc(network.fullhost());

/*ScatterJS.connect('YourAppName', {network}).then(connected => {
    if(!connected) return console.error('no scatter');

    const eos = ScatterJS.eos(network, Api, {rpc});

    ScatterJS.login().then(id => {
        if(!id) return console.error('no identity');
        const account = ScatterJS.account('eos');

        eos.transact({
            actions: [{
                account: 'eosio.token',
                name: 'transfer',
                authorization: [{
                    actor: account.name,
                    permission: account.authority,
                }],
                data: {
                    from: account.name,
                    to: 'safetransfer',
                    quantity: '0.0001 EOS',
                    memo: account.name,
                },
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        }).then(res => {
            console.log('sent: ', res);
        }).catch(err => {
            console.error('error: ', err);
        });
    });
});*/