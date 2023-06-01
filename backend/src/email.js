const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_ACCOUNT,
        pass: process.env.GOOGLE_PASSWORD
    }
});

function hashCode(user) {
    let str = user.displayName + user.email;
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
}

let sendMail = (user) => {
    let link = `https://brfkaptenen-8d5d3.web.app/verify?hash=${hashCode(user)}&email=${user.email}`;
    const mailOptions = {
        from: `BRF Kaptenen Bokningssida <${process.env.GOOGLE_ACCOUNT}>`,
        to: 'kaptenenbrf@gmail.com',
        subject: `Bokningssytem: Verfiera konto för ${user.displayName}`,
        html: `<p style="font-size: 20px;">Verifiera kontot</p>
                Namn: ${user.displayName}
                <br />
                Email: ${user.email}
                <br />
                <br />
                <a href="${link}">Tryck här för att godkänna kontot</a>
        `
    };

    return transporter.sendMail(mailOptions)
}

export { hashCode, sendMail };