import React, { useState } from "react";

function PrintComponent() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState(null);

  const handlePrint = async () => {
    let device, server, service, characteristic;

    try {
      device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ["00001101-0000-1000-8000-00805f9b34fb"] }],
      });

      server = await device.gatt.connect();

      service = await server.getPrimaryService("00001101-0000-1000-8000-00805f9b34fb");

      characteristic = await service.getCharacteristic("00001101-0000-1000-8000-00805f9b34fb");

      const encoder = new TextEncoder("utf-8");
      let data = encoder.encode(text);

      await characteristic.writeValue(data);
      setMessage("Текст успешно напечатан!");
    } catch (error) {
      console.error("Ошибка печати:", error);
      setMessage("Ошибка печати, пожалуйста, попробуйте еще раз.");
    }
  };

  return (
    <div>
      <h1>Печать на принтере Bixolon SPP-R200IIIplus</h1>
      <textarea
        placeholder="Введите текст для печати"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button onClick={handlePrint}>Печать</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PrintComponent;
