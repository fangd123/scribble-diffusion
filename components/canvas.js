import * as React from "react";
import { useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

import { Undo as UndoIcon, Trash as TrashIcon, Redo as RedoIcon, Eraser as EraserIcon, Pencil as PenIcon } from "lucide-react";

export default function Canvas({
  startingPaths,
  onScribble,
  scribbleExists,
  setScribbleExists,
}) {
  const canvasRef = React.useRef(null);

  useEffect(() => {
    // Hack to work around Firfox bug in react-sketch-canvas
    // https://github.com/vinothpandian/react-sketch-canvas/issues/54
    document
      .querySelector("#react-sketch-canvas__stroke-group-0")
      ?.removeAttribute("mask");

    canvasRef.current.eraseMode(true)
    canvasRef.current.eraseMode(false)
    // loadStartingPaths();
  }, []);

  async function loadStartingPaths() {
    await canvasRef.current.loadPaths(startingPaths);


    setScribbleExists(true);
    onChange();
  }

  const onChange = async () => {
    const paths = await canvasRef.current.exportPaths();
    localStorage.setItem("paths", JSON.stringify(paths, null, 2));

    if (!paths.length) return;

    setScribbleExists(true);

    const data = await canvasRef.current.exportImage("png");
    onScribble(data);
  };

  const undo = () => {
    canvasRef.current.undo();
  };

  const redo = () => {
    canvasRef.current.redo();
  };

  const reset = () => {
    setScribbleExists(false);
    canvasRef.current.resetCanvas();
  };
  const eraser =()=>{
    canvasRef.current.eraseMode(true)
  }

  const pencil =()=>{
    canvasRef.current.eraseMode(false)
  }

  return (
    <div className="relative">
      {scribbleExists || (
        <div>
          <div className="absolute grid w-full h-full p-3 place-items-center pointer-events-none text-xl">
            <span className="opacity-40">Draw something here.</span>
          </div>
        </div>
      )}

      <ReactSketchCanvas
        ref={canvasRef}
        className="w-full aspect-square border-none cursor-crosshair"
        strokeWidth={4}
        strokeColor="black"
        onChange={onChange}
        withTimestamp={true}
      />

      {scribbleExists && (
        <div className="animate-in fade-in duration-700 text-left">
          <button className="lil-button" onClick={pencil}>
            <PenIcon className="icon" />
            Pencil
          </button>
          <button className="lil-button" onClick={eraser}>
            <EraserIcon className="icon" />
            Eraser
          </button>
          <button className="lil-button" onClick={undo}>
            <UndoIcon className="icon" />
            Undo
          </button>
          <button className="lil-button" onClick={reset}>
            <TrashIcon className="icon" />
            Clear
          </button>
          <button className="lil-button" onClick={redo}>
            <RedoIcon className="icon" />
            Redo
          </button>
        </div>
      )}
    </div>
  );
}
