declare type Fields = {
    [x: string]: [string];
};
declare enum Required {
    ALL = "all",
    NONE = "none",
    RESPECT = "respect"
}
declare type Config = {
    optionalFields?: Fields;
    requiredFields?: Fields;
    required: Required;
};
export default function convert(filePath: string, config: Config): {
    definitions: {};
    paths: {};
};
export {};
