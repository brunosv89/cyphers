/* eslint-disable no-undef */
export const encodeCesar = (msg, deslocamento) => {
  let resultado = "";

  for (let i = 0; i < msg.length; i++) {
    let char = msg[i];

    if (char.match(/[a-z]/i)) {
      const codigoAtual = msg.charCodeAt(i);
      let codigoCriptografado;

      if (char.match(/[a-z]/)) {
        codigoCriptografado = ((codigoAtual - 97 + deslocamento) % 26) + 97;
      } else if (char.match(/[A-Z]/)) {
        codigoCriptografado = ((codigoAtual - 65 + deslocamento) % 26) + 65;
      }

      resultado += String.fromCharCode(codigoCriptografado);
    } else {
      resultado += char;
    }
  }

  return resultado;
};

export const encodeVernam = (msg, chave) => {
  let mensagemCriptografada = "";
  let resultado = "";
  for (let i = 0; i < msg.length; i++) {
    const mensagemCharCode = msg.charCodeAt(i) - 65; // Converter para número (A=0, B=1, ..., Z=25)
    const chaveCharCode = chave.charCodeAt(i) - 65;

    // Aplicar a operação XOR módulo 26
    const resultadoCharCode = (mensagemCharCode ^ chaveCharCode) % 26;

    // Converter o resultado de volta para caractere
    mensagemCriptografada += String.fromCharCode(resultadoCharCode + 65); // Converter de volta para caractere maiúsculo
    resultado = mensagemCriptografada.toLowerCase();
  }

  return resultado;
};

export const encodeVigenere = (mensagem, chave) => {
  mensagem = mensagem.toUpperCase(); // Converter a mensagem para maiúsculas
  chave = chave.toUpperCase(); // Converter a chave para maiúsculas

  let mensagemCriptografada = "";
  let chaveIndex = 0;

  for (let i = 0; i < mensagem.length; i++) {
    const mensagemChar = mensagem.charAt(i);
    const mensagemCharCode = mensagemChar.charCodeAt(0) - 65; // Converter de A=0, B=1, ..., Z=25

    if (mensagemCharCode >= 0 && mensagemCharCode <= 25) {
      const chaveChar = chave.charAt(chaveIndex % chave.length);
      const chaveCharCode = chaveChar.charCodeAt(0) - 65; // Converter de A=0, B=1, ..., Z=25

      const resultadoCharCode = (mensagemCharCode + chaveCharCode) % 26; // Aplicar a cifra

      const resultadoChar = String.fromCharCode(resultadoCharCode + 65); // Converter de volta para o caractere
      mensagemCriptografada += resultadoChar;

      chaveIndex++;
    } else {
      // Se o caractere não for uma letra, mantenha-o inalterado
      mensagemCriptografada += mensagemChar;
    }
  }

  return mensagemCriptografada.toLowerCase();
};

export const decodeVigenere = (mensagem, chave) => {
  mensagem = mensagem.toUpperCase();
  chave = chave.toUpperCase();

  let mensagemOriginal = "";
  let chaveIndex = 0;

  for (let i = 0; i < mensagem.length; i++) {
    const mensagemChar = mensagem.charAt(i);
    const mensagemCharCode = mensagemChar.charCodeAt(0) - 65;

    if (mensagemCharCode >= 0 && mensagemCharCode <= 25) {
      const chaveChar = chave.charAt(chaveIndex % chave.length);
      const chaveCharCode = chaveChar.charCodeAt(0) - 65;

      const resultadoCharCode = (mensagemCharCode - chaveCharCode + 26) % 26; // Aplicar a decifra

      const resultadoChar = String.fromCharCode(resultadoCharCode + 65);
      mensagemOriginal += resultadoChar;

      chaveIndex++;
    } else {
      mensagemOriginal += mensagemChar;
    }
  }

  return mensagemOriginal.toLowerCase();
};

///////////////////////////////////////////////////////////////////////////////////////////////
/////// CIFRA DE PLAYFAIR

function createPlayfairMatrix(key) {
  const matrix = Array(5)
    .fill(null)
    .map(() => Array(5).fill(null));
  const keySet = new Set();
  let alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // Excluir a letra J

  key = key.toUpperCase().replace(/J/g, "I"); // Substituir J por I e converter para maiúsculas

  let row = 0;
  let col = 0;

  for (let i = 0; i < key.length; i++) {
    const letter = key[i];
    if (!keySet.has(letter)) {
      matrix[row][col] = letter;
      keySet.add(letter);

      if (col === 4) {
        col = 0;
        row++;
      } else {
        col++;
      }
    }
  }

  for (let i = 0; i < 25; i++) {
    const letter = alphabet[i];
    if (!keySet.has(letter)) {
      matrix[row][col] = letter;

      if (col === 4) {
        col = 0;
        row++;
      } else {
        col++;
      }
    }
  }

  return matrix;
}

function findLetterPosition(matrix, letter) {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (matrix[row][col] === letter) {
        return { row, col };
      }
    }
  }
  return null;
}

export const encodePlayfair = (msg, key) => {
  const matrix = createPlayfairMatrix(key);
  msg = msg.toUpperCase().replace(/J/g, "I"); // Substituir J por I e converter para maiúsculas
  msg = msg.replace(/[^A-Z]/g, ""); // Remover caracteres não alfabéticos
  let ciphertext = "";

  for (let i = 0; i < msg.length; i += 2) {
    let pair = msg.slice(i, i + 2);

    if (pair.length === 1) {
      pair += "X"; // Adicionar X se o par tiver apenas uma letra
    }

    const pos1 = findLetterPosition(matrix, pair[0]);
    const pos2 = findLetterPosition(matrix, pair[1]);

    let encryptedPair = "";

    if (pos1.row === pos2.row) {
      encryptedPair += matrix[pos1.row][(pos1.col + 1) % 5];
      encryptedPair += matrix[pos2.row][(pos2.col + 1) % 5];
    } else if (pos1.col === pos2.col) {
      encryptedPair += matrix[(pos1.row + 1) % 5][pos1.col];
      encryptedPair += matrix[(pos2.row + 1) % 5][pos2.col];
    } else {
      encryptedPair += matrix[pos1.row][pos2.col];
      encryptedPair += matrix[pos2.row][pos1.col];
    }

    ciphertext += encryptedPair;
  }

  return ciphertext.toLowerCase();
};

export const decodePlayfair = (msg, key) => {
  const matrix = createPlayfairMatrix(key);
  let plaintext = "";
  let cypherMsg = msg.toUpperCase();

  for (let i = 0; i < cypherMsg.length; i += 2) {
    let pair = cypherMsg.slice(i, i + 2);

    const pos1 = findLetterPosition(matrix, pair[0]);
    const pos2 = findLetterPosition(matrix, pair[1]);

    let decryptedPair = "";

    if (pos1.row === pos2.row) {
      decryptedPair += matrix[pos1.row][(pos1.col + 4) % 5];
      decryptedPair += matrix[pos2.row][(pos2.col + 4) % 5];
    } else if (pos1.col === pos2.col) {
      decryptedPair += matrix[(pos1.row + 4) % 5][pos1.col];
      decryptedPair += matrix[(pos2.row + 4) % 5][pos2.col];
    } else {
      decryptedPair += matrix[pos1.row][pos2.col];
      decryptedPair += matrix[pos2.row][pos1.col];
    }

    plaintext += decryptedPair;
  }

  return plaintext.toLowerCase();
};

///////////////////////////////////////////////////////////////////////////////////////////////
/////// CIFRA DE HILL

// Função para calcular o determinante de uma matriz
function determinant(matrix) {
  if (matrix.length === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  } else {
    let det = 0;
    for (let i = 0; i < matrix.length; i++) {
      const minor = [];
      for (let j = 1; j < matrix.length; j++) {
        minor.push(matrix[j].slice(0, i).concat(matrix[j].slice(i + 1)));
      }
      det += matrix[0][i] * determinant(minor) * (i % 2 === 0 ? 1 : -1);
    }
    return det;
  }
}

// Função para calcular o inverso modular de um número
function modInverse(num, mod) {
  for (let x = 1; x < mod; x++) {
    if ((num * x) % mod === 1) {
      return x;
    }
  }
  return null; // Inverso modular não existe
}

// Função para encontrar a matriz inversa de uma matriz n x n
function findMatrixInverse(matrix, mod) {
  const det = determinant(matrix);
  const modInv = modInverse(det, mod);

  if (modInv === null) {
    throw new Error("A matriz chave não é inversível.");
  }

  const n = matrix.length;
  const adjugate = Array.from({ length: n }, () => Array(n));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const minor = [];
      for (let row = 0; row < n; row++) {
        if (row !== i) {
          minor.push(matrix[row].filter((_, col) => col !== j));
        }
      }
      adjugate[i][j] = determinant(minor) * ((i + j) % 2 === 0 ? 1 : -1);
    }
  }

  // Calcule o inverso modular para cada elemento da matriz adjugada
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      adjugate[i][j] = (adjugate[i][j] * modInv) % mod;
    }
  }

  return adjugate;
}

// Função para cifrar uma mensagem usando a Cifra de Hill
export const encodeHill = (message, keyMatrix, mod) => {
  if (message.length % keyMatrix.length !== 0) {
    return "ERRO: O tamanho da mensagem deve ser um múltiplo do tamanho da matriz chave.";
  }

  message = message.toUpperCase().replace(/[^A-Z]/g, ""); // Converter para maiúsculas e remover caracteres não alfabéticos
  const n = keyMatrix.length;
  let ciphertext = "";

  for (let i = 0; i < message.length; i += n) {
    const block = message.slice(i, i + n);
    const blockVector = block.split("").map((char) => char.charCodeAt(0) - 65); // Converter letras para números (A=0, B=1, ..., Z=25)
    const resultVector = [];

    for (let row = 0; row < n; row++) {
      let sum = 0;
      for (let col = 0; col < n; col++) {
        sum += keyMatrix[row][col] * blockVector[col];
      }
      resultVector.push(sum % mod);
    }

    ciphertext += resultVector
      .map((num) => String.fromCharCode(num + 65))
      .join(""); // Converter números de volta para letras
  }

  return ciphertext;
};

// Função para decifrar uma mensagem usando a Cifra de Hill
export const decodeHill = (ciphertext, keyMatrix, mod) => {
  if (ciphertext.length % keyMatrix.length !== 0) {
    throw new Error(
      "O tamanho da mensagem criptografada deve ser um múltiplo do tamanho da matriz chave."
    );
  }

  const inverseMatrix = findMatrixInverse(keyMatrix, mod);
  const n = keyMatrix.length;
  let plaintext = "";

  for (let i = 0; i < ciphertext.length; i += n) {
    const block = ciphertext.slice(i, i + n);
    const blockVector = block.split("").map((char) => char.charCodeAt(0) - 65); // Converter letras para números (A=0, B=1, ..., Z=25)
    const resultVector = [];

    for (let row = 0; row < n; row++) {
      let sum = 0;
      for (let col = 0; col < n; col++) {
        sum += inverseMatrix[row][col] * blockVector[col];
      }
      resultVector.push(((sum % mod) + mod) % mod); // Lidar com números negativos
    }

    plaintext += resultVector
      .map((num) => String.fromCharCode(num + 65))
      .join(""); // Converter números de volta para letras
  }

  return plaintext;
};

///////////////////////////////////////////////////////////////////////////////////////////////
/////// CIFRA RSA

// geradores de chave RSA para react não funcionam direito, apenas no node
// portanto foram utilizadas chaves fixas:
export const publicKey = `
-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHVqilOUTbd6f0Y8Q4xsa+mbcPAz
fjd8SoGMwu+bBfzW1gskc/oDeiSRDFJfx39ho5MsfM+bkb1sdD5KBhgXmyBLpOjx
wIwOgI2JNzrPNEMNPRcUbC8IqoSUTIp2VUZ0KJ1FH3LgekFz6SNfYcxXkn+xwKUX
Cvjt14x+R+egSVpnAgMBAAE=
-----END PUBLIC KEY-----
`;

export const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgHVqilOUTbd6f0Y8Q4xsa+mbcPAzfjd8SoGMwu+bBfzW1gskc/oD
eiSRDFJfx39ho5MsfM+bkb1sdD5KBhgXmyBLpOjxwIwOgI2JNzrPNEMNPRcUbC8I
qoSUTIp2VUZ0KJ1FH3LgekFz6SNfYcxXkn+xwKUXCvjt14x+R+egSVpnAgMBAAEC
gYBE3vY+Kgof6glHgEe60UnG37cyHXIWR6BINvGMq6iqcrVgGcSxTGLTmgTZOHcD
H5lb1UdsWvr0We4hLzg933LMhgIVHI0nIg0/F1seRDfK7c9K0xgtQC5StUoi0PNl
JIzEahXhp8wNfSDgs1aKCzLB/qA45MsEsZP6XYokFBzpqQJBALcGM8/R59hukKAK
me7fZ2t8RJiPLACPkk3072/Ev9EK9OKv88M/5SGpEXmgrNvsPm3QP5HpIASq++QB
bVlD0LsCQQCkO4oPnCiFnAa5F0fIUsksmMmSHpsuHu+qs+gEJU5za7OKTehPh5Ae
PJhCXgNO5FIa12t11EKe45AsSF8a0MhFAkBYkH7H5Ln9CFuhph+g8KgZ4hNLg5R2
XQMeCBVJD3sGi/e+LgiWBbg51pcnNPIQpbv75ZatY5Ljz11+kpY4aNF7AkB9+B0h
dAmw0chmV/D7OmSMDHUv2sH0Uk5KhMvFwke2SDniL3es6LImPxwaa7nl3UMMy4bl
TfX7oViIXspz6whxAkAT72zTNmSh2q3WXTemdeKl9Q70/VgrmOYKB/gtrXAT7tT7
sxWLDaBPXnjlO8dfd8wzOL0mEeyjLjf9DiNRHyVM
-----END RSA PRIVATE KEY-----
`;

// para fazer a encriptação foi utilizada API JSEncrypt