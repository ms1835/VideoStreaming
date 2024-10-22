import { createContext, useContext, useState } from "react";

const ReactionContext = createContext();

export const useReaction = () => useContext(ReactionContext);

export const ReactionProvider = ({ children }) => {
    const [reaction, setReaction] = useState(false);

    const handleReaction = () => {
        setReaction(!reaction);
    }

    return (
        <ReactionContext.Provider value={{ reaction, handleReaction }}>
            {children}
        </ReactionContext.Provider>
    )
}