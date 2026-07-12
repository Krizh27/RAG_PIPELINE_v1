import fs from "fs/promises";

async function readFileSync(){
    try{
        const data = await fs.readFile('./knowledge/notes.txt','utf8');
        // console.log(data);
        return data;
    }catch(err){
        console.error(err);
        return "";
    }
}

const Paragraph = await readFileSync();

const chunksArray = Paragraph.split(/\r?\n/).filter(chunk=>chunk.trim()!=="");

chunksArray.forEach(chunk => {
    console.log(chunk);
});


export default chunksArray;
