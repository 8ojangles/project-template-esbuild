const RESULTYPESEPERATOR = {
    EMPTY: '',
    SEMICOLON: ';',
};

export const RESULTTYPE = {
    STRING: "string",
    JSON: "json"
};

export const defaultIncludeFiles = {
    json: { resultType: RESULTTYPE.JSON},
    html: { resultType: RESULTTYPE.STRING, separator: RESULTYPESEPERATOR.EMPTY  },
    csv: { resultType: RESULTTYPE.STRING, separator: RESULTYPESEPERATOR.SEMICOLON }
};