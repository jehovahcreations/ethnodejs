const BIP39 = require("bip39")
const { hdkey } = require('@ethereumjs/wallet')
const { Wallet } = require('@ethereumjs/wallet')
const keccak256 = require('js-sha3').keccak256;
const {Web3} = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/b583808b7b2e46cbb73387292c1b60c7'));
const HDWallet = require('ethereum-hdwallet');
const fs = require('fs');

let time = 0.0001;
let derivationPath  =[`m/44'/60'/0'/0/0`,`m/44'/60'/1'/0/0`,`m/44'/60'/2'/0/0`,`m/44'/60'/3'/0/0`,`m/44'/60'/4'/0/0`,`m/44'/60'/5'/0/0`,`m/44'/60'/6'/0/0`,`m/44'/60'/7'/0/0`,`m/44'/60'/8'/0/0`,`m/44'/60'/9'/0/0`,`m/44'/60'/0'/0/0`,`m/44'/60'/0'/0/1`,`m/44'/60'/0'/0/2`,`m/44'/60'/0'/0/3`,`m/44'/60'/0'/0/4`,`m/44'/60'/0'/0/5`,`m/44'/60'/0'/0/6`,`m/44'/60'/0'/0/7`,`m/44'/60'/0'/0/8`,`m/44'/60'/0'/0/9`,];
//const mnemonic = "leisure letter buffalo wood blush trouble frame since divorce glove entry battle"



(async function generateMnemonic(){
    var mnemonic = BIP39.generateMnemonic()
    var isValid = BIP39.validateMnemonic(mnemonic)
    if(isValid){
const hdwallet = HDWallet.fromMnemonic(mnemonic);
for(i=0;i<derivationPath.length;i++){
    const privateKey = hdwallet.derive(derivationPath[i]).getPrivateKey().toString('hex');
    const address = hdwallet.derive(derivationPath[i]).getAddress().toString('hex');
    
            try {
                const balanceWei = await web3.eth.getBalance(`0x${address}`);
                const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
                console.log(`ETH Balance of 0x${address}: ${balanceEther} ETH`);
                const content =`menemonic:${mnemonic} | adress :0x${address} | privateKey:0x${privateKey} | balance: ${balanceEther} | derevationPath: ${derivationPath[i]}`
                
                
                if (balanceEther>0){
                    fs.writeFile(`${address}.txt`, content, (err) => {
                        if (err) {
                            console.error('Error writing file:', err);
                        } else {
                            console.log('File written successfully!');
                        }
                    });
                }
                time = 0.0001
            } catch (error) {
                time = 120000
                console.error(`Error fetching balance: ${error}`);
            }
            
       }
}

    setTimeout( generateMnemonic, time );
})()
