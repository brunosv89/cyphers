import { useState } from "react";
import "./App.css";
import { TextArea, Button, Select, TextField } from "bold-ui";
import {
  encodeCesar,
  encodeVernam,
  encodeVigenere,
  decodeVigenere,
  encodePlayfair,
  decodePlayfair,
  encodeHill,
  decodeHill,
  privateKey,
  publicKey
} from "./cyphers-functions";
import JSEncrypt from "jsencrypt";

function App() {
  const items = ["Cesar", "Vernam", "Vigenère", "Playfair", "Hill", "RSA"];
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState("");
  const [resultado, setResultado] = useState("");
  const [cesarKey, setCesarKey] = useState(3);
  const [vernamKey, setVernamKey] = useState("");
  const [vigenereKey, setVigenereKey] = useState("");
  const [playfairKey, setPlayfairKey] = useState("");
  const hillMatrizKey = [
    [6, 24, 1],
    [13, 16, 10],
    [20, 17, 15],
  ];

  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);

  const decryptor = new JSEncrypt();
  decryptor.setPrivateKey(privateKey);

  const handleChangeValue = (item) => setValue(item);
  const handleChangeMsg = (event) => setMsg(event.target.value);
  const handleChangeCesarKey = (event) => setCesarKey(event.target.value);
  const handleChangeVernamKey = (event) => setVernamKey(event.target.value);
  const handleChangeVigenereKey = (event) => setVigenereKey(event.target.value);
  const handleChangePlayfairKey = (event) => setPlayfairKey(event.target.value);

  const style = {
    button: {
      backgroundColor: "rgb(71, 147, 218)",
      color: "rgb(255, 255, 255)",
      width: "130px",
    },
  };

  const encode = () => {
    switch (value) {
      case "Cesar":
        setResultado(encodeCesar(msg, cesarKey));
        break;
      case "Vernam":
        setResultado(encodeVernam(msg, vernamKey));
        break;
      case "Vigenère":
        setResultado(encodeVigenere(msg, vigenereKey));
        break;
      case "Playfair":
        setResultado(encodePlayfair(msg, vigenereKey));
        break;
      case "Hill":
        setResultado(encodeHill(msg, hillMatrizKey, 26));
        break;
      case "RSA":
        setResultado(encryptor.encrypt(msg));
        break;
      default:
        console.log("ERRO");
    }
  };

  const decode = () => {
    switch (value) {
      case "Cesar":
        setResultado(encodeCesar(msg, -cesarKey));
        break;
      case "Vernam":
        setResultado(encodeVernam(msg, vernamKey));
        break;
      case "Vigenère":
        setResultado(decodeVigenere(msg, vigenereKey));
        break;
      case "Playfair":
        setResultado(decodePlayfair(msg, vigenereKey));
        break;
      case "Hill":
        setResultado(decodeHill(msg, hillMatrizKey, 26));
        break;
      case "RSA":
        setResultado(decryptor.decrypt(msg));
        break;
      default:
        console.log("ERRO");
    }
  };

  // renderização da interface
  return (
    <div className="App">
      <header className="App-header">
        <p>Cyphers</p>
      </header>
      <div className="App-body">
        <TextArea
          label="Digite a mensagem: "
          style={{ width: "400px", height: "80px" }}
          onChange={handleChangeMsg}
          value={msg}
        />
      </div>
      <div className="App-select">
        <Select
          items={items}
          placeholder="Selecione a cifra"
          value={value}
          onChange={handleChangeValue}
          required
        />
      </div>
      {value === "Cesar" && (
        <div className="App-cesarKey">
          <TextField
            label="Chave"
            onChange={handleChangeCesarKey}
            placeholder={cesarKey}
            required
          />
        </div>
      )}
      {value === "Vernam" && (
        <div className="App-vernamKey">
          <TextArea
            label="Informe a chave: "
            style={{ width: "400px", height: "40px" }}
            onChange={handleChangeVernamKey}
            value={vernamKey}
            required
          />
        </div>
      )}
      {value === "Vigenère" && (
        <div className="App-vigenereKey">
          <TextArea
            label="Informe a chave: "
            style={{ width: "400px", height: "40px" }}
            onChange={handleChangeVigenereKey}
            value={vigenereKey}
            required
          />
        </div>
      )}
      {value === "Playfair" && (
        <div className="App-playfairKey">
          <TextField
            label="Chave"
            onChange={handleChangePlayfairKey}
            placeholder={playfairKey}
            style={{ width: "400px" }}
            required
          />
        </div>
      )}
      <div className="App-buttons">
        <Button style={style.button} onClick={encode}>
          Criptografar
        </Button>
        <Button style={style.button} onClick={decode}>
          Descriptografar
        </Button>
      </div>
      <div className="App-result">
        <p> Resultado: </p>
        <p> {resultado} </p>
      </div>
    </div>
  );
}

export default App;
