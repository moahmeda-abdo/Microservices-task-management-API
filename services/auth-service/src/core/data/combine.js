const fs  = require('fs')
const path = require('path')
const countries = require("./countries.json") 
const data = [];
(async function combine() {
    for (const c of countries) {
        try {

            const cities = require(`./cities/${c.country_code.toLowerCase()}.cities.json`);

            const record = {
                name: c.name,
                code: c.code,
                country_code: c.country_code,
                flag: `/static/images/country_flags/${c.code.toLowerCase()}.svg`,
                cities: cities.map(({name, priority, country_name, country_code, ar_name, en_name}) => ({
                    name, names: {
                        en: en_name,
                        ar: ar_name,
                    },
                    priority,
                    country: {
                        name: country_name,
                        code: country_code,
                    }
                }))
            }
            data.push(record)

        } catch(err) {
            console.log(err);
            continue;
        }
    }

    fs.writeFileSync("countries_data.json", JSON.stringify(data));
})()