import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';
const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0xB4EeDbEeC6E786E8A249d22Dba23C6393dA8cc41'
);
export default instance;