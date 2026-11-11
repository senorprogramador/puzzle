import {
  createHash,
  generateKeyPairSync,
  randomBytes,
  sign,
} from "node:crypto";

const encodeCborHead = (majorType, value) => {
  if (value < 24) {
    return Buffer.from([(majorType << 5) | value]);
  }

  if (value <= 0xff) {
    return Buffer.from([(majorType << 5) | 24, value]);
  }

  if (value <= 0xffff) {
    const result = Buffer.alloc(3);
    result[0] = (majorType << 5) | 25;
    result.writeUInt16BE(value, 1);

    return result;
  }

  if (value <= 0xffffffff) {
    const result = Buffer.alloc(5);
    result[0] = (majorType << 5) | 26;
    result.writeUInt32BE(value, 1);

    return result;
  }

  throw new RangeError("CBOR integer is too large.");
};

const encodeCbor = (value) => {
  if (value instanceof Uint8Array) {
    const bytes = Buffer.from(value);

    return Buffer.concat([encodeCborHead(2, bytes.length), bytes]);
  }

  if (typeof value === "string") {
    const bytes = Buffer.from(value, "utf8");

    return Buffer.concat([encodeCborHead(3, bytes.length), bytes]);
  }

  if (typeof value === "number" && Number.isInteger(value)) {
    if (value >= 0) {
      return encodeCborHead(0, value);
    }

    return encodeCborHead(1, -1 - value);
  }

  if (value instanceof Map) {
    const entries = [...value.entries()];

    return Buffer.concat([
      encodeCborHead(5, entries.length),
      ...entries.flatMap(([key, entryValue]) => [
        encodeCbor(key),
        encodeCbor(entryValue),
      ]),
    ]);
  }

  throw new TypeError("Unsupported CBOR fixture value.");
};

const encodeBase64Url = (value) => Buffer.from(value).toString("base64url");

const createClientDataJSON = (type, challenge, origin) =>
  Buffer.from(
    JSON.stringify({
      type,
      challenge,
      origin,
      crossOrigin: false,
    }),
    "utf8",
  );

const createAuthenticatorData = ({ rpId, flags, counter }) => {
  const result = Buffer.alloc(37);

  createHash("sha256").update(rpId).digest().copy(result, 0);

  result[32] = flags;
  result.writeUInt32BE(counter, 33);

  return result;
};

export const createWebAuthnCredentialFixture = ({
  challenge,
  origin = "https://example.com",
  rpId = "example.com",
}) => {
  const { privateKey } = generateKeyPairSync("ec", {
    namedCurve: "prime256v1",
  });

  const privateJwk = privateKey.export({
    format: "jwk",
  });

  const credentialId = randomBytes(32);
  const credentialIdBase64Url = encodeBase64Url(credentialId);

  const x = Buffer.from(privateJwk.x, "base64url");
  const y = Buffer.from(privateJwk.y, "base64url");

  const cosePublicKey = encodeCbor(
    new Map([
      [1, 2],
      [3, -7],
      [-1, 1],
      [-2, x],
      [-3, y],
    ]),
  );

  const authenticatorData = createAuthenticatorData({
    rpId,
    flags: 0x45,
    counter: 0,
  });

  const attestedCredentialData = Buffer.concat([
    authenticatorData,
    Buffer.alloc(16),
    Buffer.from([
      (credentialId.length >> 8) & 0xff,
      credentialId.length & 0xff,
    ]),
    credentialId,
    cosePublicKey,
  ]);

  const attestationObject = encodeCbor(
    new Map([
      ["fmt", "none"],
      ["attStmt", new Map()],
      ["authData", attestedCredentialData],
    ]),
  );

  const clientDataJSON = createClientDataJSON(
    "webauthn.create",
    challenge,
    origin,
  );

  const registrationResponse = {
    id: credentialIdBase64Url,
    rawId: credentialIdBase64Url,
    type: "public-key",
    authenticatorAttachment: "platform",
    clientExtensionResults: {},
    response: {
      clientDataJSON: encodeBase64Url(clientDataJSON),
      attestationObject: encodeBase64Url(attestationObject),
      transports: ["internal"],
    },
  };

  const createAuthenticationResponse = ({
    challenge: authenticationChallenge,
    counter = 1,
    responseOrigin = origin,
    responseRpId = rpId,
  }) => {
    const clientData = createClientDataJSON(
      "webauthn.get",
      authenticationChallenge,
      responseOrigin,
    );

    const assertionAuthenticatorData = createAuthenticatorData({
      rpId: responseRpId,
      flags: 0x05,
      counter,
    });

    const clientDataHash = createHash("sha256").update(clientData).digest();

    const signature = sign(
      "sha256",
      Buffer.concat([assertionAuthenticatorData, clientDataHash]),
      privateKey,
    );

    return {
      id: credentialIdBase64Url,
      rawId: credentialIdBase64Url,
      type: "public-key",
      authenticatorAttachment: "platform",
      clientExtensionResults: {},
      response: {
        clientDataJSON: encodeBase64Url(clientData),
        authenticatorData: encodeBase64Url(assertionAuthenticatorData),
        signature: encodeBase64Url(signature),
        userHandle: null,
      },
    };
  };

  return {
    credentialId: credentialIdBase64Url,
    registrationResponse,
    createAuthenticationResponse,
  };
};
