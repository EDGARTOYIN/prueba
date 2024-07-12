type IconSVGProps = React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> &
  React.RefAttributes<SVGSVGElement>;
type IconProps = IconSVGProps & {
  title?: string;
  titleId?: string;
};

type MyIcon = React.FC<IconProps>;

interface ItestProps {
  testName: string;
  Description: JSX.Element;
  Success: JSX.Element;
  Fail: JSX.Element;
  TestIcon: MyIcon;
  TestNotes: string[];
}

interface ItestGuide extends ItestProps {
  goToTest: () => void;
}

interface IresultTest {
  testName: string;
  result: boolean;
  message?: string;
}

interface IconfigTest {
  url: string;
  static_content: ItestProps;
}

interface IconfigFileTest {
  configName: string;
  testQueue: IconfigTest[];
}

interface IuseStoreTest {
  index: number;
  results: IresultTest[];
  config: IconfigTest[];
  increaseIndex: () => void;
  updateResults: (newResults: IresultTest) => void;
}

interface Ilogin {
  ct: string;
  numEmployee: string;
}

interface IProcess {
  action: string;
  args?: Record<string, string | number>;
  eventName?: string;
}

export type {
  ItestProps,
  ItestGuide,
  IconfigFileTest,
  IresultTest,
  IuseStoreTest,
  IconfigTest,
  Ilogin,
  MyIcon,
  IProcess,
};
