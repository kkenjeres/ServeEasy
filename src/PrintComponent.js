import React, { useState } from "react";

function PrintComponent() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState(null);
  const apiUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://server-pi-opal.vercel.app/";

  const handlePrint = async () => {
    try {
      const response = await fetch(`${apiUrl}/print`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
  
      if (response.ok) {
        setMessage("Текст успешно напечатан!");
      } else {
        const errorData = await response.json();
        console.error("Ошибка печати:", errorData);
        setMessage("Ошибка печати, пожалуйста, попробуйте еще раз.");
      }
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
      setMessage("Ошибка печати, пожалуйста, попробуйте еще раз.");
    }
  };
  

  return (
    <div>
      <h1>Печать на принтере Epson TM30</h1>
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