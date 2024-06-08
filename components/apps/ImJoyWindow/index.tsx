import { useEffect, type FC } from "react";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import StyledImJoyWindow from "components/apps/ImJoyWindow/StyledImJoyWindow";
import useTitle from "components/system/Window/useTitle";
import { useProcesses } from "contexts/process";

const ImJoyWindow: FC<ComponentProcessProps> = ({ id }) => {
  const { prependFileToTitle } = useTitle(id);
  const {
    processes: { [id]: { url = "" } = {} },
  } = useProcesses();

  useEffect(() => {
    prependFileToTitle(url);
  }, [prependFileToTitle, url]);

  const ImJoyWindowStyle = { height: "100%", width: "100%" };
  if (url.startsWith("http")) {
    return (
      <StyledImJoyWindow $loaded>
        <iframe src={url} style={ImJoyWindowStyle} title="ImJoy Window" />
      </StyledImJoyWindow>
    );
  }

  return (
    <StyledImJoyWindow $loaded>
      <div id={url} style={ImJoyWindowStyle} />
    </StyledImJoyWindow>
  );
};

export default ImJoyWindow;
