import * as z from "zod";
 
export const LoginValidator = z.object({
  username: z.string().nonempty("Username cannot be empty"),
  password: z.string().nonempty("Password cannot be empty")
});