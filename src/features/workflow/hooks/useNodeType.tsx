// import { create } from "zustand";

// interface NodeTypeProps {
//   type: string | null;
//   setType: (nodeType: string) => void;
// }

// export const useNodeType = create<NodeTypeProps>()((set) => ({
//   type: null,
//   setType: (nodeType: string) => set(() => ({ type: nodeType })),
// }));

import { createContext, ReactNode, useContext, useState } from "react";

type NodeTypeProps = [type: string | null, setType: (_: any) => void];

const DnDContext = createContext<NodeTypeProps>([null, (_) => {}]);

export const DnDProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [type, setType] = useState(null);

  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;
export const useNodeType = () => {
  return useContext(DnDContext);
};
