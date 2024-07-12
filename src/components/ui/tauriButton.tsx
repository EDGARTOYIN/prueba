import type { IProcess } from "@/types";
import { Button } from "@nextui-org/react";

interface ProcessButtonProps {
  process: IProcess;
  startProcess: (process: IProcess) => Promise<void>;
  isLoading: boolean;
  children: React.ReactNode;
}

function TauriButton({ process, startProcess, isLoading, children }: ProcessButtonProps) {
  const handleClick = () => {
    startProcess(process).catch((e: unknown) => {
      console.error(e);
    });
  };

  return (
    <Button isLoading={isLoading} onClick={handleClick}>
      {children}
    </Button>
  );
}

export default TauriButton;
