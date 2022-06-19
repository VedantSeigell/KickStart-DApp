import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';
const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x86DeC57Fe629F363e22f63a6D2a379D1bE8E5e43'
);
export default instance;