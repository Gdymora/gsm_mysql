var SerialPort = require("serialport");
var mysql_gsm = require('./mysql_gsm');

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })

}
//https://alex-exe.ru/radio/wireless/gsm-sim900-at-command/

module.exports = {

    receivedRing: function () {
        var serialPort = new SerialPort("/dev/ttyUSB0", {
            baudRate: 9600
        });



        serialPort.on("open", async function () {

            console.log('Serial communication open');

            serialPort.write("AT\r\n");//или все ОК
            await sleep(100);
            serialPort.write("AT+GMM\r\n");//название модуля
            await sleep(300);
            serialPort.write('AT+CSQ\r\n');//сила сигнала
            await sleep(800);
            serialPort.write('AT+CLIP=1\r\n');//включаем АОН
            await sleep(800);
            serialPort.write('AT+CMGF=1\r\n');// текстовый режим 1
            await sleep(800);
            serialPort.write('AT+DDET=1\r\n');// Включаем DTMF
            await sleep(800);
            serialPort.write('"AT+CMGL=\"REC UNREAD\"\r\n');// Отправляем запрос чтения непрочитанных
            await sleep(800);

 mysql_gsm.selectTelefon(); 
            serialPort.on('data', async function (data) {

                await sleep(800);

                console.log("Received data: " + data.toString());

                var res = /\+CLIP:/.test(data.toString());

                let result = 0;

                if (res) {
                    console.log("--- res: ");
                    result = data.toString().match(/\+([0-9]{12})/);
                }

                if (result.length > 0) {
                    serialPort.write('ATH0\r\n');// разрываем связь 
                    if (result[0] == 'telefon') {
                        console.log("--- Search: " + result[0]);
                        await sleep(2000);
                       
                        serialPort.write("ATDtelefon;\r\n");//звоним
                    }
                }

                //------------------

                if (/\+CMTI:/.test(data.toString())) { // Если есть хоть одно SMS
                    serialPort.write('"AT+CMGL=\"REC UNREAD\"\r\n');// Отправляем запрос чтения непрочитанных
                    console.log("--- SMS: " + data.toString());
                }
                if (/\+CMGL:/.test(data.toString())) {                    // Если есть хоть одно, получаем его индекс

                    console.log("--- SMS: " + data.toString()); // Отправляем текст сообщения на обработку
                }
                //-----------------


            });
        });

        serialPort.on('error', err => {
            console.log('Error', err)
            process.exit(1)
        });
        serialPort.on('close', () => {
            console.log('Serial port disconnected.')
        });


    }

}