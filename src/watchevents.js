import storehash from "./storehash";

const sunscribeToEvents = () => {
    storehash.events.allEvents()
        .on('data', (event) => {
            console.log(event);
        })
        .on('error', console.error);
};
export default