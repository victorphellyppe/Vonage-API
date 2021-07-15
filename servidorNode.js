'use script'

const Hapi = require('@hapi/hapi');
const Nexmo = require('nexmo');
const {
    Console
} = require('console');
const { reject } = require('core-js/fn/promise');

const nexmo = new Nexmo({
    apiKey: "aaf0dcdc",
    apiSecret: "sfaiKcD14UjTGlo5"
}, {
    debug:true
});

const init = async () => {
    const server = Hapi.server({
        port:3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/send-sms',
        options: {
            cors: true,
            handler: async (request, h) => {
                const payload = request.payload;
                const result = await new Promise((resolve, reject) => {
                    nexmo.message.sendSms(payload.from, payload.to, payload.text, (error, response) => {
                        if(error){
                            return reject(error);
                        } else {
                            return resolve(response);
                        }
                    });
                });
                console.log(JSON.stringify(result));
                if(result.messages[0].status === '0'){
                    return { message: 'Funcionou!'};
                } else {
                    return { message: result.messages[0]['error-text']};
                }
            }
        }
    });
    await server.start();
    console.log('Servidor rodando, yes on %s', server.info.uri);
};
    process.on('Rejeição não tratada', (err) => {
        console.log(err);
        process.exit(1);
    });
    init();