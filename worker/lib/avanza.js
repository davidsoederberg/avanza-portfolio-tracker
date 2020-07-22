const Avanza = require('avanza');

const avanza = new Avanza();

exports.authenticate = async (credentials) => {
  await avanza.authenticate({
    username: credentials.username,
    password: credentials.password,
    totpSecret: credentials.totpSecret,
  });
};

exports.getTotalCapital = async () => {
  if (!avanza._authenticated) throw new Error('Not authenticated');
  const overview = await avanza.getOverview();
  return overview.totalOwnCapital;
};
