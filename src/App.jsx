// import "./App.scss";
import s from "./App.module.scss";
import useCustomStore from "./CostumStore";
import Canvas from "./components/canvas/Canvas";
import Picker from "./components/picker/Picker";
import Search from "./components/search/Search";
import Song from "./components/song/Song";

const App = () => {
  const songs = useCustomStore((state) => state.songs);

  return (
    <div>
      <div className={s.songs}>
        {songs.map((song, key) => {
          return <Song key={key} data={song} />;
        })}
      </div>
      <Search />
      <Canvas />
      <Picker />
    </div>
  );
};

export default App;
