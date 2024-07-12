import { TestCard } from "@/components/ui";
import type { IconfigTest } from "@/types";

function MenuTestList({ testQueue }: { testQueue: IconfigTest[] }) {
  return (
    <ul className="flex gap-4 p-2">
      {testQueue.map((test: IconfigTest, index) => {
        const {
          url,
          static_content: { Description, TestIcon },
        } = test;
        return (
          <li key={index}>
            <TestCard Description={Description} Icon={TestIcon} url={url} />
          </li>
        );
      })}
    </ul>
  );
}

export default MenuTestList;
