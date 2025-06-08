import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const JWT_SECRET =
  "3d20c27cbdd0eadd6ec09cd635a764063aea81ac76eb00c68c2c3c00e73937adfe8615f2b70b935df8597e8d18a3271aebebd8156fa84476f0b1bdefe16e293ffc112224eb14f485f78536b2d51cc36d007053fe8f8223c4bf49ee2a80e8f61cf90ba25bc842fb27f1fb0c4454202ee14d6bbdcd83df3e206df725fe95b30094cfd0bfedb765e044a00cc4720a69ba94cc2aa68acfde43f1b386e795dc1e354ddeef820978bcff86d094ad2a1af35ca97ba45bf50355c2f7e773324db1d16ed770527435ad14ceea139b8be8f307e2f4da5eed4f478728740e48b1fcebd346721214543baf42c2675fdf5e9b03991c8948a2c5dd4bce489aa3e83dd08a160e63";

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "10000h",
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
