function TerminalMessages({ messages }: { messages: string[] }) {
  return (
    <section>
      <ul>
        {messages.map((text, index) => {
          return (
            <li className="text-orange-500" key={index}>
              * {text}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default TerminalMessages;
