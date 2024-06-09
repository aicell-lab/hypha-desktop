import { useEffect, type FC } from "react";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import StyledImJoyWindow from "components/apps/ImJoyWindow/StyledImJoyWindow";
import useTitle from "components/system/Window/useTitle";
import { useProcesses } from "contexts/process";
import { useFileSystem } from "contexts/fileSystem";
import { useImJoy } from "contexts/imjoy";

const ImJoyWindow: FC<ComponentProcessProps> = ({ id }) => {
  const { prependFileToTitle } = useTitle(id);
  const { readFile } = useFileSystem();
  const imjoy = useImJoy();
  const {
    processes: { [id]: { url = "" } = {} },
    close
  } = useProcesses();
  useEffect(() => {
    prependFileToTitle(url);
  }, [prependFileToTitle, url]);

  useEffect(() => {
    if (!readFile || !imjoy || !url) return;
    if (url.startsWith('/')) {
      close(id);
      readFile(url).then(async (pluginContent) => {
        const p = await imjoy.api.loadPlugin({ src: pluginContent.toString() });
        await p.setup()
        if (p.run) await p.run({ config: {}, data: {} });
      });
    }
  }, [readFile, imjoy, url, close, id]);

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
