
import { useEffect, type FC } from "react";
import { type HyphaServer } from "hypha-core";
import { type ComponentProcessProps } from "components/system/Apps/RenderComponent";
import StyledHyphaWindow from "components/apps/HyphaWindow/StyledHyphaWindow";
import useTitle from "components/system/Window/useTitle";
import { useProcesses } from "contexts/process";
import { useFileSystem } from "contexts/fileSystem";
import { useHypha } from "contexts/hypha";


const HyphaWindow: FC<ComponentProcessProps> = ({ id }) => {
  const { prependFileToTitle } = useTitle(id);
  const { readFile } = useFileSystem();
  const hypha: HyphaServer | undefined = useHypha();
  const {
    processes: { [id]: { url = "" } = {} },
    close
  } = useProcesses();

  useEffect(() => {
    prependFileToTitle(url);
  }, [prependFileToTitle, url]);

  useEffect(() => {
    if (!readFile || !hypha || !url) return;

    if (url.startsWith('/')) {
      close(id);

      readFile(url).then(async (pluginContent: Buffer) => {
        try {
          const plugin = await hypha?.api?.loadApp({ src: pluginContent.toString() });

          if (plugin?.run) {
            await plugin.run({ config: {}, data: {} });
          }
        } catch (error) {
          console.error(error);
        }
      });
    }
  }, [readFile, hypha, url, close, id]);


  const HyphaWindowStyle = { height: "100%", width: "100%" };

  if (url.startsWith("http")) {
    return (
      <StyledHyphaWindow $loaded>
        <iframe src={url} style={HyphaWindowStyle} title="ImJoy Window" />
      </StyledHyphaWindow>
    );
  }

  return (
    <StyledHyphaWindow $loaded>
      <div id={url} style={HyphaWindowStyle} />
    </StyledHyphaWindow>
  );
};

export default HyphaWindow;
