import type { ItestGuide } from "@/types/index";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/react";

function TestGuide({
  testName,
  Description,
  Success,
  Fail,
  TestIcon,
  TestNotes,
  goToTest,
}: ItestGuide) {
  return (
    <Card>
      <Button onClick={goToTest}>Hacer el test</Button>
      <h1>{testName}</h1>
      <CardBody>
        {Description}
        {Success}
        {Fail}
        <TestIcon />
        <ul>
          {TestNotes.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

export default TestGuide;
