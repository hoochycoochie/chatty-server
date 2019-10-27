import fs from 'fs';

export const dbPubsub = {
    user: 'avnadmin',
    host: 'pg-1fff930a-idyjob58-776d.aivencloud.com',
    database: 'defaultdb',
    password: 'mue8w482ydq6pzaa',
    port: '22841',
    ssl: {
        
        ca: fs.readFileSync(__dirname+'/../../ca.pem').toString(),
        
    }
}