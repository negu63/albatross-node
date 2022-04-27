interface Signature {
  version: number;
  publicKey: string;
  encryptedData: string;
  receivedDate: string;
}

export { Signature };
