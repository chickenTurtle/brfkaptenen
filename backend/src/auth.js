import * as admin from "firebase-admin";

export async function isAuthenticated(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).send({ message: "Unauthorized" });

  if (!authorization.startsWith("Bearer"))
    return res.status(401).send({ message: "Unauthorized" });

  const split = authorization.split("Bearer ");
  if (split.length !== 2)
    return res.status(401).send({ message: "Unauthorized" });

  const token = split[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      role: decodedToken.role,
      email: decodedToken.email,
    };
    if (!decodedToken.email_verified)
      return res.status(401).send({ message: "Not verified" });
    return next();
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized" });
  }
}
