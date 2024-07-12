type MessageType = Error | string | null;
interface MessageProps {
  type: MessageType;
}

function TerminalProcessOutput({ type }: MessageProps) {
  if (type === null) return;

  if (type instanceof Error) {
    return <p className="text-danger-500">{`${type.message} ❌`}</p>;
  }

  return <p className="text-success-500">{`${type} ✔`}</p>;
}

export default TerminalProcessOutput;
