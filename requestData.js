const axios = require('axios');
const cashInUrl = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in';
const cashOutNaturalUrl = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural';
const cashOutJuridicalUrl = 'http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical';

 const request = () => {
     return new Promise((resolve) => {
        axios.all([axios.get(cashInUrl), axios.get(cashOutNaturalUrl), axios.get(cashOutJuridicalUrl)])
        .then(axios.spread(  (cashIn, cashOutNatural, cashOutJuridical) => {
            resolve({
                cashIn : cashIn.data,
                natural : cashOutNatural.data,
                juridical : cashOutJuridical.data
                  }) 
        }));
     })
 }

module.exports = {
    getCommissions: async () => {
        let allCommissions = await request()
        return allCommissions;
    }
}