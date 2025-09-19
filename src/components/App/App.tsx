import "./App.css";
import Map from "../Map/Map";
import { Data } from "../../types/Data";
import { Place } from "../../types/Place";
import { useState } from "react";
import chroma from "chroma-js";
import moment from "moment";

async function readDirectory(
  dirHandle: any,
  parentPath: string,
  result: { data: Data }
) {
  try {
    for await (const entry of dirHandle.values()) {
      const fullPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
      if (entry.kind === "file") {
        const file = await entry.getFile();
        const { info, places, trips } = JSON.parse(await file.text());
        const newInfo = {
          id: info.id,
          date: info.date ? moment(info.date) : undefined,
        };
        const travelId = `${info.id}_${
          newInfo.date?.format("YYYY-MM") ?? "undefined"
        }`;
        result.data[travelId] = {
          info: newInfo,
          places: {},
          trips: [],
          color: "",
        };
        const placesEntries = Object.entries(places);
        for (const [placeId, place] of placesEntries) {
          result.data[travelId].places[`${fullPath}_${placeId}`] =
            place as Place;
        }
        for (const trip of trips) {
          result.data[travelId].trips.push({
            from: `${fullPath}_${trip.from}`,
            to: `${fullPath}_${trip.to}`,
            date: trip.date,
          });
        }
      } else if (entry.kind === "directory") {
        await readDirectory(entry, fullPath, result);
      }
    }
  } catch (err) {
    console.error("Access denied or cancelled", err);
  }
}

const loadData = async () => {
  const data: Data = {};
  const folderHandle = await (window as any).showDirectoryPicker();
  await readDirectory(folderHandle, "", { data });
  const keys = Object.keys(data);
  const colors = chroma.scale("Set1").colors(keys.length);
  for (let i = 0; i < keys.length; i++) {
    data[keys[i]].color = colors[i];
  }
  console.log("Loaded data:", data);
  return data;
};

function App() {
  const [data, setData] = useState<Data | null>(null);

  return (
    <div className="App">
      {data !== null ? (
        <Map data={data} />
      ) : (
        <div className="initial-select-container">
          <button
            className="select-folder-button"
            onClick={async () => {
              const data = await loadData();
              setData(data);
            }}
          >
            Select the folder with your travels
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
