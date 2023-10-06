const MailComposer = require("nodemailer/lib/mail-composer");
const crypto = require("crypto");

function hashCode(user) {
  const str = user.displayName + user.email;
  return crypto.createHash("md5").update(str).digest("hex");
}

const encodeMessage = (message) => {
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const createEmail = async (user) => {
  const link = `https://kaptenenbrf.org/verify?hash=${hashCode(user)}&email=${
    user.email
  }`;

  const options = {
    from: `"Kaptenen BRF" <styrelsen@kaptenenbrf.org>`,
    to: user.email,
    subject: `Bokningssytem: Verfiera konto för ${user.displayName}`,
    html: `<p style="font-size: 20px;">Verifiera kontot</p>
    Namn: ${user.displayName}
    <br />
    Email: ${user.email}
    <br />
    <br />
    <a href="${link}">Tryck här för att godkänna kontot</a>`,
    textEncoding: "base64",
  };
  const mail = new MailComposer(options);
  const message = await mail.compile().build();
  return encodeMessage(message);
};

export { hashCode, createEmail };
