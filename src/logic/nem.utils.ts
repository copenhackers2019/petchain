import {Address, PublicAccount} from "nem-library";
import * as CryptoJS from "crypto-js";

export const getDogAddress = (chipNumber: string): Address => {
  const pk = CryptoJS.SHA3(chipNumber, { outputLength: 256 }).toString();
  const pa = PublicAccount.createWithPublicKey(pk);
  return pa.address;
};
