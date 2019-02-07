export declare type Fields = {
    [x: string]: [string];
};
export declare enum Required {
    ALL = "all",
    NONE = "none",
    RESPECT = "respect"
}
export declare type Config = {
    optionalFields?: Fields;
    requiredFields?: Fields;
    required: Required;
};
export declare type Schema = {
    definitions: {
        [x: string]: any;
    };
    paths: {
        [x: string]: any;
    };
};
