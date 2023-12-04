const nwfID = /[^a-zA-Z0-9-_]/g; //not-welcomed-for-ID

export const formatId = (title: string) => title.toLowerCase().replace(nwfID, "");
