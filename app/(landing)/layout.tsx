import { NuqsAdapter } from "nuqs/adapters/next/app";

type Props = {
  children: React.ReactNode;
};

const LandingLayout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default LandingLayout;
