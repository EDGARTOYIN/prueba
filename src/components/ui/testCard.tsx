import type { MyIcon } from "@/types";
import { Card, CardBody, Link } from "@nextui-org/react";

function TestCard({
  Icon,
  Description,
  url,
}: {
  Icon: MyIcon;
  Description: JSX.Element;
  url: string;
}) {
  return (
    <Card isHoverable className="bg-blue-700" isPressable as={Link} href={url} shadow="lg">
      <CardBody className="flex flex-col gap-2 items-center">
        <Icon className={"size-10"} />
        {Description}
      </CardBody>
    </Card>
  );
}

export default TestCard;
