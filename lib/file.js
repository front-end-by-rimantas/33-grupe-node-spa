import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const file = {};

file.fullPath = (dir, fileName) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.join(__dirname, '../', dir, fileName);
}

file.create = (dir, fileName, content) => {
    const filePath = file.fullPath(dir, fileName);
}

file.read = async (dir, fileName) => {
    const filePath = file.fullPath(dir, fileName);
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent;
    } catch (error) {
        return false;
    }
}

file.update = (dir, fileName, content) => {
    const filePath = file.fullPath(dir, fileName);
}

file.delete = (dir, fileName) => {
    const filePath = file.fullPath(dir, fileName);
}

export { file }