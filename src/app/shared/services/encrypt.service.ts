import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import pako from 'pako';
import CryptoJS from 'crypto-js';

const SECRET_KEY = ',Awv-=/z{w*JErWb8_j$aV3)!VwkN:UXC8nHk5?vEac5?V3$j$qv/nMK.Tk77CqTr9n=x4)-%cG'

@Injectable({
  providedIn: 'root'
})
export class EncryptService {
  decrypt = (payload:string) => {
    const bytes = CryptoJS.AES.decrypt(payload, SECRET_KEY);
    const compressed = Buffer.from(bytes.toString(CryptoJS.enc.Base64), 'base64');
    const decompressed = pako.inflate(compressed, { to: 'string' });
    return JSON.parse(decompressed);
  }

  encrypt = (data:any) => {
    const json = JSON.stringify(data);
    const compressed = pako.deflate(json);
    const wordArray = CryptoJS.lib.WordArray.create(compressed);
    const encrypted = CryptoJS.AES.encrypt(wordArray, SECRET_KEY).toString();
    return encrypted;
  }

}
