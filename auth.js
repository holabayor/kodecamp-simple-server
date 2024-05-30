export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.statusCode = 401;
    res.end(
      JSON.stringify({ success: false, message: 'Authentication required' })
    );
    return;
  }

  const decodedCredentials = Buffer.from(token, 'base64').toString();
  //   console.log(decodedCredentials);
  const [username, password] = decodedCredentials.split(':');

  if (username === 'admin' && password === 'password') {
    next();
  } else {
    res.statusCode = 401;
    res.end(
      JSON.stringify({ success: false, message: 'Authentication required' })
    );
  }
};
