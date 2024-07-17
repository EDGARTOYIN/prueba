//@ts-nocheck
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  TauriButton,
  Terminal,
  TerminalMessages,
  TerminalProcessOutput,
} from "@/components/ui";
import { useTauriProcess } from "@/hooks";
import type { IProcess } from "@/types";
import { ButtonGroup } from "@nextui-org/react";

const process: IProcess = {
  action: "test_conn",
  args: {
    ssid: "some network",
    pass: "some pass",
  },
  eventName: "wifi-event",
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { startProcess, data, error, status, messages } = useTauriProcess();

  return (
    <div className="flex-grow">
      <h1 className="text-4xl font-bold text-white pb-2"> WIFI</h1>
      <section className="grid grid-cols-2 gap-10 flex-grow">
        <div className="flex flex-col gap-5 items-center mt-20">
          <h2 className="text-white font-semibold text-lg">
            Pruebas disponibles:
          </h2>
          <section className="flex flex-col gap-5">
            <ButtonGroup size="lg">
              <TauriButton
                process={process}
                startProcess={startProcess}
                isLoading={status === "pending"}
              >
                Probar config a
              </TauriButton>
            </ButtonGroup>
          </section>
        </div>
        <Terminal>
          <TerminalMessages messages={messages} />
          <TerminalProcessOutput type={data ?? error} />
        </Terminal>
      </section>
    </div>
  );
}
