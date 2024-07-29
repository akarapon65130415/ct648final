const fetch = require('node-fetch');

async function SendToLine(message) {
    const token = 'zfOjx0vO3FpViLiyTusIwSVL2CEbrqImQV5jKGfRVUW'; // ทดสอบ

    const paras = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`
        },
        body: new URLSearchParams({
            'message': message
        })
    };

    const response = await fetch('https://notify-api.line.me/api/notify', paras);

    if (!response.ok) {
        console.error('Error sending message to LINE:', response.statusText);
    } else {
        console.log('Message sent to LINE successfully.');
    }
}

module.exports = {
    SendToLine
};
