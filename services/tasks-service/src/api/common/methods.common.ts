import fs from 'fs';
function isBoolean(value: any) {
    if (value == undefined || value == null) return false;
    return ["true", "false"].includes(value.toString().toLowerCase());
}

function toBoolean(value: any) {
    return value && value.toString().toLowerCase() === "true"
}

export const TypesMethods = {
    isBoolean,
    toBoolean
};


// export const FSMethods = {
//   ensureFolderExist(path: string, createIfNotExist: boolean = true) {
//     const isExist = fs.existsSync(path);
//     if (!isExist && createIfNotExist) {
//       try {
//         fs.mkdirSync(path, {recursive: true})
//       return true;
//       } catch(err) {
//         logger.error(err)
//         return false;
//       }
//     }
//     return isExist
//   }
// }
