import dotenv from "dotenv";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import UserModel from "./../model/user.model";
var jwt = require("jsonwebtoken");

dotenv.config();
// @desc    Login with google
// @route   POST /api/user/google-login
// @access  Public

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http:localhost:3000/google/callback"
);
export const signInWithGoogle = async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken){
    res.status(400).json({
        error: "Google Login Failed",
      }).send();
    return;
  }
  const ticket = await client
    .verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    .then((response) => {
      if (response.getPayload() && response.getPayload()?.email_verified) {
        const email = response.getPayload()?.email;
        const name = response.getPayload()?.name;
        UserModel.findOne({ email }).then((user: any) => {
          if (user) {
            const token = jwt.sign(
              { email: user.email },
              process.env.SUPER_SECRET!,
              { expiresIn: 86400 }
            );
            const { uid, email, name, surname, role } = user;
            return res.json({
              uid,
              name,
              surname,
              email,
              role,
              token,
            });
          } else {
            const password = "";
            const salt = "";
            console.log(response.getPayload());
            const uid = uuidv4();
            user = new UserModel({
              uid,
              name,
              email,
              password,
              salt,
              role: "user",
            });
            user.save((err: Error, data: any) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "Google Login Failed",
                });
              }
              const token = jwt.sign(
                { email: user.email },
                process.env.SUPER_SECRET!,
                { expiresIn: 86400 }
              );
              const { uid, email, name, surname, role } = data;
              return res.json({
                uid,
                name,
                surname,
                email,
                role,
                token,
              });
            });
          }
        });
      }
    });
};
